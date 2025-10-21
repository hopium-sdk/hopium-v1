import { MutationCtx } from "../../../_generated/server";
import { T_EtfTokenTransfer } from "../../../schema/etfTokenTranfers";
import { normalizeAddress } from "../../../../src/utils/normalizeAddress";
import { snapshot } from "../helpers/snapshot";

/**
 * Insert ETF token transfers for a single block (append-only).
 * Requires .index("by_docId", ["docId"]) on etf_token_transfers.
 */
export const _upsertTokenTransfers = async (ctx: MutationCtx, etfTokenTransfers: T_EtfTokenTransfer[], blockNumber: number) => {
  const normalized = etfTokenTransfers.map((t) => ({
    ...t,
    // ensure a stable primary key; often transferId is `${txHash}:${logIndex}`
    docId: t.docId,
    fromAddress: normalizeAddress(t.fromAddress),
    toAddress: normalizeAddress(t.toAddress),
  }));

  for (const tr of normalized) {
    const existing = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_docId", (q) => q.eq("docId", tr.docId))
      .first();

    // Snapshot BEFORE mutating (idempotent per (block, table, docId))
    await snapshot(ctx, {
      blockNumber,
      table: "etf_token_transfers",
      docId: tr.docId,
      existed: !!existing,
      before: existing ?? null,
    });

    if (existing) {
      await ctx.db.patch(existing._id, { ...existing, ...tr });
    } else {
      await ctx.db.insert("etf_token_transfers", tr);
    }
  }
};
