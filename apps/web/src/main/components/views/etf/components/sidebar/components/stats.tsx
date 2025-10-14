import { Icons } from "@/main/utils/icons";
import { NumberTab } from "@/main/components/ui/number-tab";
import { C_Etf } from "@repo/convex/schema";

export const EtfStats = ({ etf }: { etf: C_Etf }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center gap-2 pb-1">
        <Icons.Stats className="size-4.5 text-subtext" />
        <p className="text-xs font-medium text-subtext">Stats</p>
      </div>

      <div className="w-full grid grid-cols-2 gap-2">
        <NumberTab title="Liquidity" symbolType="usd" value={etf.stats.assets_liquidity_usd} />
        {/* <NumberTab title="FDV" symbolType="usd" value={etf.stats.assets_mcap_usd} /> */}
        <NumberTab title="Mkt Cap" symbolType="usd" value={etf.stats.assets_mcap_usd} />
      </div>
    </div>
  );
};
