import { C_Etf } from "@repo/convex/schema";
import { useWatchlist } from "@/main/hooks/use-watchlist";
import { cn } from "@/main/shadcn/lib/utils";
import { Icons } from "@/main/utils/icons";
import { useState } from "react";
import { NumberTab } from "@/main/components/ui/number-tab";
import { SubscriptDiv } from "@/main/components/ui/subscript-div";

export const EtfOverview = ({ etf }: { etf: C_Etf }) => {
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const { addToWatchlist, isInWatchlist, removeFromWatchlist } = useWatchlist();

  const getValue = (option: number): number => {
    switch (option) {
      case 0:
        return etf.stats.price.usd;
      case 1:
        return etf.stats.price.eth;
      default:
        return 0;
    }
  };

  const handleWatchlist = async () => {
    if (watchlistLoading) return;

    setWatchlistLoading(true);

    if (isInWatchlist({ index_id: etf.index.indexId })) {
      await removeFromWatchlist({ index_id: etf.index.indexId });
    } else {
      await addToWatchlist({ index_id: etf.index.indexId });
    }
    setWatchlistLoading(false);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icons.Overview className="text-subtext" />
          <p className="text-xs font-medium text-subtext">Overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            onClick={handleWatchlist}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1 border cursor-pointer",
              !isInWatchlist({ index_id: etf.index.indexId }) ? "border-main text-main hover:bg-main-900" : "border-red text-red hover:bg-red-900",
              watchlistLoading && "opacity-70"
            )}
          >
            {watchlistLoading ? (
              <Icons.Loading className="size-3.5 animate-spin" />
            ) : (
              <SubscriptDiv
                baseItem={<Icons.Watchlist className="size-3.5" />}
                subscriptItem={<p className="text-sm font-medium">{isInWatchlist({ index_id: etf.index.indexId }) ? "-" : "+"}</p>}
                subscriptClassName="-top-2"
              />
            )}
            <p className="text-xs font-medium">Watchlist</p>
          </div>
        </div>
      </div>

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
    </div>
  );
};
