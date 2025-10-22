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
  docId: v.string(),
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
    totalSupply: v.number(),
    price: ethUsd,
    volume: ethUsd,
    assetsLiquidityUsd: v.number(),
    assetsMcapUsd: v.number(),
  }),
  tags: v.array(v.string()),
};

export const etfsTable = defineTable(EtfSchema)
  .index("by_docId", ["docId"])
  .index("by_etfId", ["details.etfId"])
  .index("by_token_address", ["contracts.etfTokenAddress"])

  //sorting for etf list
  .index("by_createdAt", ["details.createdAt"])
  .index("by_assetsMcapUsd", ["stats.assetsMcapUsd"])
  .index("by_assetsLiquidityUsd", ["stats.assetsLiquidityUsd"])
  .index("by_assetsCount", ["details.assetsCount"])

  //sorting for etf list by tag
  .index("by_tags", ["tags", "stats.assetsMcapUsd"]);

export type C_Etf = Doc<"etfs">;
export type T_Etf = Omit<Doc<"etfs">, "_id" | "_creationTime">;

export type C_EtfWithAssetsAndPools = {
  etf: C_Etf;
  assets: C_Asset[];
  pools: C_Pool[];
};

export const EtfListOptions = ["most-cap", "most-liquidity", "recently-created", "most-tokens", "least-tokens"] as const;
export type T_EtfListOption = (typeof EtfListOptions)[number];
