import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
  args: {
    owner: v.string(),
  },
  handler: async (ctx, args) => {
    const { owner } = args;

    const allTransfers = await ctx.db
      .query("affiliate_transfers")
      .withIndex("by_owner", (q) => q.eq("owner", owner))
      .collect();

    return allTransfers.reduce((acc, transfer) => acc + transfer.ethAmount, 0);
  },
});
