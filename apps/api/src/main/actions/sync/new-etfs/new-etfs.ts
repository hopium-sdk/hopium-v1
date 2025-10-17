import { T_QnLog } from "../schema";
import { CONVEX } from "@/main/lib/convex";
import { parseNewAssets } from "../utils/assets/parse-new-assets";
import { buildEtfs } from "../utils/etfs/build-etfs";

export const _syncNewEtfs = async ({ logs }: { logs: T_QnLog[] }) => {
  const allEtfs = await buildEtfs({ logs });
  const newAssets = await parseNewAssets({ etfs: allEtfs });

  return {
    newAssets,
    allEtfs,
  };
};
