import { decodeEventLog } from "viem";
import { HOPIUM } from "@/main/lib/hopium";
import { T_QnLog } from "../../../schema";
import { CacheManager } from "../../../helpers/cache-manager";
import { normalizeAddress } from "@repo/common/utils/address";

export const decodeEtfAffiliateFeeTransferredLog = ({ log }: { log: T_QnLog }) => {
  const decoded = decodeEventLog({
    abi: HOPIUM.contracts.abis.etfAffiliate,
    data: log.data as `0x${string}`,
    topics: log.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
    eventName: "AffiliateFeeTransferred",
  });
  return decoded;
};

export const decodeEtfAffiliateAddedLog = ({ log }: { log: T_QnLog }) => {
  const decoded = decodeEventLog({
    abi: HOPIUM.contracts.abis.etfAffiliate,
    data: log.data as `0x${string}`,
    topics: log.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
    eventName: "AffiliateAdded",
  });
  return decoded;
};

export const isEtfAffiliateAddedLog = ({ log, cache }: { log: T_QnLog; cache: CacheManager }): boolean => {
  try {
    const decoded = decodeEtfAffiliateAddedLog({ log });
    const etfAffiliateAddress = cache.getAddress({ key: "etfAffiliate" });
    if (decoded.eventName === "AffiliateAdded" && normalizeAddress(log.address) === etfAffiliateAddress) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const isEtfAffiliateFeeTransferredLog = ({ log, cache }: { log: T_QnLog; cache: CacheManager }): boolean => {
  try {
    const decoded = decodeEtfAffiliateFeeTransferredLog({ log });

    const etfAffiliateAddress = cache.getAddress({ key: "etfAffiliate" });
    if (decoded.eventName === "AffiliateFeeTransferred" && normalizeAddress(log.address) === etfAffiliateAddress) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
