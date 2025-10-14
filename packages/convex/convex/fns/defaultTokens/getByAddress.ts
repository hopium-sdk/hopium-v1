import { query } from "../../_generated/server";
import { v } from "convex/values";
import { normalizeAddress } from "../../../src/utils/normalizeAddress";

export default query({
  args: {
    address: v.string(),
  },
  handler: async (ctx, args) => {
    const token = await ctx.db
      .query("default_tokens")
      .withIndex("by_address", (q) => q.eq("address", normalizeAddress(args.address)))
      .first();

    return token;
  },
});
