import { C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { EtfOverview } from "./components/overview";
import { EtfDetails } from "./components/details";
import { EtfTrade } from "./components/trade/trade";
import { EtfAssets } from "./components/assets";

export const EtfSidebar = ({ etf }: { etf: C_EtfWithAssetsAndPools }) => {
  return (
    <div className="w-full flex flex-1 flex-col overflow-hidden bg-bg">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="pt-4 pb-2 px-6">
          <EtfOverview etf={etf} />
        </div>

        <div className="py-4 px-6">
          <EtfTrade etf={etf} />
        </div>

        {etf.assets && (
          <div className="py-4 px-6">
            <EtfAssets etf={etf} />
          </div>
        )}

        <div className="py-4 px-6">
          <EtfDetails etf={etf} />
        </div>
      </div>
    </div>
  );
};
