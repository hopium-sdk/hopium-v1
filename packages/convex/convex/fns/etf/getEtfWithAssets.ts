import { query } from "../../_generated/server";
import { v } from "convex/values";
import { C_Asset } from "../../schema/assets";
import { C_Etf } from "../../schema/etf";

export type T_EtfWithAssets = {
  etf: C_Etf;
  assets: C_Asset[];
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

    return { etf, assets: allAssets };
  },
});
