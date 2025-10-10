import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const addToWatchlist = mutation({
  args: { user_address: v.string(), index_id: v.string() },
  handler: async (ctx, args) => {
    const { user_address, index_id } = args;

    const watchlist = await ctx.db
      .query("watchlist")
      .withIndex("by_user_address", (q) => q.eq("user_address", user_address))
      .first();

    if (!watchlist) {
      await ctx.db.insert("watchlist", {
        user_address,
        items: [{ index_id, index: 0 }],
      });
    } else {
      const isInWatchlist = watchlist.items.some((item) => item.index_id === index_id);
      if (isInWatchlist) return;

      const watchlist_id = watchlist._id;

      await ctx.db.patch(watchlist_id, {
        items: [...watchlist.items, { index_id, index: watchlist.items.length }],
      });
    }
  },
});
