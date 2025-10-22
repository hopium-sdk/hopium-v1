// convex/etfs/search.ts
import { query } from "../../_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { isEthAddress, normalizeAddress } from "../../../src/utils/normalizeAddress";
import { C_Etf, C_EtfWithAssetsAndPools } from "../../schema/etf";
import { enrichEtfWithAssetsAndPools } from "./utils/encrichWithAssetsAndPools";

export default query({
  args: {
    searchTerm: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { searchTerm } = args;

    let results: C_Etf[] = [];
    const term = searchTerm.trim();

    if (term === "") {
      results = [];
    } else if (isEthAddress(term)) {
      results = await ctx.db
        .query("etfs")
        .withIndex("by_token_address", (q) => q.eq("contracts.etfTokenAddress", normalizeAddress(term)))
        .collect();
    } else {
      const lowered = term.toLowerCase();
      const byCap = await ctx.db.query("etfs").withIndex("by_assetsMcapUsd").order("desc").collect();
      results = byCap.filter((etf) => {
        const name = etf.details.name?.toLowerCase() ?? "";
        const ticker = etf.details.ticker?.toLowerCase() ?? "";
        return name.includes(lowered) || ticker.includes(lowered);
      });
    }

    const resultsWithAssetsAndPools: C_EtfWithAssetsAndPools[] = await Promise.all(
      results.map(async (etf) => {
        return await enrichEtfWithAssetsAndPools(ctx, etf);
      })
    );

    return {
      page: resultsWithAssetsAndPools,
      isDone: true,
      continueCursor: null,
    };
  },
});
