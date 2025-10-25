import { MutationCtx } from "../../../_generated/server";
import { T_AffiliateTransfers } from "../../../schema/affiliateTransfers";
import { normalizeAddress } from "../../../../src/utils/normalizeAddress";
import { snapshot } from "../helpers/snapshot";

export const _upsertAffiliateTransfers = async (ctx: MutationCtx, affiliateTransfers: T_AffiliateTransfers[], blockNumber: number) => {
  const normalized = affiliateTransfers.map((t) => ({
    ...t,
    owner: normalizeAddress(t.owner),
  }));

  for (const transfer of normalized) {
    const existing = await ctx.db
      .query("affiliate_transfers")
      .withIndex("by_docId", (q) => q.eq("docId", transfer.docId))
      .first();

    await snapshot(ctx, {
      blockNumber,
      table: "affiliate_transfers",
      docId: transfer.docId,
      existed: !!existing,
      before: existing ?? null,
    });

    if (existing) {
      await ctx.db.patch(existing._id, { ...existing, ...transfer });
    } else {
      await ctx.db.insert("affiliate_transfers", transfer);
    }
  }
};
