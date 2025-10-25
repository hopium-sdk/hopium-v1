import { Icons } from "@/main/utils/icons";
import { NumberTab } from "@/main/components/ui/number-tab";
import { SidebarBox } from "@/main/components/views/etf/components/sidebar/ui/box";
import { useQuery } from "convex/react";
import { CONVEX } from "@/main/lib/convex";

export const AdminOverview = () => {
  const fees = useQuery(CONVEX.api.fns.platformFees.getTotalPlatformFees.default);
  const volume = useQuery(CONVEX.api.fns.etfToken.getTotalVolume.default);

  const getValue = (option: number): number => {
    switch (option) {
      case 0:
        return fees?.usd ?? 0;
      case 1:
        return fees?.eth ?? 0;
      case 2:
        return volume?.usd ?? 0;
      case 3:
        return volume?.eth ?? 0;
      default:
        return 0;
    }
  };

  return (
    <SidebarBox title="Overview" icon={<Icons.Overview className="size-4.5" />}>
      <div className="w-full grid grid-cols-2 gap-1 pt-2">
        <NumberTab
          title={"Fees USD"}
          value={getValue(0)}
          pClassName="text-md"
          color={getValue(0) == 0 ? "text-subtext" : getValue(0) > 0 ? "text-buy" : "text-sell"}
          symbolType={"usd"}
          blink
        />

        <NumberTab
          title={"Fees ETH"}
          value={getValue(1)}
          pClassName="text-md"
          color={getValue(1) == 0 ? "text-subtext" : getValue(1) > 0 ? "text-buy" : "text-sell"}
          symbolType={"eth"}
          blink
        />

        <NumberTab
          title={"Volume USD"}
          value={getValue(2)}
          pClassName="text-md"
          color={getValue(2) == 0 ? "text-subtext" : getValue(2) > 0 ? "text-buy" : "text-sell"}
          symbolType={"usd"}
          blink
        />

        <NumberTab
          title={"Volume ETH"}
          value={getValue(3)}
          pClassName="text-md"
          color={getValue(3) == 0 ? "text-subtext" : getValue(3) > 0 ? "text-buy" : "text-sell"}
          symbolType={"eth"}
          blink
        />
      </div>
    </SidebarBox>
  );
};
