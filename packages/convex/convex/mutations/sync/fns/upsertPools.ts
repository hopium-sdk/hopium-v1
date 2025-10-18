import { MutationCtx } from "../../../_generated/server";
import assert from "assert";
import { normalizeAddress } from "../../../../src/utils/normalizeAddress";
import { C_Pool, T_Pool } from "../../../schema/pools";

export const _upsertPools = async (ctx: MutationCtx, pools: T_Pool[]) => {
  const normalizedPools = pools.map((pool) => ({
    ...pool,
    address: normalizeAddress(pool.address),
    details: {
      ...pool.details,
      token0: normalizeAddress(pool.details.token0),
      token1: normalizeAddress(pool.details.token1),
    },
  }));

  const found = (
    await Promise.all(
      normalizedPools.map(async (pool) => {
        return await ctx.db
          .query("pools")
          .withIndex("by_address", (q) => q.eq("address", pool.address))
          .first();
      })
    )
  ).filter((pool) => pool !== null) as C_Pool[];

  const not_found = normalizedPools.filter((pool) => !found.find((c: C_Pool) => c.address === pool.address));

  if (not_found.length > 0) {
    for (const pool of not_found) {
      await ctx.db.insert("pools", pool);
    }
  }

  if (found.length > 0) {
    for (const pool of found) {
      const new_pool = normalizedPools.find((c) => c.address === pool.address);

      assert(new_pool, `Pool ${pool.address} not found`);

      await ctx.db.patch(pool._id, { ...new_pool });
    }
  }
};
