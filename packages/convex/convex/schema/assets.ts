import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { defineTable } from "convex/server";

export const AssetSchema = {
  docId: v.string(),
  address: v.string(),
  name: v.string(),
  symbol: v.string(),
  decimals: v.number(),
  tv_ticker: v.string(),
  poolAddress: v.optional(v.string()),
};

export const assetsTable = defineTable(AssetSchema).index("by_docId", ["docId"]).index("by_address", ["address"]);

export type C_Asset = Doc<"assets">;
export type T_Asset = Omit<Doc<"assets">, "_id" | "_creationTime">;
