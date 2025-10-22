import { query } from "../../_generated/server";
import { v } from "convex/values";
import { C_EtfTokenTransfer } from "../../schema/etfTokenTranfers";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export default query({
  args: {
    userAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const { userAddress } = args;

    // Fetch all transfers for this user (by from/to)
    const outgoing: C_EtfTokenTransfer[] = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_from", (q) => q.eq("fromAddress", userAddress))
      .collect();

    const incoming: C_EtfTokenTransfer[] = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_to", (q) => q.eq("toAddress", userAddress))
      .collect();

    // Filter for mints (from zero address) and burns (to zero address)
    const mintAndBurnTransfers = [...outgoing, ...incoming].filter((transfer) => {
      const isMint = transfer.fromAddress === ZERO_ADDRESS;
      const isBurn = transfer.toAddress === ZERO_ADDRESS;
      return isMint || isBurn;
    });

    // Calculate total volume in USD
    let totalVolumeUsd = 0;

    for (const transfer of mintAndBurnTransfers) {
      const amount = transfer.transferAmount || 0;
      const usdPrice = transfer.etfPrice?.usd || 0;

      // Volume = amount * price
      totalVolumeUsd += amount * usdPrice;
    }

    return totalVolumeUsd;
  },
});
