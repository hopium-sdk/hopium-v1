import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { defineTable } from "convex/server";

const ethUsd = v.object({
  eth: v.number(),
  usd: v.number(),
});

export const EtfSchema = {
  index: v.object({
    indexId: v.string(),
    name: v.string(),
    ticker: v.string(),
    holdings: v.array(
      v.object({
        tokenAddress: v.string(),
        weightBips: v.number(),
      })
    ),
    createdAt: v.number(),
  }),
  contracts: v.object({
    etfTokenAddress: v.string(),
    etfVaultAddress: v.string(),
  }),
  stats: v.object({
    price: ethUsd,
    assets_liquidity_usd: v.number(),
    assets_mcap_usd: v.number(),
  }),
  tags: v.array(v.string()),
  syncBlockNumber_: v.number(),
};

export const etfsTable = defineTable(EtfSchema)
  .index("by_indexId", ["index.indexId"])
  .index("by_syncBlockNumber", ["syncBlockNumber_"])
  .index("by_tags", ["tags"]);

export type C_Etf = Doc<"etfs">;
export type T_Etf = Omit<Doc<"etfs">, "_id" | "_creationTime">;
