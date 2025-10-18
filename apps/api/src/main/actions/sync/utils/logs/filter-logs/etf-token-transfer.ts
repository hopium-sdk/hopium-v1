import { HOPIUM } from "@/main/lib/hopium";
import { T_QnLog } from "../../../schema";
import { decodeEventLog } from "viem";

export const decodeEtfTokenTransferLog = ({ log }: { log: T_QnLog }) => {
  const decoded = decodeEventLog({
    abi: HOPIUM.contracts.abis.etfTokenEvents,
    data: log.data as `0x${string}`,
    topics: log.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
    eventName: "EtfTokenTransfer",
  });
  return decoded;
};

export const isEtfTokenTransferLog = ({ log }: { log: T_QnLog }): boolean => {
  try {
    const decoded = decodeEtfTokenTransferLog({ log });
    if (decoded.eventName === "EtfTokenTransfer") {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
