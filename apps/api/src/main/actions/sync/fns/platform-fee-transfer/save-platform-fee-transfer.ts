import { getPlatformFeeTransferId, T_PlatformFeeTransfers } from "@repo/convex/schema";
import { CacheManager } from "../../helpers/cache-manager";
import { T_QnLog } from "../../schema";
import { formatUnits } from "viem";
import { decodePlatformFeeTransferLog } from "../../utils/logs/filter-logs/platform-fee-transfer";

export const _savePlatformFeeTransfers = ({ logs, cache }: { logs: T_QnLog[]; cache: CacheManager }) => {
  const decodedLogs = logs.map((log) => ({ log, decoded: decodePlatformFeeTransferLog({ log }) }));

  for (const { log, decoded } of decodedLogs) {
    const platformFeeTransfer: T_PlatformFeeTransfers = {
      docId: getPlatformFeeTransferId({ blockNumber: Number(log.blockNumber), txHash: log.transactionHash, logIndex: Number(log.logIndex) }),
      etfId: Number(decoded.args.etfId),
      amount: {
        eth: Number(formatUnits(decoded.args.ethAmount, 18)),
        usd: Number(formatUnits(decoded.args.usdValue, 18)),
      },
      txHash: log.transactionHash,
      timestamp: log.timestamp,
    };

    cache.addEntity({ entity: "platform_fee_transfers", id: platformFeeTransfer.docId, value: platformFeeTransfer, blockNumber: Number(log.blockNumber) });
  }
};
