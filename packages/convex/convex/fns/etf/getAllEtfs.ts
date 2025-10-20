import { query } from "../../_generated/server";

export default query({
  args: {},
  handler: async (ctx) => {
    const etfs = await ctx.db.query("etfs").collect();
    return etfs;
  },
});
