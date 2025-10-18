import { T_QnLog } from "../../schema";
import { CacheManager } from "../../helpers/cache-manager";
import { normalizeAddress } from "@repo/common/utils/address";

export const _buildForSwaps = ({ cache }: { logs: T_QnLog[]; cache: CacheManager }) => {
  const poolEtfMap = _buildPoolEtfMap({ cache });
  const etfAssetPoolMap = _buildEtfAssetPoolMap({ cache });

  return { poolEtfMap, etfAssetPoolMap };
};

const _buildPoolEtfMap = ({ cache }: { cache: CacheManager }) => {
  const poolEtfMap = new Map<string, number[]>();

  const allPools = cache.getAllEntities({ entity: "pool" });
  const allEtfs = cache.getAllEntities({ entity: "etf" });

  for (const pool of allPools) {
    const normalizedToken0 = normalizeAddress(pool.details.token0);
    const normalizedToken1 = normalizeAddress(pool.details.token1);

    for (const etf of allEtfs) {
      if (
        etf.details.assets.some(
          (asset) => normalizeAddress(asset.tokenAddress) === normalizedToken0 || normalizeAddress(asset.tokenAddress) === normalizedToken1
        )
      ) {
        poolEtfMap.set(pool.address, [...(poolEtfMap.get(pool.address) || []), etf.details.etfId]);
      }
    }
  }

  return poolEtfMap;
};

const _buildEtfAssetPoolMap = ({ cache }: { cache: CacheManager }) => {
  //etf asset address -> pool
  const etfAssetPoolMap = new Map<string, string>();

  const allPools = cache.getAllEntities({ entity: "pool" });
  const allEtfs = cache.getAllEntities({ entity: "etf" });

  for (const pool of allPools) {
    for (const etf of allEtfs) {
      for (const asset of etf.details.assets) {
        if (
          normalizeAddress(asset.tokenAddress) === normalizeAddress(pool.details.token0) ||
          normalizeAddress(asset.tokenAddress) === normalizeAddress(pool.details.token1)
        ) {
          etfAssetPoolMap.set(normalizeAddress(asset.tokenAddress), normalizeAddress(pool.address));
        }
      }
    }
  }
  return etfAssetPoolMap;
};
