import { decodeEventLog } from "viem";
import { HOPIUM } from "@/main/lib/hopium";
import { T_QnLog } from "../../../schema";
import { CacheManager } from "../../../helpers/cache-manager";
import { normalizeAddress } from "@repo/common/utils/address";

export const decodePoolChangedLog = ({ log }: { log: T_QnLog }) => {
  const decoded = decodeEventLog({
    abi: HOPIUM.contracts.abis.poolFinder,
    data: log.data as `0x${string}`,
    topics: log.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
    eventName: "PoolChanged",
  });
  return decoded;
};

export const isPoolChangedLog = ({ log, cache }: { log: T_QnLog; cache: CacheManager }): boolean => {
  try {
    const decoded = decodePoolChangedLog({ log });

    const poolFinderAddress = cache.getAddress({ key: "poolFinder" });
    if (decoded.eventName === "PoolChanged" && normalizeAddress(log.address) === poolFinderAddress) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
