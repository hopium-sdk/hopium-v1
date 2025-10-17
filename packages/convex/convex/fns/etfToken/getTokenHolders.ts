import { normalizeAddress } from "../../../src/utils/normalizeAddress";
import { query } from "../../_generated/server";
import { v } from "convex/values";

export type T_EtfTokenHolder = {
  userAddress: string;
  balance: number;
};

export default query({
  args: {
    tokenAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const token = normalizeAddress(args.tokenAddress);

    // Fetch all transfers where token is involved — both incoming and outgoing
    const outgoingTransfers = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_token_from", (q) => q.eq("etfTokenAddress", token))
      .collect();

    const incomingTransfers = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_token_to", (q) => q.eq("etfTokenAddress", token))
      .collect();

    // Accumulate balances per user
    const balances = new Map<string, number>();

    for (const t of incomingTransfers) {
      const to = t.toAddress;
      const amount = t.transferAmount ?? 0;
      balances.set(to, (balances.get(to) ?? 0) + amount);
    }

    for (const t of outgoingTransfers) {
      const from = t.fromAddress;
      const amount = t.transferAmount ?? 0;
      balances.set(from, (balances.get(from) ?? 0) - amount);
    }

    // Build list of holders with nonzero balances
    const holders: T_EtfTokenHolder[] = [];
    for (const [userAddress, balance] of balances.entries()) {
      if (balance > 0) {
        holders.push({ userAddress, balance });
      }
    }

    // Sort by balance descending (optional, for analytics / leaderboard)
    holders.sort((a, b) => b.balance - a.balance);

    return holders;
  },
});
