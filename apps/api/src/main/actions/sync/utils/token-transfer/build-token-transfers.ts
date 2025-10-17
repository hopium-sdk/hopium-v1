import { normalizeAddress } from "@repo/common/utils/address";
import { T_QnLog } from "../../schema";
import { HOPIUM } from "@/main/lib/hopium";
import { decodeEtfTokenTransferLog } from "../logs/filterLogs";
import assert from "assert";
import { T_EtfTokenTransfer } from "@repo/convex/schema";
import { getEtfTokenTransferId } from "@repo/convex/schema";

export const buildTokenTransfers = async ({ logs }: { logs: T_QnLog[] }) => {
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
          etfPrice: {
            eth: Number(decodedLog.args.etfWethPrice) / 1e18,
            usd: Number(decodedLog.args.etfUsdPrice) / 1e18,
          },
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
