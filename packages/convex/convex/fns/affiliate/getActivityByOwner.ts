import { paginationOptsValidator } from "convex/server";
import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
  args: {
    owner: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { owner, paginationOpts } = args;

    const activity = await ctx.db
      .query("affiliate_transfers")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .order("desc")
      .paginate(paginationOpts);

    return activity;
  },
});
