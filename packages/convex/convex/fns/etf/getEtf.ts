import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
  args: {
    indexId: v.string(),
  },
  handler: async (ctx, args) => {
    const etf = await ctx.db
      .query("etfs")
      .withIndex("by_indexId", (q) => q.eq("index.indexId", args.indexId))
      .first();

    return etf;
  },
});
