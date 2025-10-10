import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const removeFromWatchlist = mutation({
  args: { user_address: v.string(), index_id: v.string() },
  handler: async (ctx, args) => {
    const { user_address, index_id } = args;

    const watchlist = await ctx.db
      .query("watchlist")
      .withIndex("by_user_address", (q) => q.eq("user_address", user_address))
      .first();

    if (!watchlist) {
      return;
    } else {
      const isInWatchlist = watchlist.items.some((item) => item.index_id === index_id);
      if (!isInWatchlist) return;

      const newItems = watchlist.items.filter((item) => item.index_id !== index_id);
      const newItemsWithIndex = newItems.map((item, index) => ({ ...item, index }));

      await ctx.db.patch(watchlist._id, {
        items: newItemsWithIndex,
      });
    }
  },
});
