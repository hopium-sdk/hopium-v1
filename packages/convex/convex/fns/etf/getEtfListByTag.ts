import { v } from "convex/values";
import { query } from "../../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { enrichEtfWithAssetsAndPools } from "./utils/encrichWithAssetsAndPools";
import { C_EtfWithAssetsAndPools } from "../../schema/etf";

export default query({
  args: { paginationOpts: paginationOptsValidator, tag: v.string() },
  handler: async (ctx, args) => {
    const allEtfs = await ctx.db.query("etfs").collect();
    const etfs = allEtfs.filter((etf) => etf.tags.includes(args.tag));

    etfs.sort((a, b) => b.stats.assetsMcapUsd - a.stats.assetsMcapUsd);

    const enrichedEtfs: C_EtfWithAssetsAndPools[] = await Promise.all(etfs.map(async (etf) => enrichEtfWithAssetsAndPools(ctx, etf)));

    return {
      page: enrichedEtfs,
      isDone: true,
      continueCursor: null,
    };
  },
});
