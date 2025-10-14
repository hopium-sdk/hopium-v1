import { query } from "../../_generated/server";
import { v } from "convex/values";
import { normalizeAddress } from "../../../src/utils/normalizeAddress";

export default query({
  args: {
    addresses: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const allTokens = await Promise.all(
      args.addresses.map(async (address) => {
        const token = await ctx.db
          .query("holding_tokens")
          .withIndex("by_address", (q) => q.eq("address", normalizeAddress(address)))
          .first();

        return token;
      })
    );

    return allTokens.filter((token) => token !== null);
  },
});
