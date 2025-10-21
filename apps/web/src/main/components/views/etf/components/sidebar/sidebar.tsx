import { C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { EtfOverview } from "./components/overview";
import { EtfDetails } from "./components/details";
import { EtfTrade } from "./components/trade/trade";
import { EtfAssets } from "./components/assets";

export const EtfSidebar = ({ etf }: { etf: C_EtfWithAssetsAndPools }) => {
  return (
    <div className="w-full flex flex-1 flex-col overflow-hidden bg-bg">
      <div className="py-3 px-6 border-b">
        <EtfOverview etf={etf} />
      </div>

      <div className="w-full flex flex-col overflow-y-auto">
        <div className="py-5 px-6 border-b">
          <EtfTrade etf={etf} />
        </div>

        {/* <div className="py-5 px-6 border-b">
          <EtfStats etf={etf} />
        </div> */}

        {etf.assets && (
          <div className="py-5 px-6 border-b">
            <EtfAssets etf={etf} />
          </div>
        )}

        <div className="py-5 px-6">
          <EtfDetails etf={etf} />
        </div>
      </div>
    </div>
  );
};
