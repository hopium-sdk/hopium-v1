import { T_QnLog } from "../schema";
import { CONVEX } from "@/main/lib/convex";
import { parseNewAssets } from "../utils/assets/parse-new-assets";
import { buildEtfs } from "../utils/etfs/build-etfs";

export const _syncNewEtfs = async ({ logs }: { logs: T_QnLog[] }) => {
  const allEtfs = await buildEtfs({ logs });
  const newAssets = await parseNewAssets({ etfs: allEtfs });

  if (newAssets.length > 0) {
    await CONVEX.httpClient.mutation(CONVEX.api.mutations.assets.upsert.default, {
      assets: newAssets,
    });
  }

  if (allEtfs.length > 0) {
    await CONVEX.httpClient.mutation(CONVEX.api.mutations.etfs.upsert.default, {
      etfs: allEtfs,
    });
  }

  if (newAssets.length > 0 || allEtfs.length > 0) {
    console.log("Sync success for new etfs");
  }
};
