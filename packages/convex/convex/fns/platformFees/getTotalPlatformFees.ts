import { query } from "../../_generated/server";

export default query({
  args: {},
  handler: async (ctx) => {
    const allTransfers = await ctx.db.query("platform_fee_transfers").collect();

    return {
      eth: allTransfers.reduce((acc, transfer) => acc + transfer.amount.eth, 0),
      usd: allTransfers.reduce((acc, transfer) => acc + transfer.amount.usd, 0),
    };
  },
});
