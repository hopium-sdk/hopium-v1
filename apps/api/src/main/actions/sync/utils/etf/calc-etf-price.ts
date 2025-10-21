import { COMMON_CONSTANTS } from "@repo/common/utils/constants";
import { T_Etf } from "@repo/convex/schema";
import { CacheManager } from "../../helpers/cache-manager";
import { normalizeAddress } from "@repo/common/utils/address";
import { T_Pool } from "@repo/convex/schema";

type T_CalcEtfPriceParams = {
  etf: T_Etf;
  cache: CacheManager;
  etfAssetPoolMap: Map<string, string>;
};

export const _calcEtfPrice = ({ etf, cache, etfAssetPoolMap }: T_CalcEtfPriceParams): number => {
  const weth = normalizeAddress(COMMON_CONSTANTS.addresses.weth[COMMON_CONSTANTS.networkSelected]);

  let tvlEth = 0; // Σ(balanceWhole * priceEth)

  for (const asset of etf.details.assets) {
    const token = normalizeAddress(asset.tokenAddress);

    // Determine priceEth (WETH per whole token)
    let priceEth: number;
    if (token === weth) {
      priceEth = 1; // WETH is 1:1
    } else {
      const poolAddr = etfAssetPoolMap.get(token);
      if (!poolAddr) return 0; // strict: missing pool mapping
      const pool = cache.getEntity({ entity: "pool", id: normalizeAddress(poolAddr) }) as T_Pool | undefined;
      if (!pool) return 0; // strict: missing pool in cache
      priceEth = pool.stats?.price?.eth ?? 0;
      if (!priceEth) return 0; // strict: zero / missing price
    }

    // TVL (balances are whole-token units)
    const balDec = asset.balance ?? 0;
    if (balDec > 0) {
      tvlEth += balDec * priceEth;
    }
  }

  // Decide initial vs NAV
  const supplyDec = etf.stats.totalSupply;
  if (supplyDec > 0) {
    return tvlEth / supplyDec; // true NAV per ETF token
  }
  return 0; // index-style initial price
};
