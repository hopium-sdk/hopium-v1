// convex/fns/ohlc/getLatestLive.ts
import { query } from "../../_generated/server";
import { v } from "convex/values";
import { OHLC_TIMEFRAMES } from "../../schema/ohlc";

export default query({
  args: {
    etfId: v.number(),
    timeframe: v.union(...OHLC_TIMEFRAMES.map(v.literal)),
  },
  handler: async (ctx, { etfId, timeframe }) => {
    const rows = await ctx.db
      .query("ohlc")
      .withIndex("by_etfId_timeframe_bucketTimestamp", (q) => q.eq("etfId", etfId).eq("timeframe", timeframe))
      .order("desc")
      .take(1);

    return rows[0] ?? null;
  },
});
