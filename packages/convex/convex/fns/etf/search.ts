// convex/etfs/search.ts
import { query } from "../../_generated/server";
import { v } from "convex/values";
import { isEthAddress, normalizeAddress } from "../../../src/utils/normalizeAddress";
import { C_Etf, C_EtfWithAssetsAndPools } from "../../schema/etf";
import { enrichEtfWithAssetsAndPools } from "./utils/encrichWithAssetsAndPools";

export default query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, { searchTerm }) => {
    let results: C_Etf[] = [];
    const term = searchTerm.trim();

    switch (term) {
      case "":
        results = await ctx.db.query("etfs").withIndex("by_assetsMcapUsd").order("desc").take(20);
        break;
      case isEthAddress(term):
        results = await ctx.db
          .query("etfs")
          .withIndex("by_token_address", (q) => q.eq("contracts.etfTokenAddress", normalizeAddress(term)))
          .collect();
        break;
      default: {
        const lowered = term.toLowerCase();
        const byCap = await ctx.db.query("etfs").withIndex("by_assetsMcapUsd").order("desc").collect();
        results = byCap.filter((etf) => {
          const name = etf.details.name?.toLowerCase() ?? "";
          const ticker = etf.details.ticker?.toLowerCase() ?? "";
          return name.includes(lowered) || ticker.includes(lowered);
        });
        break;
      }
    }

    const resultsWithAssetsAndPools: C_EtfWithAssetsAndPools[] = await Promise.all(
      results.map(async (etf) => {
        return await enrichEtfWithAssetsAndPools(ctx, etf);
      })
    );

    return resultsWithAssetsAndPools;
  },
});
