import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { defineTable } from "convex/server";

const ethUsd = v.object({
  eth: v.number(),
  usd: v.number(),
});

export const EtfSchema = {
  details: v.object({
    etfId: v.number(),
    name: v.string(),
    ticker: v.string(),
    assets: v.array(
      v.object({
        tokenAddress: v.string(),
        targetWeightBips: v.number(),
        balance: v.number(),
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
  }),
  tags: v.array(v.string()),
  syncBlockNumber_: v.number(),
};

export const etfsTable = defineTable(EtfSchema)
  .index("by_etfId", ["details.etfId"])
  .index("by_syncBlockNumber", ["syncBlockNumber_"])
  .index("by_tags", ["tags"])
  .index("by_token_address", ["contracts.etfTokenAddress"]);

export type C_Etf = Doc<"etfs">;
export type T_Etf = Omit<Doc<"etfs">, "_id" | "_creationTime">;
