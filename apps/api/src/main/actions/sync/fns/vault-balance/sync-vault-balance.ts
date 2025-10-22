import { normalizeAddress } from "@repo/common/utils/address";
import { CacheManager } from "../../helpers/cache-manager";
import { T_QnLog } from "../../schema";
import { decodeVaultBalanceLog } from "../../utils/logs/filter-logs/vault-balance";
import { formatUnits } from "viem";
import { _updateEtfPriceAndOhlc } from "../swap/sync-swap";

// NOTE: We don't need to preload pools for price update, because we already preload pool from swaps (vb and swap always take place together)
export const _syncVaultBalance = async ({ log, cache, etfAssetPoolMap }: { log: T_QnLog; cache: CacheManager; etfAssetPoolMap: Map<string, string> }) => {
  const decodedLog = decodeVaultBalanceLog({ log });

  const etf = cache.getEntity({ entity: "etf", id: decodedLog.args.etfId.toString() });

  if (!etf) {
    return;
  }

  const etfAssetsMap = new Map(etf.details.assets.map((asset) => [normalizeAddress(asset.tokenAddress), asset]));

  for (const { tokenAddress, tokenAmount } of decodedLog.args.updatedBalances) {
    const etfAsset = etfAssetsMap.get(normalizeAddress(tokenAddress));
    if (!etfAsset) {
      return;
    }

    const asset = cache.getEntity({ entity: "asset", id: normalizeAddress(tokenAddress) });
    if (!asset) {
      return;
    }

    const updatedBalance = Number(formatUnits(tokenAmount, asset.decimals));
    etfAsset.balance = updatedBalance;
  }

  const ethUsdPrice = cache.getEthPrice();
  _updateEtfPriceAndOhlc({ etf, cache, etfAssetPoolMap, ethUsdPrice, log });
};

export const _getPreloadEntitiesForVaultBalance = async ({ logs }: { logs: T_QnLog[] }) => {
  const decodedLogs = logs.map((log) => ({ log, decoded: decodeVaultBalanceLog({ log }) }));

  const etfIds = decodedLogs.flatMap(({ decoded }) => Number(decoded.args.etfId));
  const assetAddresses = decodedLogs.flatMap(({ decoded }) => decoded.args.updatedBalances.map(({ tokenAddress }) => normalizeAddress(tokenAddress)));

  return { etfIds: [...new Set(etfIds)], assetAddresses: [...new Set(assetAddresses)] };
};
