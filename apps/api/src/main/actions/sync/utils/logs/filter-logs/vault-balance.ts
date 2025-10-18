import { decodeEventLog } from "viem";
import { HOPIUM } from "@/main/lib/hopium";
import { T_QnLog } from "../../../schema";

export const decodeVaultBalanceLog = ({ log }: { log: T_QnLog }) => {
  const decoded = decodeEventLog({
    abi: HOPIUM.contracts.abis.etfRouter,
    data: log.data as `0x${string}`,
    topics: log.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
    eventName: "VaultBalanceChanged",
  });
  return decoded;
};

export const isVaultBalanceLog = ({ log }: { log: T_QnLog }): boolean => {
  try {
    const decoded = decodeVaultBalanceLog({ log });

    if (decoded.eventName === "VaultBalanceChanged") {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
