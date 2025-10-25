// convex/functions/wipeAll.ts
import { v } from "convex/values";
import { mutation } from "../../_generated/server";

const BATCH_SIZE = 100;

export default mutation({
  args: {
    table: v.union(
      v.literal("etfs"),
      v.literal("assets"),
      v.literal("pools"),
      v.literal("ohlc"),
      v.literal("etf_token_transfers"),
      v.literal("affiliate_transfers"),
      v.literal("affiliates"),
      v.literal("watchlist"),
      v.literal("snapshots"),
      v.literal("sync_status")
    ),
  },
  handler: async (ctx, { table }) => {
    const docs = await ctx.db.query(table).take(BATCH_SIZE);

    if (docs.length > 0) {
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }

      return { clearedAll: false };
    } else {
      return { clearedAll: true };
    }
  },
});
