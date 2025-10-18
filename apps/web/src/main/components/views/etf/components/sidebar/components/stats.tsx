import { Icons } from "@/main/utils/icons";
import { NumberTab } from "@/main/components/ui/number-tab";
import { C_Etf } from "@repo/convex/schema";
import { SidebarBox } from "../ui/box";

export const EtfStats = ({ etf }: { etf: C_Etf }) => {
  return (
    <SidebarBox title="Stats" icon={<Icons.Stats />}>
      <div className="w-full grid grid-cols-2 gap-2">
        <NumberTab title="Liquidity" symbolType="usd" value={etf.stats.price.usd} />
        <NumberTab title="Mkt Cap" symbolType="usd" value={etf.stats.price.usd} />
      </div>
    </SidebarBox>
  );
};
