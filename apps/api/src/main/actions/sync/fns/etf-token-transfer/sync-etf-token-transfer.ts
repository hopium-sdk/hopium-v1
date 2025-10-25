import { T_EtfTokenTransfer } from "@repo/convex/schema";
import { CacheManager } from "../../helpers/cache-manager";
import { T_QnLog } from "../../schema";
import { decodeEtfTokenTransferLog } from "../../utils/logs/filter-logs/etf-token-transfer";
import { normalizeAddress } from "@repo/common/utils/address";
import { getEtfTokenTransferId } from "@repo/convex/schema";
import { formatUnits } from "viem";

export const _syncEtfTokenTransfer = ({ log, cache }: { log: T_QnLog; cache: CacheManager }) => {
  const decodedLog = decodeEtfTokenTransferLog({ log });

  const etfTokenTransfer: T_EtfTokenTransfer = {
    docId: getEtfTokenTransferId({ blockNumber: Number(log.blockNumber), txHash: log.transactionHash, logIndex: Number(log.logIndex) }),
    etfId: Number(decodedLog.args.etfId),
    blockNumber: Number(log.blockNumber),
    logIndex: Number(log.logIndex),
    transactionIndex: Number(log.transactionIndex),
    fromAddress: normalizeAddress(decodedLog.args.fromAddress),
    toAddress: normalizeAddress(decodedLog.args.toAddress),
    transferAmount: Number(formatUnits(decodedLog.args.transferAmount, 18)),
    etfPrice: {
      eth: Number(formatUnits(decodedLog.args.etfWethPrice, 18)),
      usd: Number(formatUnits(decodedLog.args.etfUsdPrice, 18)),
    },
    txHash: log.transactionHash,
    timestamp: log.timestamp,
  };

  cache.addEntity({ entity: "etf_token_transfer", id: etfTokenTransfer.docId, value: etfTokenTransfer, blockNumber: Number(log.blockNumber) });

  const etf = cache.getEntity({ entity: "etf", id: decodedLog.args.etfId.toString() });
  if (!etf) {
    return;
  }

  etf.stats.totalSupply = Number(formatUnits(decodedLog.args.totalSupply, 18));
  cache.addEntity({ entity: "etf", id: etf.details.etfId.toString(), value: etf, blockNumber: Number(log.blockNumber) });
};

export const _getPreloadEntitiesForTokenTransfer = async ({ logs }: { logs: T_QnLog[] }) => {
  const decodedLogs = logs.map((log) => ({ log, decoded: decodeEtfTokenTransferLog({ log }) }));

  const etfIds = decodedLogs.flatMap(({ decoded }) => Number(decoded.args.etfId));

  return { etfIds: [...new Set(etfIds)] };
};
