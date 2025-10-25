import { MutationCtx } from "../../../_generated/server";
import { OHLC_TIMEFRAMES, T_Ohlc } from "../../../schema/ohlc";
import { getBucketTimestamp, normalizeTs } from "../../../../src/utils/ohlc";
import { snapshot } from "../helpers/snapshot";

export type T_OhlcUpdates = {
  etfId: number;
  timestamp: number; // ms or seconds
  price: number;
  volume?: number;
};

/**
 * Requirements:
 * - ohlc has .index("by_docId", ["docId"])
 * - (kept) .index("by_etfId_timeframe_bucketTimestamp", ["etfId","timeframe","bucketTimestamp"])
 */
export const _updateOhlcs = async (ctx: MutationCtx, ohlcUpdates: T_OhlcUpdates[], blockNumber: number) => {
  // ----- aggregate ticks into buckets -----
  type Key = string; // `${etfId}:${timeframe}:${bucketTimestamp}`
  type Agg = {
    etfId: number;
    timeframe: (typeof OHLC_TIMEFRAMES)[number];
    bucketTimestamp: number;
    firstTs: number;
    firstPrice: number;
    high: number;
    low: number;
    closeTs: number;
    closePrice: number;
    volumeSum: number;
  };

  const buckets = new Map<Key, Agg>();

  for (const u of ohlcUpdates) {
    const ts = normalizeTs(u.timestamp);
    const volume = u.volume ?? 0;

    // 🛡️ Skip non-positive prices entirely
    if (!(u.price > 0)) continue;

    for (const timeframe of OHLC_TIMEFRAMES) {
      const bucketTimestamp = getBucketTimestamp(ts, timeframe);
      const key = `${u.etfId}:${timeframe}:${bucketTimestamp}`;
      const prev = buckets.get(key);
      if (!prev) {
        buckets.set(key, {
          etfId: u.etfId,
          timeframe,
          bucketTimestamp,
          firstTs: ts,
          firstPrice: u.price,
          high: u.price,
          low: u.price,
          closeTs: ts,
          closePrice: u.price,
          volumeSum: volume,
        });
      } else {
        if (ts < prev.firstTs) {
          prev.firstTs = ts;
          prev.firstPrice = u.price;
        }
        if (u.price > prev.high) prev.high = u.price;
        if (u.price < prev.low) prev.low = u.price;
        if (ts >= prev.closeTs) {
          prev.closeTs = ts;
          prev.closePrice = u.price;
        }
        prev.volumeSum += volume;
      }
    }
  }

  // ----- group by (etfId,timeframe) and process buckets in ascending time -----
  type GroupKey = string; // `${etfId}:${timeframe}`
  const groups = new Map<GroupKey, Agg[]>();
  for (const agg of buckets.values()) {
    const gk = `${agg.etfId}:${agg.timeframe}`;
    const arr = groups.get(gk);
    if (arr) arr.push(agg);
    else groups.set(gk, [agg]);
  }

  for (const group of groups.values()) {
    group.sort((a, b) => a.bucketTimestamp - b.bucketTimestamp);
  }

  // For each group, seed prevClose from DB (closest earlier bucket), then write each bucket
  for (const aggs of groups.values()) {
    const { etfId, timeframe } = aggs[0]!;

    // seed prevClose from DB
    const firstBucketTs = aggs[0]!.bucketTimestamp;
    const prevRow = await ctx.db
      .query("ohlc")
      .withIndex("by_etfId_timeframe_bucketTimestamp", (q) => q.eq("etfId", etfId).eq("timeframe", timeframe).lt("bucketTimestamp", firstBucketTs))
      .order("desc")
      .first();
    let prevClose: number | null = prevRow?.close ?? null;

    // now apply each bucket in order
    for (const agg of aggs) {
      const { bucketTimestamp, firstPrice, high, low, closePrice, volumeSum } = agg;
      const docId = `${etfId}:${timeframe}:${bucketTimestamp}`;

      const existing = await ctx.db
        .query("ohlc")
        .withIndex("by_docId", (q) => q.eq("docId", docId))
        .first();

      // snapshot before mutation (idempotent per (block, table, docId))
      await snapshot(ctx, {
        blockNumber,
        table: "ohlc",
        docId,
        existed: !!existing,
        before: existing ?? null,
      });

      if (!existing) {
        // open = previous bucket's close if available, else first tick's price
        const open = prevClose ?? firstPrice;

        const row: T_Ohlc = {
          docId,
          etfId,
          timeframe,
          bucketTimestamp,
          open,
          high,
          low,
          close: closePrice,
          volume: volumeSum,
        };
        await ctx.db.insert("ohlc", row);

        // advance prevClose to this bucket's close
        prevClose = closePrice;
      } else {
        // keep existing.open; update high/low/close/volume
        const nextHigh = Math.max(existing.high, high);
        const nextLow = Math.min(existing.low, low);
        const nextClose = closePrice;
        const nextVolume = (existing.volume ?? 0) + volumeSum;

        await ctx.db.patch(existing._id, {
          high: nextHigh,
          low: nextLow,
          close: nextClose,
          volume: nextVolume,
        });

        // advance prevClose to the (patched) close
        prevClose = nextClose;
      }
    }
  }
};
