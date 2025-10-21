import { normalizeAddress } from "../../../src/utils/normalizeAddress";
import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
  args: {
    etfId: v.number(),
    userAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const { etfId, userAddress } = args;
    const user = normalizeAddress(userAddress);

    // 2) Fetch transfers by (etfId, from) and (etfId, to)
    const outgoing = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_etf_from", (q) => q.eq("etfId", etfId).eq("fromAddress", user))
      .collect();

    const incoming = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_etf_to", (q) => q.eq("etfId", etfId).eq("toAddress", user))
      .collect();

    // 3) Balance = sum(in) - sum(out)
    const sum = (xs: { transferAmount?: number }[]) => xs.reduce((s, t) => s + (t.transferAmount ?? 0), 0);

    const totalOut = sum(outgoing);
    const totalIn = sum(incoming);

    return totalIn - totalOut;
  },
});
