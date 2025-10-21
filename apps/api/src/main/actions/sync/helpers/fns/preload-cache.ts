import { _getPreloadEntitiesForNewEtfsAndAssets } from "../../fns/etf-deployed/save-new-etfs-and-assets";
import { _getPreloadEntitiesForNewPools } from "../../fns/pool-changed/save-new-pools";
import { _getPreloadEntitiesForVaultBalance } from "../../fns/vault-balance/sync-vault-balance";
import { T_QnLog } from "../../schema";
import { _getPreloadEntitiesForSwaps } from "../../fns/swap/sync-swap";
import { CacheManager } from "../cache-manager";
import { CONVEX } from "@/main/lib/convex";
import { normalizeAddress } from "@repo/common/utils/address";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";
import { _getPreloadEntitiesForTokenTransfer } from "../../fns/etf-token-transfer/sync-etf-token-transfer";

type T_Flattened = {
  assetAddresses: string[];
  poolAddresses: string[];
  etfIds: number[];
};

type T_BuildPreloadEntities = {
  etfDeployedLogs: T_QnLog[];
  poolChangedLogs: T_QnLog[];
  swapLogs: T_QnLog[];
  vaultBalanceLogs: T_QnLog[];
  etfTokenTransferLogs: T_QnLog[];
};

type T_PreloadCache = T_BuildPreloadEntities & { cache: CacheManager };

export const _preloadCache = async ({ etfDeployedLogs, poolChangedLogs, swapLogs, vaultBalanceLogs, etfTokenTransferLogs, cache }: T_PreloadCache) => {
  const flattened: T_Flattened = await _buildPreloadEntities({ etfDeployedLogs, poolChangedLogs, swapLogs, vaultBalanceLogs, etfTokenTransferLogs });

  const { etfs, assets, pools } = await CONVEX.httpClient.query(CONVEX.api.fns.sync.getPreloadCache.default, {
    etfIds: flattened.etfIds,
    assetAddresses: flattened.assetAddresses,
    poolAddresses: flattened.poolAddresses,
  });

  for (const etf of etfs) {
    cache.addEntity({ entity: "etf", id: etf.details.etfId.toString(), value: cache.convertCtoT({ entity: "etf", c: etf }) });
  }

  for (const asset of assets) {
    cache.addEntity({ entity: "asset", id: normalizeAddress(asset.address), value: cache.convertCtoT({ entity: "asset", c: asset }) });
  }

  for (const pool of pools) {
    cache.addEntity({ entity: "pool", id: normalizeAddress(pool.address), value: cache.convertCtoT({ entity: "pool", c: pool }) });
  }

  const wethAddress = COMMON_CONSTANTS.addresses.weth[COMMON_CONSTANTS.networkSelected];
  const usdcAddress = COMMON_CONSTANTS.addresses.usdc[COMMON_CONSTANTS.networkSelected];
  const wethUsdPool = pools.find(
    (pool) =>
      (pool.details.token0 === wethAddress && pool.details.token1 === usdcAddress) ||
      (pool.details.token0 === usdcAddress && pool.details.token1 === wethAddress)
  );

  if (wethUsdPool) {
    cache.updateEthUsdPoolAddress({ address: normalizeAddress(wethUsdPool.address) });
  }
};

const _buildPreloadEntities = async ({ etfDeployedLogs, poolChangedLogs, swapLogs, vaultBalanceLogs, etfTokenTransferLogs }: T_BuildPreloadEntities) => {
  const preloadEntities = await Promise.all([
    _getPreloadEntitiesForNewEtfsAndAssets({ logs: etfDeployedLogs }),
    _getPreloadEntitiesForNewPools({ logs: poolChangedLogs }),
    _getPreloadEntitiesForSwaps({ logs: swapLogs }),
    _getPreloadEntitiesForVaultBalance({ logs: vaultBalanceLogs }),
    _getPreloadEntitiesForTokenTransfer({ logs: etfTokenTransferLogs }),
  ] as const);

  const uniq = <T>(arr: readonly T[]) => Array.from(new Set(arr));

  const flattened: T_Flattened = preloadEntities.reduce<T_Flattened>(
    (acc, obj) => {
      if ("assetAddresses" in obj) acc.assetAddresses.push(...obj.assetAddresses);
      if ("poolAddresses" in obj) acc.poolAddresses.push(...obj.poolAddresses);
      if ("etfIds" in obj) acc.etfIds.push(...obj.etfIds);
      return acc;
    },
    { assetAddresses: [], poolAddresses: [], etfIds: [] }
  );

  flattened.assetAddresses = uniq(flattened.assetAddresses);
  flattened.poolAddresses = uniq(flattened.poolAddresses);
  flattened.etfIds = uniq(flattened.etfIds);

  return flattened;
};
