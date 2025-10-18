import { decodeEventLog } from "viem";
import { HOPIUM } from "@/main/lib/hopium";
import { T_QnLog } from "../../../schema";

export const decodeSwapV3Log = ({ log }: { log: T_QnLog }) => {
  const decoded = decodeEventLog({
    abi: HOPIUM.contracts.abis.uniswapV3Pool,
    data: log.data as `0x${string}`,
    topics: log.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
    eventName: "Swap",
  });
  return decoded;
};

export const isSwapV3Log = ({ log }: { log: T_QnLog }): boolean => {
  try {
    const decoded = decodeSwapV3Log({ log });

    if (decoded.eventName === "Swap") {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
