import { query } from "../../_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export default query({
  args: {
    etfId: v.number(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { etfId, paginationOpts } = args;

    const activity = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_etfId", (q) => q.eq("etfId", etfId))
      .order("desc")
      .paginate(paginationOpts);

    return activity;
  },
});
