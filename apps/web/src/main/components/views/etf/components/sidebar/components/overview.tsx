import { C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { useWatchlist } from "@/main/hooks/use-watchlist";
import { cn } from "@/main/shadcn/lib/utils";
import { Icons } from "@/main/utils/icons";
import { useEffect, useState } from "react";
import { NumberTab } from "@/main/components/ui/number-tab";
import { SubscriptDiv } from "@/main/components/ui/subscript-div";
import { SidebarBox } from "../ui/box";
import { HOPIUM } from "@/main/lib/hopium";

export const EtfOverview = ({ etf }: { etf: C_EtfWithAssetsAndPools }) => {
  // const [livePrice, setLivePrice] = useState({ etfPriceWeth: 0, etfPriceUsd: 0 });

  // const fetchLiveUsdPrice = async () => {
  //   const data = await HOPIUM.fns.etfOracle.fetchEtfPrice({ etfId: BigInt(etf.etf.details.etfId) });
  //   setLivePrice(data);
  // };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchLiveUsdPrice();
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [etf.etf.details.etfId]);

  const getValue = (option: number): number => {
    switch (option) {
      case 0:
        return etf.etf.stats.price.usd;
      case 1:
        return etf.etf.stats.price.eth;
      default:
        return 0;
    }
  };

  return (
    <SidebarBox title="Overview" icon={<Icons.Overview className="size-4.5" />} right={<WatchlistButton etf={etf} />}>
      <div className="w-full grid grid-cols-2 gap-2">
        <NumberTab
          title={"Price USD"}
          value={getValue(0)}
          color={getValue(0) == 0 ? "text-subtext" : getValue(0) > 0 ? "text-green-500" : "text-red-500"}
          symbolType={"usd"}
          blink
        />

        <NumberTab
          title={"Price ETH"}
          value={getValue(1)}
          color={getValue(1) == 0 ? "text-subtext" : getValue(1) > 0 ? "text-green-500" : "text-red-500"}
          symbolType={"eth"}
          blink
        />

        {/* <NumberTab
          title={"Live Price USD"}
          value={livePrice.etfPriceUsd}
          color={livePrice.etfPriceUsd == 0 ? "text-subtext" : livePrice.etfPriceUsd > 0 ? "text-green-500" : "text-red-500"}
          symbolType={"usd"}
          blink
        />

        <NumberTab
          title={"Live Price ETH"}
          value={livePrice.etfPriceWeth}
          color={livePrice.etfPriceWeth == 0 ? "text-subtext" : livePrice.etfPriceWeth > 0 ? "text-green-500" : "text-red-500"}
          symbolType={"eth"}
          blink
        /> */}
      </div>
    </SidebarBox>
  );
};

const WatchlistButton = ({ etf }: { etf: C_EtfWithAssetsAndPools }) => {
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const { addToWatchlist, isInWatchlist, removeFromWatchlist } = useWatchlist();

  const handleWatchlist = async () => {
    if (watchlistLoading) return;

    setWatchlistLoading(true);

    if (isInWatchlist({ etfId: etf.etf.details.etfId })) {
      await removeFromWatchlist({ etfId: etf.etf.details.etfId });
    } else {
      await addToWatchlist({ etfId: etf.etf.details.etfId });
    }
    setWatchlistLoading(false);
  };

  return (
    <div
      onClick={handleWatchlist}
      className={cn(
        "flex items-center gap-2 rounded-full px-3 py-1 border cursor-pointer",
        !isInWatchlist({ etfId: etf.etf.details.etfId }) ? "border-main text-main hover:bg-main-900" : "border-red text-red hover:bg-red-900",
        watchlistLoading && "opacity-70"
      )}
    >
      {watchlistLoading ? (
        <Icons.Loading className="size-3.5 animate-spin" />
      ) : (
        <SubscriptDiv
          baseItem={<Icons.Watchlist className="size-4" />}
          subscriptItem={<p className="text-md font-medium">{isInWatchlist({ etfId: etf.etf.details.etfId }) ? "-" : "+"}</p>}
          subscriptClassName="-top-2"
        />
      )}
      <p className="text-sm font-medium">Watchlist</p>
    </div>
  );
};
