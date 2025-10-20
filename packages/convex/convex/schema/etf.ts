import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { defineTable } from "convex/server";
import { C_Asset } from "./assets";
import { C_Pool } from "./pools";

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
    assetsCount: v.number(),
    createdAt: v.number(),
  }),
  contracts: v.object({
    etfTokenAddress: v.string(),
    etfVaultAddress: v.string(),
  }),
  stats: v.object({
    price: ethUsd,
    volume: ethUsd,
    assetsLiquidityUsd: v.number(),
    assetsMcapUsd: v.number(),
  }),
  tags: v.array(v.string()),
  syncBlockNumber_: v.number(),
};

export const etfsTable = defineTable(EtfSchema)
  .index("by_etfId", ["details.etfId"])
  .index("by_syncBlockNumber", ["syncBlockNumber_"])
  .index("by_tags", ["tags"])
  .index("by_token_address", ["contracts.etfTokenAddress"])

  //sorting for etf list
  .index("by_createdAt", ["details.createdAt"])
  .index("by_assetsMcapUsd", ["stats.assetsMcapUsd"])
  .index("by_assetsLiquidityUsd", ["stats.assetsLiquidityUsd"])
  .index("by_assetsCount", ["details.assetsCount"]);

export type C_Etf = Doc<"etfs">;
export type T_Etf = Omit<Doc<"etfs">, "_id" | "_creationTime">;

export type C_EtfWithAssetsAndPools = {
  etf: C_Etf;
  assets: C_Asset[];
  pools: C_Pool[];
};

export const EtfListOptions = ["most-cap", "most-liquidity", "recently-created", "most-tokens", "least-tokens"] as const;
export type T_EtfListOption = (typeof EtfListOptions)[number];
