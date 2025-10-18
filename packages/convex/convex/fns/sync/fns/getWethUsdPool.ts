import { normalizeAddress } from "../../../../src/utils/normalizeAddress";
import { QueryCtx } from "../../../_generated/server";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";

export const _getWethUsdPool = async ({ ctx }: { ctx: QueryCtx }) => {
  const wethAddress = COMMON_CONSTANTS.addresses.weth[COMMON_CONSTANTS.networkSelected];
  const usdcAddress = COMMON_CONSTANTS.addresses.usdc[COMMON_CONSTANTS.networkSelected];

  const normalizedToken0 = normalizeAddress(wethAddress);
  const normalizedToken1 = normalizeAddress(usdcAddress);

  // Try to find pool with token0 as token0 and token1 as token1
  let pool = await ctx.db
    .query("pools")
    .withIndex("by_tokens", (q) => q.eq("details.token0", normalizedToken0).eq("details.token1", normalizedToken1))
    .first();

  // If not found, try the reverse order (token0 as token1 and token1 as token0)
  if (!pool) {
    pool = await ctx.db
      .query("pools")
      .withIndex("by_tokens", (q) => q.eq("details.token0", normalizedToken1).eq("details.token1", normalizedToken0))
      .first();
  }

  return pool;
};
