import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const reorderWatchlist = mutation({
  args: { user_address: v.string(), index_id: v.string(), new_index: v.number() },
  handler: async (ctx, args) => {
    const { user_address, index_id, new_index } = args;

    // don’t allow negative positions
    if (new_index < 0) return;

    const watchlist = await ctx.db
      .query("watchlist")
      .withIndex("by_user_address", (q) => q.eq("user_address", user_address))
      .first();

    // 1) No watchlist yet → create one with this coin at index 0
    if (!watchlist) {
      await ctx.db.insert("watchlist", {
        user_address,
        items: [{ index_id, index: 0 }],
      });
      return;
    }

    // 2) Start from existing items, removing any old instance of this coin
    const items = watchlist.items.filter((item) => item.index_id !== index_id);

    // 3) Clamp target index into [0, items.length]
    const clampedIndex = Math.max(0, Math.min(new_index, items.length));

    // 4) Insert (new or moved) coin at the right spot
    items.splice(clampedIndex, 0, { index_id, index: clampedIndex });

    // 5) Renumber all items so indexes run 0,1,2,...
    const updatedItems = items.map((item, idx) => ({
      index_id: item.index_id,
      index: idx,
    }));

    // 6) Persist
    await ctx.db.patch(watchlist._id, { items: updatedItems });
  },
});
