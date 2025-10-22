import { C_Asset } from "../../../schema/assets";
import { C_Etf, C_EtfWithAssetsAndPools } from "../../../schema/etf";
import { C_Pool } from "../../../schema/pools";
import { QueryCtx } from "../../../_generated/server";
import { normalizeAddress } from "../../../../src/utils/normalizeAddress";

export async function enrichEtfWithAssetsAndPools(ctx: QueryCtx, etf: C_Etf): Promise<C_EtfWithAssetsAndPools> {
  const assetsInEtf = etf?.details?.assets ?? [];

  const allAssets: C_Asset[] = (
    await Promise.all(
      assetsInEtf.map(async (a: { tokenAddress: string }) => {
        const asset = await ctx.db
          .query("assets")
          .withIndex("by_address", (q) => q.eq("address", a.tokenAddress))
          .first();
        return asset ?? null;
      })
    )
  ).filter((x): x is C_Asset => x !== null);

  const allPools: C_Pool[] = (
    await Promise.all(
      allAssets.map(async (asset) => {
        if (!asset.poolAddress) return null;
        const pool = await ctx.db
          .query("pools")
          .withIndex("by_address", (q) => q.eq("address", normalizeAddress(asset.poolAddress ?? "")))
          .first();
        return pool ?? null;
      })
    )
  ).filter((x): x is C_Pool => x !== null);

  return { etf, assets: allAssets, pools: allPools };
}
