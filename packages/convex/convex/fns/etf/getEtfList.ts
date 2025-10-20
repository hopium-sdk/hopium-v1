// convex/etfs/list.ts
import { paginationOptsValidator } from "convex/server";
import { query } from "../../_generated/server";
import { v } from "convex/values";
import { enrichEtfWithAssetsAndPools } from "./utils/encrichWithAssetsAndPools";
import { C_EtfWithAssetsAndPools, EtfListOptions } from "../../schema/etf";

export default query({
  args: {
    paginationOpts: paginationOptsValidator,
    sortBy: v.union(...EtfListOptions.map(v.literal)),
  },
  handler: async (ctx, args) => {
    const baseQuery = ctx.db.query("etfs");

    let cursor;
    switch (args.sortBy) {
      case "recently-created":
        cursor = baseQuery.withIndex("by_createdAt").order("desc").paginate(args.paginationOpts);
        break;
      case "most-cap":
        cursor = baseQuery.withIndex("by_assetsMcapUsd").order("desc").paginate(args.paginationOpts);
        break;
      case "most-liquidity":
        cursor = baseQuery.withIndex("by_assetsLiquidityUsd").order("desc").paginate(args.paginationOpts);
        break;
      case "most-tokens":
        cursor = baseQuery.withIndex("by_assetsCount").order("desc").paginate(args.paginationOpts);
        break;
      case "least-tokens":
        cursor = baseQuery.withIndex("by_assetsCount").order("asc").paginate(args.paginationOpts);
        break;
    }

    const { page, isDone, continueCursor } = await cursor;

    // Enrich each ETF in the page
    const enrichedPage: C_EtfWithAssetsAndPools[] = await Promise.all(page.map((etf) => enrichEtfWithAssetsAndPools(ctx, etf)));

    // Keep the same pagination envelope, but swap page docs with enriched objects
    return {
      page: enrichedPage,
      isDone,
      continueCursor,
    };
  },
});
