import { CONVEX } from "@/main/lib/convex";
import { C_Asset, T_Asset, T_Etf } from "@repo/convex/schema";
import { fetchAssetDetails } from "./fns/fetch-asset-details";

export const parseNewAssets = async ({ etfs }: { etfs: T_Etf[] }) => {
  // 1) Build a map of tokenAddress -> min _syncBlockNumber seen across ETFs
  const addressToSyncBlock = new Map<string, number>();
  for (const etf of etfs) {
    for (const asset of etf.details.assets) {
      const addr = asset.tokenAddress;
      const prev = addressToSyncBlock.get(addr);
      // Use the min block number (earliest ETF appearance)
      const newValue = prev === undefined ? etf.syncBlockNumber_ : Math.min(prev, etf.syncBlockNumber_);
      addressToSyncBlock.set(addr, newValue);
    }
  }

  // 2) De-dupe token addresses
  const candidateAddresses = Array.from(addressToSyncBlock.keys());

  // 3) Filter out tokens we already have
  const existingAssets: C_Asset[] = await CONVEX.httpClient.query(CONVEX.api.fns.assets.getFromAddresses.default, {
    addresses: candidateAddresses,
  });

  const existingSet = new Set(existingAssets.map((t) => t.address));
  const newAssetAddresses = candidateAddresses.filter((a) => !existingSet.has(a));

  // 4) Fetch details for new tokens, passing earliest syncBlockNumber
  const newAssets: T_Asset[] = await Promise.all(
    newAssetAddresses.map(async (assetAddress) => {
      const syncBlockNumber = addressToSyncBlock.get(assetAddress)!;
      const asset = await fetchAssetDetails({
        tokenAddress: assetAddress as `0x${string}`,
        syncBlockNumber, // <-- now the MIN _syncBlockNumber across ETFs
      });
      return asset;
    })
  );

  return newAssets;
};
