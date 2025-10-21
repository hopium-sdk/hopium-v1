import { T_QnLog } from "../../schema";
import { decodePoolChangedLog } from "../../utils/logs/filter-logs/pool-changed";
import { CacheManager } from "../../helpers/cache-manager";
import { T_Pool } from "../../../../../../../../packages/convex/convex/schema/pools";
import { normalizeAddress } from "@repo/common/utils/address";
import { upsertPoolsToQn } from "../../utils/qn/upsert-assets";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";

export const _saveNewPools = async ({ logs, cache }: { logs: T_QnLog[]; cache: CacheManager }) => {
  const decodedLogs = logs.map((log) => ({ log, decoded: decodePoolChangedLog({ log }) }));

  const newPools = _processNewPools({ logs: decodedLogs, cache });

  for (const { pool, blockNumber } of newPools) {
    cache.addEntity({ entity: "pool", id: normalizeAddress(pool.address), value: pool, blockNumber: blockNumber });

    const wethAddress = COMMON_CONSTANTS.addresses.weth[COMMON_CONSTANTS.networkSelected];
    const assetAddress = pool.details.token0 === wethAddress ? pool.details.token1 : pool.details.token0;
    const asset = cache.getEntity({ entity: "asset", id: normalizeAddress(assetAddress) });
    if (!asset) {
      continue;
    }

    asset.poolAddress = normalizeAddress(pool.address);
    cache.addEntity({ entity: "asset", id: normalizeAddress(assetAddress), value: asset, blockNumber: blockNumber });
  }

  await upsertPoolsToQn({ addresses: newPools.map(({ pool }) => pool.address) });
};

export const _getPreloadEntitiesForNewPools = async ({ logs }: { logs: T_QnLog[] }) => {
  const decodedLogs = logs.map((log) => ({ log, decoded: decodePoolChangedLog({ log }) }));
  const poolAddresses = decodedLogs.flatMap(({ decoded }) => normalizeAddress(decoded.args.poolAddress));

  const assetAddresses = [...new Set(decodedLogs.flatMap(({ decoded }) => [normalizeAddress(decoded.args.t0), normalizeAddress(decoded.args.t1)]))];
  return { poolAddresses: [...new Set(poolAddresses)], assetAddresses: [...new Set(assetAddresses)] };
};

export const _processNewPools = ({ logs, cache }: { logs: { log: T_QnLog; decoded: ReturnType<typeof decodePoolChangedLog> }[]; cache: CacheManager }) => {
  // Normalize once, track earliest sync block and latest decoded snapshot per pool
  const addrToSyncBlock = new Map<string, number>();
  const addrToDecoded = new Map<string, ReturnType<typeof decodePoolChangedLog>>();

  for (const { log, decoded } of logs) {
    const bn = Number(log.blockNumber);
    const address = normalizeAddress(decoded.args.poolAddress);

    // earliest block for sync
    const prevBn = addrToSyncBlock.get(address);
    if (prevBn === undefined || bn < prevBn) {
      addrToSyncBlock.set(address, bn);
    }

    // store the latest decoded (so details/prices are the freshest)
    const prevLatest = addrToDecoded.get(address);
    if (!prevLatest) {
      addrToDecoded.set(address, decoded);
    } else {
      // if you prefer most recent by block number, replace when newer
      const prevBnForLatest = Number(prevBn ?? 0);
      if (bn >= prevBnForLatest) addrToDecoded.set(address, decoded);
    }
  }

  const poolAddresses = [...addrToSyncBlock.keys()];

  const cachedPools = cache.getAllEntities({ entity: "pool" }) as T_Pool[];
  const cachedPoolsMap = new Map(cachedPools.map((p) => [normalizeAddress(p.address), p]));

  const newPoolAddresses = poolAddresses.filter((address) => !cachedPoolsMap.has(normalizeAddress(address)));

  type T_NewPool = {
    pool: T_Pool;
    blockNumber: number;
  };
  const newPools: T_NewPool[] = newPoolAddresses
    .map((address) => {
      const norm = normalizeAddress(address);
      const syncBlockNumber = addrToSyncBlock.get(norm)!; // exists by construction
      const decoded = addrToDecoded.get(norm)!; // exists by construction

      //if none of the tokens in pool are weth, skip
      if (![decoded.args.t0, decoded.args.t1].includes(COMMON_CONSTANTS.addresses.weth[COMMON_CONSTANTS.networkSelected])) {
        return null;
      }

      const pool: T_Pool = {
        docId: norm,
        address: norm,
        isV3Pool: decoded.args.isV3Pool,
        details: {
          token0: decoded.args.t0,
          token1: decoded.args.t1,
          decimals0: decoded.args.d0,
          decimals1: decoded.args.d1,
        },
        stats: {
          price: {
            eth: 0,
            usd: 0,
          },
          volumeUsd: 0,
          liquidityUsd: 0,
          mcapUsd: 0,
        },
      };

      return { pool, blockNumber: syncBlockNumber };
    })
    .filter((pool) => pool !== null);

  return newPools;
};
