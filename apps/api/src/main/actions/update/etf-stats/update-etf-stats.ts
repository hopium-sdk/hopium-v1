import { CONVEX } from "@/main/lib/convex";
import { HOPIUM } from "@/main/lib/hopium";
import { batchRetry } from "@/main/utils/fn-executors/batch-retry";
import { T_Etf } from "@repo/convex/schema";

export const _updateEtfStats = async () => {
  const etfs = await CONVEX.httpClient.query(CONVEX.api.fns.etf.getAllEtfs.default);

  const tasks: Array<() => Promise<T_Etf>> = etfs.map((etf) => async () => {
    const [stats, volume] = await Promise.all([
      HOPIUM.fns.etfOracle.fetchEtfStats({
        etfId: BigInt(etf.details.etfId),
      }),
      CONVEX.httpClient.query(CONVEX.api.fns.etfToken.getEtfVolume.default, {
        etfId: etf.details.etfId,
      }),
    ]);

    const { _id, _creationTime, ...rest } = etf;

    return {
      ...rest,
      stats: {
        ...rest.stats,
        assetsLiquidityUsd: stats.assetsLiquidityUsd,
        assetsMcapUsd: stats.assetsMcapUsd,
        volume: {
          eth: volume.eth,
          usd: volume.usd,
        },
      },
    };
  });

  const updatedEtfs = await batchRetry<T_Etf>({
    tasks,
    timeoutMs: 30_000,
  });

  await CONVEX.httpClient.mutation(CONVEX.api.mutations.etf.updateEtfs.default, {
    etfs: updatedEtfs,
  });
};
