import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { C_Etf, EtfSchema } from "../../schema/etf";
import { normalizeAddress } from "../../../src/utils/normalizeAddress";

export default mutation({
  args: {
    etfs: v.array(v.object(EtfSchema)),
  },
  handler: async (ctx, args) => {
    const { etfs } = args;

    const normalizedEtfs = etfs.map((etf) => ({
      ...etf,
      details: {
        ...etf.details,
        assets: etf.details.assets.map((asset) => ({
          ...asset,
          tokenAddress: normalizeAddress(asset.tokenAddress),
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
            .withIndex("by_etfId", (q) => q.eq("details.etfId", etf.details.etfId))
            .first();
        })
      )
    ).filter((etf) => etf !== null) as C_Etf[];

    for (const etf of found) {
      await ctx.db.patch(etf._id, {
        ...normalizedEtfs.find((c) => c.details.etfId === etf.details.etfId),
      });
    }
  },
});
