import { query } from "../../_generated/server";

export default query({
  args: {},
  handler: async (ctx) => {
    const syncStatus = await ctx.db.query("sync_status").first();

    if (!syncStatus) {
      return {
        statusId: 0,
        lastBlockNumber: 0,
      };
    }

    return syncStatus;
  },
});
