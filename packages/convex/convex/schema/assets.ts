import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { defineTable } from "convex/server";

export const AssetSchema = {
  address: v.string(),
  name: v.string(),
  symbol: v.string(),
  decimals: v.number(),
  tv_ticker: v.string(),
  syncBlockNumber_: v.number(),
};

export const assetsTable = defineTable(AssetSchema).index("by_address", ["address"]).index("by_syncBlockNumber", ["syncBlockNumber_"]);

export type C_Asset = Doc<"assets">;
export type T_Asset = Omit<Doc<"assets">, "_id" | "_creationTime">;
