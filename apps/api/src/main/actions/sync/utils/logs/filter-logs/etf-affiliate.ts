import { decodeEventLog } from "viem";
import { HOPIUM } from "@/main/lib/hopium";
import { T_QnLog } from "../../../schema";
import { CacheManager } from "../../../helpers/cache-manager";
import { normalizeAddress } from "@repo/common/utils/address";

export const decodeEtfAffiliateFeeTransferedLog = ({ log }: { log: T_QnLog }) => {
  const decoded = decodeEventLog({
    abi: HOPIUM.contracts.abis.etfAffiliate,
    data: log.data as `0x${string}`,
    topics: log.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
    eventName: "AffiliateFeeTransfered",
  });
  return decoded;
};

export const isEtfAffiliateFeeTransferedLog = ({ log, cache }: { log: T_QnLog; cache: CacheManager }): boolean => {
  try {
    const decoded = decodeEtfAffiliateFeeTransferedLog({ log });

    const etfAffiliateAddress = cache.getAddress({ key: "etfAffiliate" });
    if (decoded.eventName === "AffiliateFeeTransfered" && normalizeAddress(log.address) === etfAffiliateAddress) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
