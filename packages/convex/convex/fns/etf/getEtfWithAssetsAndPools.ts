import { query } from "../../_generated/server";
import { v } from "convex/values";
import { C_Etf, C_EtfWithAssetsAndPools } from "../../schema/etf";
import { enrichEtfWithAssetsAndPools } from "./utils/encrichWithAssetsAndPools";

export default query({
  args: {
    etfId: v.number(),
  },
  handler: async (ctx, args) => {
    const etf: C_Etf | null = await ctx.db
      .query("etfs")
      .withIndex("by_etfId", (q) => q.eq("details.etfId", args.etfId))
      .first();

    if (!etf) return null;

    const etfWithAssetsAndPools: C_EtfWithAssetsAndPools = await enrichEtfWithAssetsAndPools(ctx, etf);

    return etfWithAssetsAndPools;
  },
});
