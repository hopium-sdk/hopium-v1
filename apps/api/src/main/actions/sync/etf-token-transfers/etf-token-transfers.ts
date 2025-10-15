import { getEtfTokenTransferId, T_EtfTokenTransfer } from "@repo/convex/schema";
import { T_QnLog } from "../schema";
import { decodeEtfTokenTransferLog } from "../utils/logs/filterLogs";
import assert from "assert";
import { CONVEX } from "@/main/lib/convex";
import { sortLogsByChainOrder } from "../utils/logs/sortLogs";
import { normalizeAddress } from "@repo/common/utils/address";
import { HOPIUM } from "@/main/lib/hopium";

export const _syncEtfTokenTransfers = async ({ logs }: { logs: T_QnLog[] }) => {
  const sortedTransfers = sortLogsByChainOrder({ logs });

  const allEtfTokenTransfers = await processLogs({ logs: sortedTransfers });

  if (allEtfTokenTransfers.length > 0) {
    await CONVEX.httpClient.mutation(CONVEX.api.mutations.etfTokenTransfers.upsert.default, {
      etfTokenTransfers: allEtfTokenTransfers,
    });
  }

  if (allEtfTokenTransfers.length > 0) {
    console.log("Sync success for etf token transfers");
  }
};

const processLogs = async ({ logs }: { logs: T_QnLog[] }) => {
  const etfTokenEventsAddress = await HOPIUM.contracts.addresses.etfTokenEvents();

  const allEtfTokenTransfers = (
    await Promise.all(
      logs.map(async (log) => {
        if (normalizeAddress(log.address) != normalizeAddress(etfTokenEventsAddress)) {
          return null;
        }

        const decodedLog = decodeEtfTokenTransferLog({ log });
        assert(decodedLog.eventName === "EtfTokenTransfer", "Invalid event name");

        const etfTokenTransfer: T_EtfTokenTransfer = {
          transferId: getEtfTokenTransferId({ txHash: log.transactionHash, logIndex: Number(log.logIndex) }),
          etfTokenAddress: decodedLog.args.etfTokenAddress,
          fromAddress: decodedLog.args.fromAddress,
          toAddress: decodedLog.args.toAddress,
          transferAmount: Number(decodedLog.args.transferAmount) / 1e18,
          indexEthPrice: Number(decodedLog.args.indexWethPrice) / 1e18,
          blockNumber: Number(log.blockNumber),
          transactionIndex: Number(log.transactionIndex),
          logIndex: Number(log.logIndex),
          txHash: log.transactionHash,
          syncBlockNumber_: Number(log.blockNumber),
        };
        return etfTokenTransfer;
      })
    )
  ).filter((etfTokenTransfer) => etfTokenTransfer !== null);

  return allEtfTokenTransfers;
};
