import { qnPayloadSchema, T_QnLog } from "./schema";
import { filterNewEtfLogs, filterEtfTokenTransferLogs } from "./utils/logs/filterLogs";
import { _syncNewEtfs } from "./new-etfs/new-etfs";
import { _syncEtfTokenTransfers } from "./etf-token-transfers/etf-token-transfers";
import { CONVEX } from "@/main/lib/convex";

export const sync = async ({ body }: { body: any }) => {
  const payload = qnPayloadSchema.parse(body);

  const logs = payload.logs;

  await handleReorg({ logs });

  const newEtfLogs = filterNewEtfLogs({ logs });
  const etfTokenTransferLogs = filterEtfTokenTransferLogs({ logs });

  if (newEtfLogs.length > 0) {
    await _syncNewEtfs({ logs: newEtfLogs });
  }

  if (etfTokenTransferLogs.length > 0) {
    await _syncEtfTokenTransfers({ logs: etfTokenTransferLogs });
  }

  if (newEtfLogs.length > 0 || etfTokenTransferLogs.length > 0) {
    await updateSyncStatus({ logs });
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

const updateSyncStatus = async ({ logs }: { logs: T_QnLog[] }) => {
  //get the highest block number from the logs
  const maxBlockNumber = Math.max(...logs.map((log) => Number(log.blockNumber)));

  await CONVEX.httpClient.mutation(CONVEX.api.mutations.syncStatus.update.default, {
    lastBlockNumber: maxBlockNumber,
  });
};
