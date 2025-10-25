import { MutationCtx } from "../../../_generated/server";
import { snapshot } from "../helpers/snapshot";
import { T_PlatformFeeTransfers } from "../../../schema/platformFeeTransfers";

/**
 * Insert ETF token transfers for a single block (append-only).
 * Requires .index("by_docId", ["docId"]) on etf_token_transfers.
 */
export const _upsertPlatformFeeTransfers = async (ctx: MutationCtx, platformFeeTransfers: T_PlatformFeeTransfers[], blockNumber: number) => {
  for (const tr of platformFeeTransfers) {
    const existing = await ctx.db
      .query("platform_fee_transfers")
      .withIndex("by_docId", (q) => q.eq("docId", tr.docId))
      .first();

    // Snapshot BEFORE mutating (idempotent per (block, table, docId))
    await snapshot(ctx, {
      blockNumber,
      table: "platform_fee_transfers",
      docId: tr.docId,
      existed: !!existing,
      before: existing ?? null,
    });

    if (existing) {
      await ctx.db.patch(existing._id, { ...existing, ...tr });
    } else {
      await ctx.db.insert("platform_fee_transfers", tr);
    }
  }
};
