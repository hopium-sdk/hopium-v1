import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
  args: {
    etfId: v.number(),
  },
  handler: async (ctx, args) => {
    const etf = await ctx.db
      .query("etfs")
      .withIndex("by_etfId", (q) => q.eq("details.etfId", args.etfId))
      .first();

    console.log("etf", args.etfId, etf);

    return etf;
  },
});
