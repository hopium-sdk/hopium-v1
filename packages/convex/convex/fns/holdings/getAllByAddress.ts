import { query } from "../../_generated/server";
import { v } from "convex/values";
import { getAllHoldingsOfAddress } from "../../../src/fns/holdings/getAllHoldingsOfAddress";
import { normalizeAddress } from "../../../src/utils/normalizeAddress";

export default query({
  args: {
    address: v.string(),
  },
  handler: async (ctx, args) => {
    const allFromTransfers = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_fromAddress", (q) => q.eq("fromAddress", normalizeAddress(args.address)))
      .collect();

    const allToTransfers = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_toAddress", (q) => q.eq("toAddress", normalizeAddress(args.address)))
      .collect();

    const allTransfers = [...allFromTransfers, ...allToTransfers];

    const allHoldings = getAllHoldingsOfAddress({ allTransfers, address: args.address });

    return allHoldings;
  },
});
