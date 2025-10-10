import { C_WatchlistWithEtf } from "../../schema/watchlist";
import { query } from "../../_generated/server";
import { v } from "convex/values";

export const getWatchlist = query({
  args: { user_address: v.string() },
  handler: async (ctx, args) => {
    const watchlist = await ctx.db
      .query("watchlist")
      .withIndex("by_user_address", (q) => q.eq("user_address", args.user_address))
      .first();

    if (!watchlist) return null;

    const watchlistItemsWithEtf: C_WatchlistWithEtf["items"] = (
      await Promise.all(
        watchlist?.items.map(async (item) => {
          const etf = await ctx.db
            .query("etfs")
            .withIndex("by_indexId", (q) => q.eq("index.indexId", item.index_id))
            .first();

          if (!etf) return null;

          return { ...item, etf };
        }) ?? []
      )
    ).filter((item) => item !== null);

    return { ...watchlist, items: watchlistItemsWithEtf.sort((a, b) => a.index - b.index) };
  },
});
