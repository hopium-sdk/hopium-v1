import { decodeEventLog } from "viem";
import { HOPIUM } from "@/main/lib/hopium";
import { T_QnLog } from "../../../schema";

export const decodeV2SyncLog = ({ log }: { log: T_QnLog }) => {
  const decoded = decodeEventLog({
    abi: HOPIUM.contracts.abis.uniswapV2Pool,
    data: log.data as `0x${string}`,
    topics: log.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
    eventName: "Sync",
  });
  return decoded;
};

export const isV2SyncLog = ({ log }: { log: T_QnLog }): boolean => {
  try {
    const decoded = decodeV2SyncLog({ log });

    if (decoded.eventName === "Sync") {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
