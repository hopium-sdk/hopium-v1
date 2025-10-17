import { HOPIUM } from "@/main/lib/hopium";
import { normalizeAddress } from "@repo/common/utils/address";
import { T_Etf } from "@repo/convex/schema";

type T_EtfData = Awaited<ReturnType<typeof HOPIUM.fns.etfFactory.fetchEtfData>>;
type T_EtfSnapshotWithUsd = Awaited<ReturnType<typeof HOPIUM.fns.etfOracle.fetchEtfSnapshot>>;

export const buildAssets = ({ data, snapshot }: { data: T_EtfData; snapshot: T_EtfSnapshotWithUsd }) => {
  const assets: T_Etf["details"]["assets"] = snapshot.s
    .map((s: T_EtfSnapshotWithUsd["s"][number]) => {
      const asset = data.assets.find((a) => normalizeAddress(a.tokenAddress) === normalizeAddress(s.tokenAddress));
      if (!asset) return null;

      return {
        tokenAddress: asset.tokenAddress,
        targetWeightBips: asset.weightBips,
        currentWeightBips: s.currentWeight,
        decimals: s.tokenDecimals,
        balance: s.tokenBalance,
        price: {
          eth: s.tokenPriceWeth,
          usd: s.tokenPriceUsd,
        },
        value: {
          eth: s.tokenValueWeth,
          usd: s.tokenValueUsd,
        },
      };
    })
    .filter((a) => a !== null);

  return assets;
};
