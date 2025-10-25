import { T_QnLog } from "../../schema";
import { CacheManager } from "../../helpers/cache-manager";
import {
  decodeEtfAffiliateAddedLog,
  decodeEtfAffiliateFeeTransferredLog,
  isEtfAffiliateAddedLog,
  isEtfAffiliateFeeTransferredLog,
} from "../../utils/logs/filter-logs/etf-affiliate";
import { getAffiliateTransferId, T_Affiliate, T_AffiliateTransfers } from "@repo/convex/schema";
import { formatEther } from "viem";

export const _syncAffiliates = async ({ logs, cache }: { logs: T_QnLog[]; cache: CacheManager }) => {
  const decodedFeeTransferredLogs = logs
    .map((log) => (isEtfAffiliateFeeTransferredLog({ log, cache }) ? { log, decoded: decodeEtfAffiliateFeeTransferredLog({ log }) } : null))
    .filter((log) => log !== null);
  const decodedAddedLogs = logs
    .map((log) => (isEtfAffiliateAddedLog({ log, cache }) ? { log, decoded: decodeEtfAffiliateAddedLog({ log }) } : null))
    .filter((log) => log !== null);

  for (const { log, decoded } of decodedAddedLogs) {
    const affiliate: T_Affiliate = {
      docId: decoded.args.code,
      affiliateCode: decoded.args.code,
      owner: decoded.args.owner,
      createdAt: log.timestamp,
    };

    cache.addEntity({ entity: "affiliate", id: affiliate.docId, value: affiliate, blockNumber: Number(log.blockNumber) });
  }

  for (const { log, decoded } of decodedFeeTransferredLogs) {
    const affiliateTransfer: T_AffiliateTransfers = {
      docId: getAffiliateTransferId({ blockNumber: Number(log.blockNumber), txHash: log.transactionHash, logIndex: Number(log.logIndex) }),
      affiliateCode: decoded.args.code,
      owner: decoded.args.owner,
      ethAmount: Number(formatEther(decoded.args.ethAmount)),
      txHash: log.transactionHash,
      timestamp: log.timestamp,
    };

    cache.addEntity({ entity: "affiliate_transfers", id: affiliateTransfer.docId, value: affiliateTransfer, blockNumber: Number(log.blockNumber) });
  }
};
