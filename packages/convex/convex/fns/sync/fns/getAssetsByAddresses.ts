import { QueryCtx } from "../../../_generated/server";
import { C_Asset } from "../../../schema/assets";

export const _getAssetsByAddresses = async ({ ctx, assetAddresses }: { ctx: QueryCtx; assetAddresses: string[] }) => {
  const assets: C_Asset[] = (
    await Promise.all(
      assetAddresses.map(async (address) =>
        ctx.db
          .query("assets")
          .withIndex("by_address", (q) => q.eq("address", address))
          .first()
      )
    )
  ).filter((asset) => asset !== null);
  return assets;
};
