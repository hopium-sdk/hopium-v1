import { QueryCtx } from "../../../_generated/server";
import { C_Pool } from "../../../schema/pools";

export const _getPoolsByAddresses = async ({ ctx, poolAddresses }: { ctx: QueryCtx; poolAddresses: string[] }) => {
  const pools: C_Pool[] = (
    await Promise.all(
      poolAddresses.map(async (address) =>
        ctx.db
          .query("pools")
          .withIndex("by_address", (q) => q.eq("address", address))
          .first()
      )
    )
  ).filter((pool) => pool !== null);
  return pools;
};
