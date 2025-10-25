import { decodeEventLog } from "viem";
import { HOPIUM } from "@/main/lib/hopium";
import { T_QnLog } from "../../../schema";
import { CacheManager } from "../../../helpers/cache-manager";
import { normalizeAddress } from "@repo/common/utils/address";

export const decodeEtfDeployedLog = ({ log }: { log: T_QnLog }) => {
  const decoded = decodeEventLog({
    abi: HOPIUM.contracts.abis.etfFactory,
    data: log.data as `0x${string}`,
    topics: log.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
    eventName: "EtfDeployed",
  });
  return decoded;
};

export const isEtfDeployedLog = ({ log, cache }: { log: T_QnLog; cache: CacheManager }): boolean => {
  try {
    const decoded = decodeEtfDeployedLog({ log });

    const etfFactoryAddress = cache.getAddress({ key: "etfFactory" });
    if (decoded.eventName === "EtfDeployed" && normalizeAddress(log.address) === etfFactoryAddress) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
