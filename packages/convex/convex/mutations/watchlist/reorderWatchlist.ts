import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const reorderWatchlist = mutation({
  args: { userAddress: v.string(), etfId: v.number(), newIndex: v.number() },
  handler: async (ctx, args) => {
    const { userAddress, etfId, newIndex } = args;

    // don’t allow negative positions
    if (newIndex < 0) return;

    const watchlist = await ctx.db
      .query("watchlist")
      .withIndex("by_userAddress", (q) => q.eq("userAddress", userAddress))
      .first();

    // 1) No watchlist yet → create one with this coin at index 0
    if (!watchlist) {
      await ctx.db.insert("watchlist", {
        userAddress,
        items: [{ etfId, index: 0 }],
      });
      return;
    }

    // 2) Start from existing items, removing any old instance of this coin
    const items = watchlist.items.filter((item) => item.etfId !== etfId);

    // 3) Clamp target index into [0, items.length]
    const clampedIndex = Math.max(0, Math.min(newIndex, items.length));

    // 4) Insert (new or moved) coin at the right spot
    items.splice(clampedIndex, 0, { etfId, index: clampedIndex });

    // 5) Renumber all items so indexes run 0,1,2,...
    const updatedItems = items.map((item, idx) => ({
      etfId: item.etfId,
      index: idx,
    }));

    // 6) Persist
    await ctx.db.patch(watchlist._id, { items: updatedItems });
  },
});
