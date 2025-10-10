import { mutation } from "../../_generated/server";
import { v } from "convex/values";

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

    const unsafeEtf = await ctx.db
      .query("etfs")
      .withIndex("by_syncBlockNumber", (q) => q.gt("syncBlockNumber_", safeBlockNumber))
      .collect();

    const unsafeHoldingTokens = await ctx.db
      .query("holding_tokens")
      .withIndex("by_syncBlockNumber", (q) => q.gt("syncBlockNumber_", safeBlockNumber))
      .collect();

    //delete all unsafe etf token transfers
    for (const etfTokenTransfer of unsafeEtfTokenTransfers) {
      await ctx.db.delete(etfTokenTransfer._id);
    }

    //delete all unsafe etfs
    for (const etf of unsafeEtf) {
      await ctx.db.delete(etf._id);
    }

    //delete all unsafe holding tokens
    for (const holdingToken of unsafeHoldingTokens) {
      await ctx.db.delete(holdingToken._id);
    }
  },
});
