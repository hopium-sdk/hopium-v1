import { HOPIUM } from "@/main/lib/hopium";
import { T_QnLog } from "../../../schema";
import { decodeEventLog } from "viem";
import { normalizeAddress } from "@repo/common/utils/address";
import { CacheManager } from "../../../helpers/cache-manager";

export const decodeEtfTokenTransferLog = ({ log }: { log: T_QnLog }) => {
  const decoded = decodeEventLog({
    abi: HOPIUM.contracts.abis.etfTokenEvents,
    data: log.data as `0x${string}`,
    topics: log.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
    eventName: "EtfTokenTransfer",
  });
  return decoded;
};

export const isEtfTokenTransferLog = ({ log, cache }: { log: T_QnLog; cache: CacheManager }): boolean => {
  try {
    const decoded = decodeEtfTokenTransferLog({ log });
    const etfTokenEventsAddress = cache.getAddress({ key: "etfTokenEvents" });

    if (decoded.eventName === "EtfTokenTransfer" && normalizeAddress(log.address) === etfTokenEventsAddress) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
