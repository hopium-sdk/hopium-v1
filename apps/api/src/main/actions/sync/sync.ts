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
import { isEtfAffiliateAddedLog, isEtfAffiliateFeeTransferredLog } from "./utils/logs/filter-logs/etf-affiliate";
import { _syncAffiliates } from "./fns/affiliates/sync-affiliates";

export const sync = async ({ body }: { body: unknown }) => {
  const payload = qnPayloadSchema.parse(body);
  const logs = sortLogsByChainOrder({ logs: payload.logs });
  const cache = new CacheManager();
  await cache.preloadAddresses();

  const firstBlockNumber = logs.length > 0 ? Number(logs[0]?.blockNumber) : 0;
  const lastBlockNumber = logs.length > 0 ? Number(logs[logs.length - 1]?.blockNumber) : 0;
  console.log("Syncing logs from block", firstBlockNumber, "to block", lastBlockNumber);

  await handleReorg({ logs });

  await handleSync({ logs, cache });

  await handleUpdateMutations({ cache });
};

const handleUpdateMutations = async ({ cache }: { cache: CacheManager }) => {
  // Build per-block payloads from the cache
  const blocks = cache.buildBlockPayloads();

  if (blocks.length === 0) {
    console.log("No staged changes to sync");
    return;
  }

  // Call the updated multi-block mutation (the one we wrote earlier)
  await CONVEX.httpClient.mutation(CONVEX.api.mutations.sync.sync.default, {
    blocks, // <-- BlockPayload[] (sorted ascending)
  });

  // If the mutation succeeds, you can clear local staging
  cache.clearStagedBlocks();

  console.log("Sync successfully completed");
};

const handleSync = async ({ logs, cache }: { logs: T_QnLog[]; cache: CacheManager }) => {
  const etfDeployedLogs = logs.filter((log) => isEtfDeployedLog({ log, cache }));
  const poolChangedLogs = logs.filter((log) => isPoolChangedLog({ log, cache }));
  const swapLogs = logs.filter((log) => isV2SyncLog({ log }) || isV3SwapLog({ log }));
  const vaultBalanceLogs = logs.filter((log) => isVaultBalanceLog({ log, cache }));
  const etfTokenTransferLogs = logs.filter((log) => isEtfTokenTransferLog({ log, cache }));
  const etfAffiliateLogs = logs.filter((log) => isEtfAffiliateFeeTransferredLog({ log, cache }) || isEtfAffiliateAddedLog({ log, cache }));

  await _preloadCache({ etfDeployedLogs, poolChangedLogs, swapLogs, vaultBalanceLogs, etfTokenTransferLogs, cache });

  if (etfDeployedLogs.length > 0) {
    await _saveNewEtfsAndAssets({ logs: etfDeployedLogs, cache });
  }

  const { poolEtfMap, etfAssetPoolMap } = _buildForSwaps({ logs: swapLogs, cache });

  for (const log of logs) {
    if (isV2SyncLog({ log }) || isV3SwapLog({ log })) {
      _syncSwap({ log, cache, poolEtfMap, etfAssetPoolMap });
    }

    if (isEtfTokenTransferLog({ log, cache })) {
      _syncEtfTokenTransfer({ log, cache });
    }

    if (isVaultBalanceLog({ log, cache })) {
      await _syncVaultBalance({ log, cache, etfAssetPoolMap });
    }
  }

  if (poolChangedLogs.length > 0) {
    await _saveNewPools({ logs: poolChangedLogs, cache });
  }

  if (etfAffiliateLogs.length > 0) {
    await _syncAffiliates({ logs: etfAffiliateLogs, cache });
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
