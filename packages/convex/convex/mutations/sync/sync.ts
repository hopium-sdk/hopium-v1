import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { EtfSchema } from "../../schema/etf";
import { EtfTokenTransfersSchema } from "../../schema/etfTokenTranfers";
import { AssetSchema } from "../../schema/assets";
import { PoolSchema } from "../../schema/pools";
import { _upsertAssets } from "./fns/upsertAssets";
import { _upsertEtfs } from "./fns/upsertEtfs";
import { _upsertTokenTransfers } from "./fns/upsertTokenTransfers";
import { _upsertPools } from "./fns/upsertPools";
import { _updateOhlcs } from "./fns/updateOhlcs";
import { _updateSyncStatus } from "./fns/updateSyncStatus";
import { AffiliateTransfersSchema } from "../../schema/affiliateTransfers";
import { _upsertAffiliateTransfers } from "./fns/upsertAffiliateTransfers";

const BlockPayload = v.object({
  blockNumber: v.number(),
  etfs: v.array(v.object(EtfSchema)),
  etfTokenTransfers: v.array(v.object(EtfTokenTransfersSchema)),
  assets: v.array(v.object(AssetSchema)),
  pools: v.array(v.object(PoolSchema)),
  ohlcUpdates: v.array(
    v.object({
      etfId: v.number(),
      timestamp: v.number(),
      price: v.number(),
      volume: v.optional(v.number()), // optional, since your _updateOhlcs supports it
    })
  ),
  affiliateTransfers: v.array(v.object(AffiliateTransfersSchema)),
});

export default mutation({
  args: {
    blocks: v.array(BlockPayload),
  },
  handler: async (ctx, args) => {
    const { blocks } = args;
    if (blocks.length === 0) return;

    // Process in ascending block order to preserve OHLC prev-close seeding, etc.
    const sorted = blocks.slice().sort((a, b) => a.blockNumber - b.blockNumber);

    // Optional: dedupe identical blockNumbers (keep the last occurrence)
    // (If you never send duplicates, you can remove this.)
    const deduped = Array.from(new Map(sorted.map((b) => [b.blockNumber, b])).values());

    for (const b of deduped) {
      const { blockNumber, etfs, etfTokenTransfers, assets, pools, ohlcUpdates, affiliateTransfers } = b;

      // Each helper already does snapshot(...) per doc for this block
      await _upsertAssets(ctx, assets, blockNumber);
      await _upsertEtfs(ctx, etfs, blockNumber);
      await _upsertTokenTransfers(ctx, etfTokenTransfers, blockNumber);
      await _upsertPools(ctx, pools, blockNumber);
      await _updateOhlcs(ctx, ohlcUpdates, blockNumber);
      await _upsertAffiliateTransfers(ctx, affiliateTransfers, blockNumber);
      // Option A: advance sync status per block (monotonic)
      // await _updateSyncStatus(ctx, blockNumber);
    }

    // Option B (alternative): only set sync status once to the max block
    const maxBlock = deduped[deduped.length - 1]!.blockNumber;
    await _updateSyncStatus(ctx, maxBlock);
  },
});
