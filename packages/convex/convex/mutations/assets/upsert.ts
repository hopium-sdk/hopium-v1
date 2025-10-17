import { C_Asset, AssetSchema } from "../../schema/assets";
import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { normalizeAddress } from "../../../src/utils/normalizeAddress";
import assert from "assert";

export default mutation({
  args: {
    assets: v.array(v.object(AssetSchema)),
  },
  handler: async (ctx, args) => {
    const { assets } = args;

    const normalizedAssets = assets.map((asset) => ({
      ...asset,
      address: normalizeAddress(asset.address),
    }));

    const found = (
      await Promise.all(
        normalizedAssets.map(async (asset) => {
          return await ctx.db
            .query("assets")
            .withIndex("by_address", (q) => q.eq("address", asset.address))
            .first();
        })
      )
    ).filter((asset) => asset !== null) as C_Asset[];

    const not_found = normalizedAssets.filter((asset) => !found.find((c: C_Asset) => c.address === asset.address));

    if (not_found.length > 0) {
      for (const asset of not_found) {
        await ctx.db.insert("assets", asset);
      }
    }

    if (found.length > 0) {
      for (const asset of found) {
        const new_asset = normalizedAssets.find((c) => c.address === asset.address);

        assert(new_asset, `Asset ${asset.address} not found`);

        await ctx.db.patch(asset._id, { ...new_asset });
      }
    }
  },
});
