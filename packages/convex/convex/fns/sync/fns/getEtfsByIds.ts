import { QueryCtx } from "../../../_generated/server";
import { C_Etf } from "../../../schema/etf";

export const _getEtfsByIds = async ({ ctx, etfIds }: { ctx: QueryCtx; etfIds: number[] }) => {
  const etfs: C_Etf[] = (
    await Promise.all(
      etfIds.map(async (id) =>
        ctx.db
          .query("etfs")
          .withIndex("by_etfId", (q) => q.eq("details.etfId", id))
          .first()
      )
    )
  ).filter((etf) => etf !== null);

  return etfs;
};
