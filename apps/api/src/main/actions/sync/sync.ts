import { qnPayloadSchema, T_QnLog } from "./schema";
import { filterNewEtfLogs, filterEtfTokenTransferLogs } from "./utils/logs/filterLogs";
import { _syncNewEtfs } from "./new-etfs/new-etfs";
import { _syncEtfTokenTransfers } from "./etf-token-transfers/etf-token-transfers";
import { CONVEX } from "@/main/lib/convex";

export const sync = async ({ body }: { body: any }) => {
  const payload = qnPayloadSchema.parse(body);
  const logs = payload.logs;

  //Handle reorg
  await handleReorg({ logs });

  //Filter logs
  const newEtfLogs = filterNewEtfLogs({ logs });
  const etfTokenTransferLogs = filterEtfTokenTransferLogs({ logs });

  //Sync new etfs and token transfers
  const { newAssets, allEtfs } = await _syncNewEtfs({ logs: newEtfLogs });
  const allEtfTokenTransfers = await _syncEtfTokenTransfers({ logs: etfTokenTransferLogs });

  //Update db
  if (newAssets.length > 0 || allEtfs.length > 0 || allEtfTokenTransfers.length > 0) {
    const maxBlockNumber = Math.max(...logs.map((log) => Number(log.blockNumber)));

    await CONVEX.httpClient.mutation(CONVEX.api.mutations.sync.sync.default, {
      etfs: allEtfs,
      etfTokenTransfers: allEtfTokenTransfers,
      assets: newAssets,
      lastBlockNumber: maxBlockNumber,
    });
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
