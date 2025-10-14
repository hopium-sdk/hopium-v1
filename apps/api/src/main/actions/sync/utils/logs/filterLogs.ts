import { T_QnLog } from "../../schema";
import { decodeEventLog } from "viem";
import { HOPIUM } from "@/main/lib/hopium";

export const decodeNewEtfLog = ({ log }: { log: T_QnLog }) => {
  const decoded = decodeEventLog({
    abi: HOPIUM.contracts.abis.etfFactory,
    data: log.data as `0x${string}`,
    topics: log.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
    eventName: "EtfDeployed",
  });
  return decoded;
};

const isNewEtfLog = ({ log }: { log: T_QnLog }) => {
  try {
    const decoded = decodeNewEtfLog({ log });

    return decoded.eventName === "EtfDeployed";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
};

export const filterNewEtfLogs = ({ logs }: { logs: T_QnLog[] }) => {
  return logs.filter((log) => isNewEtfLog({ log }));
};

export const decodeEtfTokenTransferLog = ({ log }: { log: T_QnLog }) => {
  const decoded = decodeEventLog({
    abi: HOPIUM.contracts.abis.etfTokenEvents,
    data: log.data as `0x${string}`,
    topics: log.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
    eventName: "EtfTokenTransfer",
  });
  return decoded;
};

const isEtfTokenTransferLog = ({ log }: { log: T_QnLog }) => {
  try {
    const decoded = decodeEtfTokenTransferLog({ log });
    return decoded.eventName === "EtfTokenTransfer";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
};

export const filterEtfTokenTransferLogs = ({ logs }: { logs: T_QnLog[] }) => {
  return logs.filter((log) => isEtfTokenTransferLog({ log }));
};
