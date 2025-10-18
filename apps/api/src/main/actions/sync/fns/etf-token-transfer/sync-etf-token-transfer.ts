import { T_EtfTokenTransfer } from "@repo/convex/schema";
import { CacheManager } from "../../helpers/cache-manager";
import { T_QnLog } from "../../schema";
import { decodeEtfTokenTransferLog } from "../../utils/logs/filter-logs/etf-token-transfer";
import { normalizeAddress } from "@repo/common/utils/address";
import { getEtfTokenTransferId } from "@repo/convex/schema";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";
import { formatUnits } from "viem";

// NOTE: We don't need to preload etf supply for price update, because we already preload etf supply from swaps (token transfer and swaps always take place together)
export const _syncEtfTokenTransfer = ({ log, cache }: { log: T_QnLog; cache: CacheManager }) => {
  const decodedLog = decodeEtfTokenTransferLog({ log });

  const etfTokenTransfer: T_EtfTokenTransfer = {
    transferId: getEtfTokenTransferId({ txHash: log.transactionHash, logIndex: Number(log.logIndex) }),
    blockNumber: Number(log.blockNumber),
    logIndex: Number(log.logIndex),
    transactionIndex: Number(log.transactionIndex),
    etfTokenAddress: normalizeAddress(decodedLog.args.etfTokenAddress),
    fromAddress: normalizeAddress(decodedLog.args.fromAddress),
    toAddress: normalizeAddress(decodedLog.args.toAddress),
    transferAmount: Number(formatUnits(decodedLog.args.transferAmount, 18)),
    etfPrice: {
      eth: Number(formatUnits(decodedLog.args.etfWethPrice, 18)),
      usd: Number(formatUnits(decodedLog.args.etfUsdPrice, 18)),
    },
    txHash: log.transactionHash,
    syncBlockNumber_: Number(log.blockNumber),
  };

  cache.addEntity({ entity: "etf_token_transfer", id: etfTokenTransfer.transferId, value: etfTokenTransfer });

  const zeroAddress = COMMON_CONSTANTS.addresses.zero;
  if (decodedLog.args.fromAddress === zeroAddress || decodedLog.args.toAddress === zeroAddress) {
    const isMint = decodedLog.args.fromAddress === zeroAddress;

    let newSupply = cache.getEtfSupply({ etfTokenAddress: decodedLog.args.etfTokenAddress });
    if (isMint) {
      newSupply += Number(formatUnits(decodedLog.args.transferAmount, 18));
    } else {
      newSupply -= Number(formatUnits(decodedLog.args.transferAmount, 18));
    }

    cache.updateEtfSupply({ etfTokenAddress: decodedLog.args.etfTokenAddress, totalSupply: newSupply });
  }
};
