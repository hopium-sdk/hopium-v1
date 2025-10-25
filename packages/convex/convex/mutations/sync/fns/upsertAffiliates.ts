import { snapshot } from "../helpers/snapshot";
import { MutationCtx } from "../../../_generated/server";
import { T_Affiliate } from "../../../schema/affiliates";
import { normalizeAddress } from "../../../../src/utils/normalizeAddress";

export const _upsertAffiliates = async (ctx: MutationCtx, affiliates: T_Affiliate[], blockNumber: number) => {
  const normalized = affiliates.map((a) => ({
    ...a,
    owner: normalizeAddress(a.owner),
  }));

  for (const affiliate of normalized) {
    const existing = await ctx.db
      .query("affiliates")
      .withIndex("by_docId", (q) => q.eq("docId", affiliate.docId))
      .first();

    await snapshot(ctx, {
      blockNumber,
      table: "affiliates",
      docId: affiliate.docId,
      existed: !!existing,
      before: existing ?? null,
    });

    if (existing) {
      await ctx.db.patch(existing._id, { ...existing, ...affiliate });
    } else {
      await ctx.db.insert("affiliates", affiliate);
    }
  }
};
