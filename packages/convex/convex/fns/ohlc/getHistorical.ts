import { getBucketTimestamp, normalizeTs } from "../../../src/utils/ohlc";
import { query } from "../../_generated/server";
import { v } from "convex/values";
import { OHLC_TIMEFRAMES } from "../../schema/ohlc";

export default query({
  args: {
    etfId: v.number(),
    timeframe: v.union(...OHLC_TIMEFRAMES.map(v.literal)),
    latestTimestamp: v.number(), // ms or seconds (we'll normalize)
    countBack: v.number(),
  },
  handler: async (ctx, args) => {
    const { etfId, timeframe, latestTimestamp, countBack } = args;

    const normalizedLatest = normalizeTs(latestTimestamp);
    // Align the cursor to the start of its bucket
    const cursorBucketTs = getBucketTimestamp(normalizedLatest, timeframe);

    // If you want the bar that includes fromTimestamp to be included, use lte.
    // If you want strictly before that bar, use lt instead.
    const rows = await ctx.db
      .query("ohlc")
      .withIndex(
        "by_etfId_timeframe_bucketTimestamp",
        (q) => q.eq("etfId", etfId).eq("timeframe", timeframe).lte("bucketTimestamp", cursorBucketTs) // or .lt(...)
      )
      .order("desc")
      .take(countBack);

    return rows.reverse();
  },
});
