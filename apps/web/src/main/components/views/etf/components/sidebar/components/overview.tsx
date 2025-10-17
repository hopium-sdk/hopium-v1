import { C_Etf } from "@repo/convex/schema";
import { useWatchlist } from "@/main/hooks/use-watchlist";
import { cn } from "@/main/shadcn/lib/utils";
import { Icons } from "@/main/utils/icons";
import { useEffect, useState } from "react";
import { NumberTab } from "@/main/components/ui/number-tab";
import { SubscriptDiv } from "@/main/components/ui/subscript-div";
import { SidebarBox } from "../ui/box";
import { HOPIUM } from "@/main/lib/hopium";

type T_EtfPrice = {
  etfPriceUsd: number;
  etfPriceWeth: number;
};

export const EtfOverview = ({ etf }: { etf: C_Etf }) => {
  const [etfPrice, setEtfPrice] = useState<T_EtfPrice>({ etfPriceUsd: 0, etfPriceWeth: 0 });

  const fetchEtfPrice = async () => {
    const price = await HOPIUM.fns.etfOracle.fetchEtfPrice({ etfId: BigInt(etf.details.etfId) });
    setEtfPrice(price);
  };

  useEffect(() => {
    fetchEtfPrice();

    const interval = setInterval(() => {
      fetchEtfPrice();
    }, 10000);

    return () => clearInterval(interval);
  }, [etf.details.etfId]);

  const getValue = (option: number): number => {
    switch (option) {
      case 0:
        return etfPrice.etfPriceUsd;
      case 1:
        return etfPrice.etfPriceWeth;
      default:
        return 0;
    }
  };

  return (
    <SidebarBox title="Overview" icon={<Icons.Overview />} right={<WatchlistButton etf={etf} />}>
      <div className="w-full grid grid-cols-2 gap-2">
        <NumberTab
          title={"Price USD"}
          value={getValue(0)}
          color={getValue(0) == 0 ? "text-subtext" : getValue(0) > 0 ? "text-green-500" : "text-red-500"}
          symbolType={"usd"}
        />
        <NumberTab
          title={"Price ETH"}
          value={getValue(1)}
          color={getValue(1) == 0 ? "text-subtext" : getValue(1) > 0 ? "text-green-500" : "text-red-500"}
          symbolType={"eth"}
        />
      </div>
    </SidebarBox>
  );
};

const WatchlistButton = ({ etf }: { etf: C_Etf }) => {
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const { addToWatchlist, isInWatchlist, removeFromWatchlist } = useWatchlist();

  const handleWatchlist = async () => {
    if (watchlistLoading) return;

    setWatchlistLoading(true);

    if (isInWatchlist({ etfId: etf.details.etfId })) {
      await removeFromWatchlist({ etfId: etf.details.etfId });
    } else {
      await addToWatchlist({ etfId: etf.details.etfId });
    }
    setWatchlistLoading(false);
  };

  return (
    <div
      onClick={handleWatchlist}
      className={cn(
        "flex items-center gap-2 rounded-full px-3 py-1 border cursor-pointer",
        !isInWatchlist({ etfId: etf.details.etfId }) ? "border-main text-main hover:bg-main-900" : "border-red text-red hover:bg-red-900",
        watchlistLoading && "opacity-70"
      )}
    >
      {watchlistLoading ? (
        <Icons.Loading className="size-3.5 animate-spin" />
      ) : (
        <SubscriptDiv
          baseItem={<Icons.Watchlist className="size-3.5" />}
          subscriptItem={<p className="text-sm font-medium">{isInWatchlist({ etfId: etf.details.etfId }) ? "-" : "+"}</p>}
          subscriptClassName="-top-2"
        />
      )}
      <p className="text-xs font-medium">Watchlist</p>
    </div>
  );
};
