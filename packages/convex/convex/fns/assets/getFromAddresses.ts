import { query } from "../../_generated/server";
import { v } from "convex/values";
import { normalizeAddress } from "../../../src/utils/normalizeAddress";

export default query({
  args: {
    addresses: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const allAssets = await Promise.all(
      args.addresses.map(async (address) => {
        const asset = await ctx.db
          .query("assets")
          .withIndex("by_address", (q) => q.eq("address", normalizeAddress(address)))
          .first();

        return asset;
      })
    );

    return allAssets.filter((asset) => asset !== null);
  },
});
