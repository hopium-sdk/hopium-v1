import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { defineTable } from "convex/server";

const ethUsd = v.object({
  eth: v.number(),
  usd: v.number(),
});

export const PoolSchema = {
  address: v.string(),
  isV3Pool: v.boolean(),
  details: v.object({
    token0: v.string(),
    token1: v.string(),
    decimals0: v.number(),
    decimals1: v.number(),
  }),
  stats: v.object({
    price: ethUsd,
    volumeUsd: v.number(),
    liquidityUsd: v.number(),
    mcapUsd: v.number(),
  }),
  syncBlockNumber_: v.number(),
};

export const poolsTable = defineTable(PoolSchema)
  .index("by_address", ["address"])
  .index("by_syncBlockNumber", ["syncBlockNumber_"])
  .index("by_tokens", ["details.token0", "details.token1"]);

export type C_Pool = Doc<"pools">;
export type T_Pool = Omit<Doc<"pools">, "_id" | "_creationTime">;
