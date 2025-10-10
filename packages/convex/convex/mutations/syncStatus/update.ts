import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    lastBlockNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const { lastBlockNumber } = args;

    const syncStatus = await ctx.db.query("sync_status").first();

    if (!syncStatus) {
      await ctx.db.insert("sync_status", { statusId: 0, lastBlockNumber });
    } else {
      await ctx.db.patch(syncStatus._id, { lastBlockNumber });
    }
  },
});
