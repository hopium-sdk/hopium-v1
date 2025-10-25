import { T_QnLog } from "../../schema";
import { CacheManager } from "../../helpers/cache-manager";
import { decodeEtfAffiliateFeeTransferedLog } from "../../utils/logs/filter-logs/etf-affiliate";
import { getAffiliateTransferId, T_AffiliateTransfers } from "@repo/convex/schema";

export const _syncAffiliates = async ({ logs, cache }: { logs: T_QnLog[]; cache: CacheManager }) => {
  const decodedFeeTransferedLogs = logs.map((log) => ({ log, decoded: decodeEtfAffiliateFeeTransferedLog({ log }) }));

  for (const { log, decoded } of decodedFeeTransferedLogs) {
    const affiliateTransfer: T_AffiliateTransfers = {
      docId: getAffiliateTransferId({ blockNumber: Number(log.blockNumber), txHash: log.transactionHash, logIndex: Number(log.logIndex) }),
      affiliateCode: decoded.args.code,
      owner: decoded.args.owner,
      ethAmount: Number(decoded.args.ethAmount),
      txHash: log.transactionHash,
    };

    cache.addEntity({ entity: "affiliate_transfers", id: affiliateTransfer.docId, value: affiliateTransfer, blockNumber: Number(log.blockNumber) });
  }
};
