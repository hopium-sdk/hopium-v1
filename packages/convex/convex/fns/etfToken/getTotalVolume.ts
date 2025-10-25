import { query } from "../../_generated/server";
import { C_EtfTokenTransfer } from "../../schema/etfTokenTranfers";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export default query({
  args: {},
  handler: async (ctx) => {
    // Fetch mints (from zero address) using by_etf_from index
    const mints: C_EtfTokenTransfer[] = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_from", (q) => q.eq("fromAddress", ZERO_ADDRESS))
      .collect();

    // Fetch burns (to zero address) using by_etf_to index
    const burns: C_EtfTokenTransfer[] = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_to", (q) => q.eq("toAddress", ZERO_ADDRESS))
      .collect();

    // Combine mints and burns
    const mintAndBurnTransfers = [...mints, ...burns];

    // Calculate volume in ETH and USD
    let totalVolumeEth = 0;
    let totalVolumeUsd = 0;

    for (const transfer of mintAndBurnTransfers) {
      const amount = transfer.transferAmount || 0;
      const ethPrice = transfer.etfPrice?.eth || 0;
      const usdPrice = transfer.etfPrice?.usd || 0;

      // Volume = amount * price
      totalVolumeEth += amount * ethPrice;
      totalVolumeUsd += amount * usdPrice;
    }

    return {
      eth: totalVolumeEth,
      usd: totalVolumeUsd,
    };
  },
});
