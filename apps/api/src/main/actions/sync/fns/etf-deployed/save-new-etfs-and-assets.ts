import { T_QnLog } from "../../schema";
import { decodeEtfDeployedLog } from "../../utils/logs/filter-logs/etf-deployed";
import { T_Asset, T_Etf } from "@repo/convex/schema";
import { CacheManager } from "../../helpers/cache-manager";
import { fetchAssetDetails } from "../../utils/assets/fetch-asset-details";
import { batchRetry } from "@/main/utils/fn-executors/batch-retry";
import { normalizeAddress } from "@repo/common/utils/address";

export const _saveNewEtfsAndAssets = async ({ logs, cache }: { logs: T_QnLog[]; cache: CacheManager }) => {
  const decodedLogs = logs.map((log) => ({ log, decoded: decodeEtfDeployedLog({ log }) }));

  const newEtfs = _processNewEtfs({ logs: decodedLogs });
  const newAssets = await _processNewAssets({ logs: decodedLogs, cache });

  for (const { etf, blockNumber } of newEtfs) {
    cache.addEntity({ entity: "etf", id: etf.docId, value: etf, blockNumber });
  }

  for (const { asset, blockNumber } of newAssets) {
    cache.addEntity({ entity: "asset", id: normalizeAddress(asset.address), value: asset, blockNumber });
  }
};

export const _getPreloadEntitiesForNewEtfsAndAssets = async ({ logs }: { logs: T_QnLog[] }) => {
  const decodedLogs = logs.map((log) => ({ log, decoded: decodeEtfDeployedLog({ log }) }));
  const assetAddresses = decodedLogs.flatMap(({ decoded }) => decoded.args.etf.assets.map((asset) => normalizeAddress(asset.tokenAddress)));

  return { assetAddresses: [...new Set(assetAddresses)] };
};

export const _processNewAssets = async ({
  logs,
  cache,
}: {
  logs: { log: T_QnLog; decoded: ReturnType<typeof decodeEtfDeployedLog> }[];
  cache: CacheManager;
}) => {
  // Build (address -> earliest blockNumber seen) map so each token gets a concrete syncBlockNumber
  const addrToSyncBlock = new Map<string, number>();

  for (const { log, decoded } of logs) {
    const bn = Number(log.blockNumber); // cast if your T_QnLog uses a different shape
    for (const asset of decoded.args.etf.assets) {
      const address = normalizeAddress(asset.tokenAddress);
      const prev = addrToSyncBlock.get(address);
      if (prev === undefined || bn < prev) {
        addrToSyncBlock.set(address, bn);
      }
    }
  }

  // Load already saved assets from DB to cache
  const assetAddresses = [...addrToSyncBlock.keys()];

  // Get all cached assets
  const cachedAssets = cache.getAllEntities({ entity: "asset" }) as T_Asset[];
  const cachedAssetsMap = new Map(cachedAssets.map((asset) => [normalizeAddress(asset.address), asset]));

  // Get all new asset addresses that are not in the cache
  const newAssetAddresses = assetAddresses.filter((address) => !cachedAssetsMap.has(normalizeAddress(address)));

  type T_NewAsset = {
    asset: T_Asset;
    blockNumber: number;
  };
  // Create tasks to fetch new asset details
  const tasks: Array<() => Promise<T_NewAsset>> = newAssetAddresses.map((address) => {
    return async () => {
      const syncBlockNumber = addrToSyncBlock.get(normalizeAddress(address))!; // guaranteed to exist
      const asset: T_NewAsset = {
        asset: await fetchAssetDetails({
          tokenAddress: normalizeAddress(address),
        }),
        blockNumber: syncBlockNumber,
      };

      return asset;
    };
  });

  // Fetch new asset details in batches
  const newAssets = await batchRetry<T_NewAsset>({ tasks });

  return newAssets;
};

const _processNewEtfs = ({ logs }: { logs: { log: T_QnLog; decoded: ReturnType<typeof decodeEtfDeployedLog> }[] }) => {
  const newEtfs: { etf: T_Etf; blockNumber: number }[] = logs.map(({ log, decoded }) => {
    return {
      etf: {
        docId: decoded.args.etfId.toString(),
        details: {
          etfId: Number(decoded.args.etfId),
          name: decoded.args.etf.name,
          ticker: decoded.args.etf.ticker,
          assets: decoded.args.etf.assets.map((asset) => ({
            tokenAddress: asset.tokenAddress,
            targetWeightBips: asset.weightBips,
            balance: 0,
          })),
          assetsCount: decoded.args.etf.assets.length,
          createdAt: log.timestamp,
        },
        contracts: {
          etfTokenAddress: decoded.args.etfTokenAddress,
          etfVaultAddress: decoded.args.etfVaultAddress,
        },
        stats: {
          totalSupply: 0,
          price: {
            eth: 0,
            usd: 0,
          },
          volume: {
            eth: 0,
            usd: 0,
          },
          assetsLiquidityUsd: 0,
          assetsMcapUsd: 0,
        },
        tags: [],
      },
      blockNumber: Number(log.blockNumber),
    };
  });

  return newEtfs;
};
