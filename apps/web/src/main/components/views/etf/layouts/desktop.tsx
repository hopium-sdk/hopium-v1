import { EtfMain } from "../components/main/main";
import { EtfSidebar } from "../components/sidebar/sidebar";
import { C_EtfWithAssetsAndPools } from "@repo/convex/schema";

export const EtfDesktop = ({ etfWithAssetsAndPools }: { etfWithAssetsAndPools: C_EtfWithAssetsAndPools }) => {
  return (
    <div className="flex-1 overflow-hidden hidden lg:flex gap-box">
      <div className="flex flex-1 flex-col overflow-hidden">
        <EtfMain etf={etfWithAssetsAndPools} />
      </div>
      <div className="flex w-[350px] flex-col overflow-hidden rounded-box">
        <EtfSidebar etf={etfWithAssetsAndPools} />
      </div>
    </div>
  );
};
