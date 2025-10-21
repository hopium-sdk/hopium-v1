import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { defineTable } from "convex/server";

export const OHLC_TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h", "1d", "1w", "1M"] as const;
export type T_OhlcTimeframe = (typeof OHLC_TIMEFRAMES)[number];

const ohlcTimeframeSchema = v.union(...OHLC_TIMEFRAMES.map(v.literal));

export const OhlcSchema = {
  docId: v.string(),
  etfId: v.number(),
  timeframe: ohlcTimeframeSchema,
  bucketTimestamp: v.number(),
  open: v.number(),
  high: v.number(),
  low: v.number(),
  close: v.number(),
  volume: v.number(),
};

export const ohlcTable = defineTable(OhlcSchema)
  .index("by_docId", ["docId"])
  .index("by_etfId_timeframe_bucketTimestamp", ["etfId", "timeframe", "bucketTimestamp"]);

export type C_Ohlc = Doc<"ohlc">;
export type T_Ohlc = Omit<Doc<"ohlc">, "_id" | "_creationTime">;
