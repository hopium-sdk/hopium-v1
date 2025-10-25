// convex/schema/snapshots.ts
import { v } from "convex/values";
import { defineTable } from "convex/server";

export const SnapshotSchema = {
  blockNumber: v.number(),
  table: v.union(
    v.literal("etfs"),
    v.literal("assets"),
    v.literal("pools"),
    v.literal("ohlc"),
    v.literal("etf_token_transfers"),
    v.literal("affiliate_transfers"),
    v.literal("affiliates"),
    v.literal("platform_fee_transfers")
  ),
  // Your global table-unique identifier, same field on every table
  docId: v.string(),

  // Did a row exist BEFORE this block’s first mutation?
  existed: v.boolean(),

  // Full previous image if existed === true; else null
  before: v.union(v.any(), v.null()),
};

export const snapshotsTable = defineTable(SnapshotSchema).index("by_block", ["blockNumber"]).index("by_block_table_docId", ["blockNumber", "table", "docId"]);

export type T_TableName = "etfs" | "assets" | "pools" | "ohlc" | "etf_token_transfers" | "affiliate_transfers" | "affiliates" | "platform_fee_transfers";
