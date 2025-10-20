import { qnPayloadSchema, T_QnLog } from "./schema";
import { CONVEX } from "@/main/lib/convex";
import { CacheManager } from "./helpers/cache-manager";
import { isEtfDeployedLog } from "./utils/logs/filter-logs/etf-deployed";
import { _saveNewEtfsAndAssets } from "./fns/etf-deployed/save-new-etfs-and-assets";
import { isPoolChangedLog } from "./utils/logs/filter-logs/pool-changed";
import { _saveNewPools } from "./fns/pool-changed/save-new-pools";
import { sortLogsByChainOrder } from "./utils/logs/sortLogs";
import { isV2SyncLog } from "./utils/logs/filter-logs/uni-v2-sync";
import { isV3SwapLog } from "./utils/logs/filter-logs/uni-v3-swap";
import { _syncSwap } from "./fns/swap/sync-swap";
import { isVaultBalanceLog } from "./utils/logs/filter-logs/vault-balance";
import { _syncVaultBalance } from "./fns/vault-balance/sync-vault-balance";
import { isEtfTokenTransferLog } from "./utils/logs/filter-logs/etf-token-transfer";
import { _syncEtfTokenTransfer } from "./fns/etf-token-transfer/sync-etf-token-transfer";
import { _preloadCache } from "./helpers/fns/preload-cache";
import { _buildForSwaps } from "./fns/swap/build-for-swaps";

export const sync = async ({ body }: { body: any }) => {
  const payload = qnPayloadSchema.parse(body);
  const logs = sortLogsByChainOrder({ logs: payload.logs });
  const cache = new CacheManager();

  await handleReorg({ logs });

  await handleSync({ logs, cache });

  await handleUpdateMutations({ cache, logs });
};

const handleUpdateMutations = async ({ cache, logs }: { cache: CacheManager; logs: T_QnLog[] }) => {
  const allEtfs = cache.getAllEntities({ entity: "etf" });
  const allAssets = cache.getAllEntities({ entity: "asset" });
  const allEtfTokenTransfers = cache.getAllEntities({ entity: "etf_token_transfer" });
  const allPools = cache.getAllEntities({ entity: "pool" });
  const allOhlcUpdates = cache.getAllEntities({ entity: "ohlc_updates" });

  if (allEtfs.length > 0 || allAssets.length > 0 || allEtfTokenTransfers.length > 0 || allPools.length > 0 || allOhlcUpdates.length > 0) {
    const maxBlockNumber = Math.max(...logs.map((log) => Number(log.blockNumber)));

    await CONVEX.httpClient.mutation(CONVEX.api.mutations.sync.sync.default, {
      etfs: allEtfs,
      etfTokenTransfers: allEtfTokenTransfers,
      assets: allAssets,
      pools: allPools,
      ohlcUpdates: allOhlcUpdates,
      lastBlockNumber: maxBlockNumber,
    });

    console.log("Sync successfully completed");
  }
};

const handleSync = async ({ logs, cache }: { logs: T_QnLog[]; cache: CacheManager }) => {
  const etfDeployedLogs = logs.filter((log) => isEtfDeployedLog({ log }));
  const poolChangedLogs = logs.filter((log) => isPoolChangedLog({ log }));
  const swapLogs = logs.filter((log) => isV2SyncLog({ log }) || isV3SwapLog({ log }));
  const vaultBalanceLogs = logs.filter((log) => isVaultBalanceLog({ log }));

  await _preloadCache({ etfDeployedLogs, poolChangedLogs, swapLogs, vaultBalanceLogs, cache });

  if (etfDeployedLogs.length > 0) {
    await _saveNewEtfsAndAssets({ logs: etfDeployedLogs, cache });
  }

  const { poolEtfMap, etfAssetPoolMap } = _buildForSwaps({ logs: swapLogs, cache });

  for (const log of logs) {
    if (isV2SyncLog({ log }) || isV3SwapLog({ log })) {
      _syncSwap({ log, cache, poolEtfMap, etfAssetPoolMap });
    }

    if (isEtfTokenTransferLog({ log })) {
      _syncEtfTokenTransfer({ log, cache });
    }

    if (isVaultBalanceLog({ log })) {
      _syncVaultBalance({ log, cache, etfAssetPoolMap });
    }
  }

  if (poolChangedLogs.length > 0) {
    await _saveNewPools({ logs: poolChangedLogs, cache });
  }
};

const handleReorg = async ({ logs }: { logs: T_QnLog[] }) => {
  const syncStatus = await CONVEX.httpClient.query(CONVEX.api.fns.syncStatus.get.default);
  const lastBlockNumber = syncStatus.lastBlockNumber;

  //Get the least block number from the logs
  const minBlockNumber = Math.min(...logs.map((log) => Number(log.blockNumber)));

  if (minBlockNumber <= lastBlockNumber) {
    console.log("Reorg detected, handling...");
    await CONVEX.httpClient.mutation(CONVEX.api.mutations._handleReorg.handle.default, {
      safeBlockNumber: minBlockNumber - 1,
    });
  }
};
