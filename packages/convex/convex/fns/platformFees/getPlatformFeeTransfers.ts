import { query } from "../../_generated/server";
import { paginationOptsValidator } from "convex/server";

export default query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { paginationOpts } = args;

    const transfers = await ctx.db.query("platform_fee_transfers").order("desc").paginate(paginationOpts);

    const transfersWithEtf = await Promise.all(
      transfers.page.map(async (transfer) => {
        const etf = await ctx.db
          .query("etfs")
          .withIndex("by_etfId", (q) => q.eq("details.etfId", transfer.etfId))
          .first();
        return { ...transfer, etf };
      })
    );

    return {
      ...transfers,
      page: transfersWithEtf,
    };
  },
});
