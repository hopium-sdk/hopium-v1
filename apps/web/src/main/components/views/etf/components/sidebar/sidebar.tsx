import { C_Etf } from "@repo/convex/schema";
import { EtfOverview } from "./components/overview";
import { EtfStats } from "./components/stats";
import { EtfDetails } from "./components/details";
import { EtfTrade } from "./components/trade/trade";
import { EtfUnderlyingTokens } from "./components/underlying-tokens";

export const EtfSidebar = ({ etf }: { etf: C_Etf }) => {
  return (
    <div className="w-full flex flex-1 flex-col overflow-hidden">
      <div className="py-3 px-6 border-b">
        <EtfOverview etf={etf} />
      </div>

      <div className="w-full flex flex-col overflow-y-auto no-scrollbar">
        <div className="py-5 px-6 border-b">
          <EtfTrade etf={etf} />
        </div>

        <div className="py-5 px-6 border-b">
          <EtfStats etf={etf} />
        </div>

        <div className="py-5 px-6 border-b">
          <EtfUnderlyingTokens etf={etf} />
        </div>

        <div className="py-5 px-6">
          <EtfDetails etf={etf} />
        </div>
      </div>
    </div>
  );
};
