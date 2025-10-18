import { decodeEventLog } from "viem";
import { HOPIUM } from "@/main/lib/hopium";
import { T_QnLog } from "../../../schema";

export const decodeEtfDeployedLog = ({ log }: { log: T_QnLog }) => {
  const decoded = decodeEventLog({
    abi: HOPIUM.contracts.abis.etfFactory,
    data: log.data as `0x${string}`,
    topics: log.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
    eventName: "EtfDeployed",
  });
  return decoded;
};

export const isEtfDeployedLog = ({ log }: { log: T_QnLog }): boolean => {
  try {
    const decoded = decodeEtfDeployedLog({ log });

    if (decoded.eventName === "EtfDeployed") {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
