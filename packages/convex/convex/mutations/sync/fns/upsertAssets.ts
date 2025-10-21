import { MutationCtx } from "../../../_generated/server";
import { T_Asset } from "../../../schema/assets";
import { normalizeAddress } from "../../../../src/utils/normalizeAddress";
import { snapshot } from "../helpers/snapshot";

/**
 * Upsert Assets for a single block (reorg-safe via snapshots).
 * Requires assets table to have .index("by_docId", ["docId"])
 */
export const _upsertAssets = async (ctx: MutationCtx, assets: T_Asset[], blockNumber: number) => {
  // Normalize inputs
  const normalizedAssets = assets.map((asset) => ({
    ...asset,
    address: normalizeAddress(asset.address),
    ...(asset.poolAddress ? { poolAddress: normalizeAddress(asset.poolAddress) } : {}),
  }));

  for (const asset of normalizedAssets) {
    const docId = asset.docId; // using your unified table id

    // Look up by primary key
    const existing = await ctx.db
      .query("assets")
      .withIndex("by_docId", (q) => q.eq("docId", docId))
      .first();

    // Take a snapshot BEFORE mutating (idempotent per (block, table, docId))
    await snapshot(ctx, {
      blockNumber,
      table: "assets",
      docId,
      existed: !!existing,
      before: existing ?? null,
    });

    if (existing) {
      // Patch to new state (keep same _id, same docId)
      await ctx.db.patch(existing._id, { ...existing, ...asset });
    } else {
      // Insert new document
      await ctx.db.insert("assets", asset);
    }
  }
};
