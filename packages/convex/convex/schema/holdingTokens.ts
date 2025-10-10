import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { defineTable } from "convex/server";

export const HoldingTokensSchema = {
  address: v.string(),
  name: v.string(),
  symbol: v.string(),
  decimals: v.number(),
  tv_ticker: v.string(),
  syncBlockNumber_: v.number(),
};

export const holdingTokensTable = defineTable(HoldingTokensSchema).index("by_address", ["address"]).index("by_syncBlockNumber", ["syncBlockNumber_"]);

export type C_HoldingToken = Doc<"holding_tokens">;
export type T_HoldingToken = Omit<Doc<"holding_tokens">, "_id" | "_creationTime">;
