import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import assert from "assert";
import { normalizeAddress } from "../../../src/utils/normalizeAddress";
import { EtfSchema, C_Etf } from "../../schema/etf";

export default mutation({
  args: {
    etfs: v.array(v.object(EtfSchema)),
  },
  handler: async (ctx, args) => {
    const { etfs } = args;

    const normalizedEtfs = etfs.map((etf) => ({
      ...etf,
      index: {
        ...etf.index,
        holdings: etf.index.holdings.map((holding) => ({
          ...holding,
          tokenAddress: normalizeAddress(holding.tokenAddress),
        })),
      },
      contracts: {
        etfTokenAddress: normalizeAddress(etf.contracts.etfTokenAddress),
        etfVaultAddress: normalizeAddress(etf.contracts.etfVaultAddress),
      },
    }));

    const found = (
      await Promise.all(
        normalizedEtfs.map(async (etf) => {
          return await ctx.db
            .query("etfs")
            .withIndex("by_indexId", (q) => q.eq("index.indexId", etf.index.indexId))
            .first();
        })
      )
    ).filter((etf) => etf !== null) as C_Etf[];

    const not_found = normalizedEtfs.filter((etf) => !found.find((c: C_Etf) => c.index.indexId === etf.index.indexId));

    if (not_found.length > 0) {
      for (const etf of not_found) {
        await ctx.db.insert("etfs", etf);
      }
    }

    if (found.length > 0) {
      for (const etf of found) {
        const new_etf = normalizedEtfs.find((c) => c.index.indexId === etf.index.indexId);

        assert(new_etf, `Etf ${etf.index.indexId} not found`);

        await ctx.db.patch(etf._id, { ...new_etf });
      }
    }
  },
});
