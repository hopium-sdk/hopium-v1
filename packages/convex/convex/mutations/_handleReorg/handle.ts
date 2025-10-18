import { mutation, MutationCtx } from "../../_generated/server";
import { v } from "convex/values";
import { C_Etf } from "../../schema/etf";

export default mutation({
  args: {
    safeBlockNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const { safeBlockNumber } = args;

    const unsafeEtfTokenTransfers = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_syncBlockNumber", (q) => q.gt("syncBlockNumber_", safeBlockNumber))
      .collect();

    const unsafeEtfs = await ctx.db
      .query("etfs")
      .withIndex("by_syncBlockNumber", (q) => q.gt("syncBlockNumber_", safeBlockNumber))
      .collect();

    const unsafeAssets = await ctx.db
      .query("assets")
      .withIndex("by_syncBlockNumber", (q) => q.gt("syncBlockNumber_", safeBlockNumber))
      .collect();

    const unsafePools = await ctx.db
      .query("pools")
      .withIndex("by_syncBlockNumber", (q) => q.gt("syncBlockNumber_", safeBlockNumber))
      .collect();

    const unsafeOhlcs = await ctx.db
      .query("ohlc")
      .withIndex("by_syncBlockNumber", (q) => q.gt("syncBlockNumber_", safeBlockNumber))
      .collect();

    //delete all unsafe etf token transfers
    for (const etfTokenTransfer of unsafeEtfTokenTransfers) {
      await ctx.db.delete(etfTokenTransfer._id);
    }

    //delete all unsafe etfs
    for (const etf of unsafeEtfs) {
      await ctx.db.delete(etf._id);
    }

    //delete all unsafe assets
    for (const asset of unsafeAssets) {
      await ctx.db.delete(asset._id);
    }

    //delete all unsafe pools
    for (const pool of unsafePools) {
      await ctx.db.delete(pool._id);
    }

    //delete all unsafe ohlcs
    for (const ohlc of unsafeOhlcs) {
      await ctx.db.delete(ohlc._id);
    }

    await _updateWatchlists(ctx, unsafeEtfs);
  },
});

const _updateWatchlists = async (ctx: MutationCtx, unsafeEtfs: C_Etf[]) => {
  const unsafeEtfIds = new Set<number>(unsafeEtfs.map((e: C_Etf) => e.details.etfId).filter((x: unknown): x is number => typeof x === "number"));

  if (unsafeEtfIds.size > 0) {
    // Pull all watchlists (use an index if you have one to scope further)
    const watchlists = await ctx.db.query("watchlist").collect();

    for (const wl of watchlists) {
      // Remove any items that reference an unsafe ETF id
      const filtered = wl.items.filter((it: { etfId: number }) => !unsafeEtfIds.has(it.etfId));

      if (filtered.length !== wl.items.length) {
        // Reindex to keep `index` contiguous and ordered
        const reindexed = filtered.map((it, i) => ({ ...it, index: i }));
        await ctx.db.patch(wl._id, { items: reindexed });
      }
    }
  }
};
