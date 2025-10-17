import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const removeFromWatchlist = mutation({
  args: { userAddress: v.string(), etfId: v.number() },
  handler: async (ctx, args) => {
    const { userAddress, etfId } = args;

    const watchlist = await ctx.db
      .query("watchlist")
      .withIndex("by_userAddress", (q) => q.eq("userAddress", userAddress))
      .first();

    if (!watchlist) {
      return;
    } else {
      const isInWatchlist = watchlist.items.some((item) => item.etfId === etfId);
      if (!isInWatchlist) return;

      const newItems = watchlist.items.filter((item) => item.etfId !== etfId);
      const newItemsWithIndex = newItems.map((item, index) => ({ ...item, index }));

      await ctx.db.patch(watchlist._id, {
        items: newItemsWithIndex,
      });
    }
  },
});
