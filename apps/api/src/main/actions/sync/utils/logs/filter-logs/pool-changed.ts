import { decodeEventLog } from "viem";
import { HOPIUM } from "@/main/lib/hopium";
import { T_QnLog } from "../../../schema";

export const decodePoolChangedLog = ({ log }: { log: T_QnLog }) => {
  const decoded = decodeEventLog({
    abi: HOPIUM.contracts.abis.poolFinder,
    data: log.data as `0x${string}`,
    topics: log.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
    eventName: "PoolChanged",
  });
  return decoded;
};

export const isPoolChangedLog = ({ log }: { log: T_QnLog }): boolean => {
  try {
    const decoded = decodePoolChangedLog({ log });
 
    if (decoded.eventName === "PoolChanged") {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
