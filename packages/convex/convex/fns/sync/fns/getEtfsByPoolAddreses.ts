import { normalizeAddress } from "../../../../src/utils/normalizeAddress";
import { QueryCtx } from "../../../_generated/server";
import { C_Pool } from "../../../schema/pools";

export const _getEtfsByPoolAddresses = async ({ ctx, poolAddresses }: { ctx: QueryCtx; poolAddresses: string[] }) => {
  const pools: C_Pool[] = (
    await Promise.all(
      poolAddresses.map(async (address) => {
        const pool = await ctx.db
          .query("pools")
          .withIndex("by_address", (q) => q.eq("address", normalizeAddress(address)))
          .first();

        return pool;
      })
    )
  ).filter((pool): pool is C_Pool => pool !== null);

  // Pre-build a set of all token addresses from all pools for O(1) lookup
  const poolTokenAddresses = new Set<string>();
  for (const pool of pools) {
    poolTokenAddresses.add(normalizeAddress(pool.details.token0));
    poolTokenAddresses.add(normalizeAddress(pool.details.token1));
  }

  const etfs = await ctx.db.query("etfs").collect();

  const finalEtfs = etfs.filter((etf) => etf.details.assets.some((asset) => poolTokenAddresses.has(normalizeAddress(asset.tokenAddress))));

  return finalEtfs;
};
