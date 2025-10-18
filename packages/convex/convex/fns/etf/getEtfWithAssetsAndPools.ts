import { query } from "../../_generated/server";
import { v } from "convex/values";
import { C_Asset } from "../../schema/assets";
import { C_Etf } from "../../schema/etf";
import { C_Pool } from "../../schema/pools";
import { normalizeAddress } from "@repo/common/utils/address";

export type T_EtfWithAssetsAndPools = {
  etf: C_Etf;
  assets: C_Asset[];
  pools: C_Pool[];
};

export default query({
  args: {
    etfId: v.number(),
  },
  handler: async (ctx, args) => {
    const etf: C_Etf | null = await ctx.db
      .query("etfs")
      .withIndex("by_etfId", (q) => q.eq("details.etfId", args.etfId))
      .first();

    if (!etf) return null;

    const assets = etf?.details.assets;

    const allAssets: C_Asset[] = (
      await Promise.all(
        assets?.map(async (asset) => {
          const assetData = await ctx.db
            .query("assets")
            .withIndex("by_address", (q) => q.eq("address", asset.tokenAddress))
            .first();

          if (!assetData) return null;

          return assetData;
        })
      )
    ).filter((assetData) => assetData !== null);

    const allPools: C_Pool[] = (
      await Promise.all(
        allAssets.map(async (asset) => {
          if (!asset.poolAddress) return null;

          const pool = await ctx.db
            .query("pools")
            .withIndex("by_address", (q) => q.eq("address", normalizeAddress(asset.poolAddress ?? "")))
            .first();
          if (!pool) return null;

          return pool;
        })
      )
    ).filter((pool) => pool !== null);

    return { etf, assets: allAssets, pools: allPools };
  },
});
