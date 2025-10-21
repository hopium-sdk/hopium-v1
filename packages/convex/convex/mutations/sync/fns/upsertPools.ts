import { MutationCtx } from "../../../_generated/server";
import { T_Pool } from "../../../schema/pools";
import { normalizeAddress } from "../../../../src/utils/normalizeAddress";
import { snapshot } from "../helpers/snapshot";

/**
 * Upsert Pools for a single block (snapshot-based reorg safety).
 * Requires pools table to have .index("by_docId", ["docId"])
 */
export const _upsertPools = async (ctx: MutationCtx, pools: T_Pool[], blockNumber: number) => {
  const normalizedPools = pools.map((pool) => ({
    ...pool,
    address: normalizeAddress(pool.address),
    details: {
      ...pool.details,
      token0: normalizeAddress(pool.details.token0),
      token1: normalizeAddress(pool.details.token1),
    },
  }));

  for (const pool of normalizedPools) {
    const docId = pool.docId; // stable table ID

    const existing = await ctx.db
      .query("pools")
      .withIndex("by_docId", (q) => q.eq("docId", docId))
      .first();

    // Take snapshot BEFORE mutating (idempotent per (block, table, docId))
    await snapshot(ctx, {
      blockNumber,
      table: "pools",
      docId,
      existed: !!existing,
      before: existing ?? null,
    });

    if (existing) {
      await ctx.db.patch(existing._id, { ...existing, ...pool });
    } else {
      await ctx.db.insert("pools", pool);
    }
  }
};
