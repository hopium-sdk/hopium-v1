import { C_WatchlistWithEtf } from "../../schema/watchlist";
import { query } from "../../_generated/server";
import { v } from "convex/values";

export const getWatchlist = query({
  args: { userAddress: v.string() },
  handler: async (ctx, args) => {
    const watchlist = await ctx.db
      .query("watchlist")
      .withIndex("by_userAddress", (q) => q.eq("userAddress", args.userAddress))
      .first();

    if (!watchlist) return null;

    const watchlistItemsWithEtf: C_WatchlistWithEtf["items"] = (
      await Promise.all(
        watchlist?.items.map(async (item) => {
          const etf = await ctx.db
            .query("etfs")
            .withIndex("by_etfId", (q) => q.eq("details.etfId", item.etfId))
            .first();

          if (!etf) return null;

          return { ...item, etf };
        }) ?? []
      )
    ).filter((item) => item !== null);

    return { ...watchlist, items: watchlistItemsWithEtf.sort((a, b) => a.index - b.index) };
  },
});
