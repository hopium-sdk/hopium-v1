import { query } from "../../_generated/server";
import { v } from "convex/values";
import { normalizeAddress } from "../../../src/utils/normalizeAddress";

export default query({
  args: {
    owner: v.string(),
  },
  handler: async (ctx, args) => {
    const { owner } = args;

    const coupons = await ctx.db
      .query("affiliates")
      .withIndex("by_owner", (q) => q.eq("owner", normalizeAddress(owner)))
      .order("desc")
      .collect();

    return coupons;
  },
});
