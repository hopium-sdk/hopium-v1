import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const addToWatchlist = mutation({
  args: { userAddress: v.string(), etfId: v.number() },
  handler: async (ctx, args) => {
    const { userAddress, etfId } = args;

    const watchlist = await ctx.db
      .query("watchlist")
      .withIndex("by_userAddress", (q) => q.eq("userAddress", userAddress))
      .first();

    if (!watchlist) {
      await ctx.db.insert("watchlist", {
        docId: userAddress,
        userAddress,
        items: [{ etfId, index: 0 }],
      });
    } else {
      const isInWatchlist = watchlist.items.some((item) => item.etfId === etfId);
      if (isInWatchlist) return;

      const watchlist_id = watchlist._id;

      await ctx.db.patch(watchlist_id, {
        items: [...watchlist.items, { etfId, index: watchlist.items.length }],
      });
    }
  },
});
