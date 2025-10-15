import { query } from "../../_generated/server";
import { v } from "convex/values";
import { C_HoldingToken } from "../../schema/holdingTokens";
import { C_Etf } from "../../schema/etf";

export default query({
  args: {
    indexId: v.string(),
  },
  handler: async (ctx, args) => {
    const etf: C_Etf | null = await ctx.db
      .query("etfs")
      .withIndex("by_indexId", (q) => q.eq("index.indexId", args.indexId))
      .first();

    if (!etf) return [];

    const holdings = etf?.index.holdings;

    const tokens: C_HoldingToken[] = (
      await Promise.all(
        holdings?.map(async (holding) => {
          const token = await ctx.db
            .query("holding_tokens")
            .withIndex("by_address", (q) => q.eq("address", holding.tokenAddress))
            .first();

          if (!token) return null;

          return token;
        })
      )
    ).filter((token) => token !== null);

    return tokens;
  },
});
