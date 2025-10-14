import { normalizeAddress } from "../../../src/utils/normalizeAddress";
import { query } from "../../_generated/server";
import { v } from "convex/values";
import { getAllHoldersByTokenAddress } from "../../../src/fns/holders/getAllHoldersByTokenAddress";

export default query({
  args: {
    tokenAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const allTransfers = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_etfTokenAddress", (q) => q.eq("etfTokenAddress", normalizeAddress(args.tokenAddress)))
      .collect();

    const holders = getAllHoldersByTokenAddress({ allTransfers, tokenAddress: args.tokenAddress });

    return holders;
  },
});
