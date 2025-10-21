import { MutationCtx } from "../../../_generated/server";
import { T_Etf } from "../../../schema/etf";
import { snapshot } from "../helpers/snapshot";
import { normalizeAddress } from "../../../../src/utils/normalizeAddress";

/**
 * Upsert ETFs for a single block (reorg-safe via snapshots).
 * Requires an index on etfs: .index("by_docId", ["docId"])
 */
export const _upsertEtfs = async (ctx: MutationCtx, etfs: T_Etf[], blockNumber: number) => {
  const normalized = etfs.map((etf) => {
    const docId = etf.docId;

    return {
      ...etf,
      docId,
      details: {
        ...etf.details,
        assets: etf.details.assets.map((a) => ({
          ...a,
          tokenAddress: normalizeAddress(a.tokenAddress),
        })),
      },
      contracts: {
        etfTokenAddress: normalizeAddress(etf.contracts.etfTokenAddress),
        etfVaultAddress: normalizeAddress(etf.contracts.etfVaultAddress),
      },
    } as T_Etf & { docId: string };
  });

  // 2) upsert each ETF with a snapshot taken once per (block, docId)
  for (const etf of normalized) {
    const existing = await ctx.db
      .query("etfs")
      .withIndex("by_docId", (q) => q.eq("docId", etf.docId))
      .first();

    // record snapshot BEFORE the first mutation in this block
    await snapshot(ctx, {
      blockNumber,
      table: "etfs",
      docId: etf.docId,
      existed: !!existing,
      before: existing ?? null,
    });

    if (existing) {
      // patch to the new state (no merging needed beyond your normalization)
      await ctx.db.patch(existing._id, { ...existing, ...etf });
    } else {
      await ctx.db.insert("etfs", etf);
    }
  }
};
