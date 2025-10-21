import { T_QnLog } from "../../schema";
import { CacheManager } from "../../helpers/cache-manager";
import { decodeV3SwapLog, isV3SwapLog } from "../../utils/logs/filter-logs/uni-v3-swap";
import { decodeV2SyncLog } from "../../utils/logs/filter-logs/uni-v2-sync";
import { normalizeAddress } from "@repo/common/utils/address";
import assert from "assert";
import { _calcPoolPriceV3 } from "../../utils/uniswap/calc-v3-price";
import { _calcPoolPriceV2 } from "../../utils/uniswap/calc-v2-price";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";
import { _calcEtfPrice } from "../../utils/etf/calc-etf-price";
import { T_Etf, T_OhlcUpdates, T_Pool } from "@repo/convex/schema";

type T_SyncSwapParams = {
  log: T_QnLog;
  cache: CacheManager;
  poolEtfMap: Map<string, number[]>;
  etfAssetPoolMap: Map<string, string>;
};

export const _syncSwap = ({ log, cache, poolEtfMap, etfAssetPoolMap }: T_SyncSwapParams) => {
  const ethUsdPrice = cache.getEthPrice();

  const isV3Swap = isV3SwapLog({ log });
  const decodedLog = isV3Swap ? decodeV3SwapLog({ log }) : decodeV2SyncLog({ log });
  assert(decodedLog, "Decoded log not found");

  const poolAddress = normalizeAddress(log.address);
  const pool = cache.getEntity({ entity: "pool", id: poolAddress });
  if (!pool) {
    return;
  }

  const wethAddress = COMMON_CONSTANTS.addresses.weth[COMMON_CONSTANTS.networkSelected];
  const usdcAddress = COMMON_CONSTANTS.addresses.usdc[COMMON_CONSTANTS.networkSelected];
  const isWethUsdcPool =
    (pool.details.token0 === wethAddress && pool.details.token1 === usdcAddress) ||
    (pool.details.token0 === usdcAddress && pool.details.token1 === wethAddress);

  const baseAddress = isWethUsdcPool ? usdcAddress : wethAddress;
  const price = isV3Swap
    ? _calcPoolPriceV3({ decoded: decodedLog as ReturnType<typeof decodeV3SwapLog>, pool, baseAddress })
    : _calcPoolPriceV2({ decoded: decodedLog as ReturnType<typeof decodeV2SyncLog>, pool, baseAddress });
  if (!price) {
    return;
  }

  pool.stats.price.eth = price;
  pool.stats.price.usd = isWethUsdcPool ? price : price * ethUsdPrice;

  cache.addEntity({ entity: "pool", id: normalizeAddress(pool.address), value: pool, blockNumber: Number(log.blockNumber) });

  if (!isWethUsdcPool && price > 0) {
    _updateEtfPrice({ log, pool, cache, poolEtfMap, etfAssetPoolMap, ethUsdPrice });
  }
};

export const _getPreloadEntitiesForSwaps = async ({ logs }: { logs: T_QnLog[] }) => {
  const poolAddresses = [...new Set(logs.map((log) => normalizeAddress(log.address)))];

  return { poolAddresses: [...new Set(poolAddresses)] };
};

type T_UpdateEtfPriceParams = {
  log: T_QnLog;
  pool: T_Pool;
  cache: CacheManager;
  poolEtfMap: Map<string, number[]>;
  etfAssetPoolMap: Map<string, string>;
  ethUsdPrice: number;
};

const _updateEtfPrice = ({ log, pool, cache, poolEtfMap, etfAssetPoolMap, ethUsdPrice }: T_UpdateEtfPriceParams) => {
  const etfIds = poolEtfMap.get(pool.address);
  if (!etfIds) {
    return;
  }

  for (const etfId of etfIds) {
    const etf = cache.getEntity({ entity: "etf", id: etfId.toString() });
    if (!etf) {
      return;
    }

    _updateEtfPriceAndOhlc({ etf, cache, etfAssetPoolMap, ethUsdPrice, log });
  }
};

type T_UpdateEtfPriceAndOhlc = {
  etf: T_Etf;
  cache: CacheManager;
  etfAssetPoolMap: Map<string, string>;
  ethUsdPrice: number;
  log: T_QnLog;
};

export const _updateEtfPriceAndOhlc = ({ etf, cache, etfAssetPoolMap, ethUsdPrice, log }: T_UpdateEtfPriceAndOhlc) => {
  const etfPrice = _calcEtfPrice({ etf, cache, etfAssetPoolMap });

  if (!etfPrice || etfPrice === 0) {
    return;
  }

  etf.stats.price.eth = etfPrice;
  etf.stats.price.usd = etfPrice * ethUsdPrice;

  cache.addEntity({ entity: "etf", id: etf.details.etfId.toString(), value: etf, blockNumber: Number(log.blockNumber) });

  const ohlcUpdate: T_OhlcUpdates = {
    etfId: etf.details.etfId,
    timestamp: log.timestamp,
    price: etf.stats.price.usd,
  };

  cache.addEntity({ entity: "ohlc_updates", id: `${ohlcUpdate.etfId}-${ohlcUpdate.timestamp}`, value: ohlcUpdate, blockNumber: Number(log.blockNumber) });
};
