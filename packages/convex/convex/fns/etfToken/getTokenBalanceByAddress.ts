import { normalizeAddress } from "../../../src/utils/normalizeAddress";
import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
  args: {
    tokenAddress: v.string(),
    userAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const token = normalizeAddress(args.tokenAddress);
    const user = normalizeAddress(args.userAddress);

    // Outgoing: token + from (index-backed)
    const outgoing = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_token_from", (q) => q.eq("etfTokenAddress", token).eq("fromAddress", user))
      .collect();

    // Incoming: token + to (index-backed)
    const incoming = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_token_to", (q) => q.eq("etfTokenAddress", token).eq("toAddress", user))
      .collect();

    const sum = (xs: { transferAmount?: number }[]) => xs.reduce((s, t) => s + (t.transferAmount ?? 0), 0);

    const totalOut = sum(outgoing);
    const totalIn = sum(incoming);
    const balance = totalIn - totalOut;

    return balance;
  },
});
