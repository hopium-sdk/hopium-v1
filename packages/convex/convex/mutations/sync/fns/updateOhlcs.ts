import { MutationCtx } from "../../../_generated/server";
import { OHLC_TIMEFRAMES, T_Ohlc } from "../../../schema/ohlc";
import { getBucketTimestamp, normalizeTs } from "../../../../src/utils/ohlc";

export type T_OhlcUpdates = {
  etfId: number;
  timestamp: number; // ms or seconds (we'll normalize)
  price: number;
  volume?: number;
  syncBlockNumber_: number;
};

export const _updateOhlcs = async (ctx: MutationCtx, ohlcUpdates: T_OhlcUpdates[]) => {
  // ---------- READS ----------
  // For each (update × timeframe) read current bucket & the previous existing ohlc (strictly earlier).
  const readPromises = ohlcUpdates.flatMap((u) => {
    const normalizedTs = normalizeTs(u.timestamp);
    const { etfId, price, syncBlockNumber_ } = u;
    const volume = u.volume ?? 0;

    return OHLC_TIMEFRAMES.map(async (timeframe) => {
      const bucketTimestamp = getBucketTimestamp(normalizedTs, timeframe);

      const [existing, prev] = await Promise.all([
        // Exact current bucket
        ctx.db
          .query("ohlc")
          .withIndex("by_etfId_timeframe_bucketTimestamp", (q) => q.eq("etfId", etfId).eq("timeframe", timeframe).eq("bucketTimestamp", bucketTimestamp))
          .first(),
        // Previous ohlc (any earlier bucket) — pick the closest earlier by sorting desc
        ctx.db
          .query("ohlc")
          .withIndex("by_etfId_timeframe_bucketTimestamp", (q) => q.eq("etfId", etfId).eq("timeframe", timeframe).lt("bucketTimestamp", bucketTimestamp))
          .order("desc")
          .first(),
      ]);

      return {
        etfId,
        timeframe,
        bucketTimestamp,
        tickTime: normalizedTs, // normalized, used for correct 'close' ordering
        price,
        volume,
        existing,
        prevClose: prev?.close ?? null,
        syncBlockNumber_: syncBlockNumber_,
      };
    });
  });

  const readResults = await Promise.all(readPromises);

  // ---------- GROUP per bucket to avoid duplicate inserts/patches ----------
  type Row = (typeof readResults)[number];
  const byBucket = new Map<string, Row[]>();
  for (const row of readResults) {
    const key = `${row.etfId}|${row.timeframe}|${row.bucketTimestamp}`;
    const arr = byBucket.get(key);
    if (arr) arr.push(row);
    else byBucket.set(key, [row]);
  }

  // ---------- WRITES (one per bucket) ----------
  const writePromises: Promise<any>[] = [];

  for (const rows of byBucket.values()) {
    // All rows share same bucket identity
    const { etfId, timeframe, bucketTimestamp, syncBlockNumber_ } = rows[0];

    // Aggregate the ticks in this bucket
    const sorted = rows.slice().sort((a, b) => a.tickTime - b.tickTime);
    const high = Math.max(...sorted.map((r) => r.price));
    const low = Math.min(...sorted.map((r) => r.price));
    const close = sorted[sorted.length - 1]!.price;
    const volumeSum = sorted.reduce((s, r) => s + (r.volume ?? 0), 0);

    // choose an existing (if any) and prevClose (they should be same across rows)
    const existing = rows.find((r) => !!r.existing)?.existing ?? null;
    const prevClose = rows.find((r) => r.prevClose != null)?.prevClose ?? null;

    if (!existing) {
      // open is prev close if available, otherwise first observed price in this bucket
      const firstPrice = sorted[0]!.price;
      const open = prevClose ?? firstPrice;

      const ohlc: T_Ohlc = {
        etfId,
        timeframe,
        bucketTimestamp,
        open,
        high,
        low,
        close,
        volume: volumeSum,
        syncBlockNumber_,
      };
      writePromises.push(ctx.db.insert("ohlc", ohlc));
    } else {
      writePromises.push(
        ctx.db.patch(existing._id, {
          high: Math.max(existing.high, high),
          low: Math.min(existing.low, low),
          close, // last observed
          volume: (existing.volume ?? 0) + volumeSum,
        })
      );
    }
  }

  await Promise.all(writePromises);
};
