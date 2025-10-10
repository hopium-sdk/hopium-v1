import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { defineTable } from "convex/server";

export const DefaultTokenSchema = {
  chainId: v.number(),
  address: v.string(),
  name: v.string(),
  symbol: v.string(),
  decimals: v.number(),
  imageUrl: v.union(v.string(), v.null()),
};

export const defaultTokensTable = defineTable(DefaultTokenSchema).index("by_address", ["address"]);

export type C_DefaultToken = Doc<"default_tokens">;
export type T_DefaultToken = Omit<Doc<"default_tokens">, "_id" | "_creationTime">;
