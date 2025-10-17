import { EtfImage } from "@/main/components/ui/etf-image";
import { C_Etf } from "@repo/convex/schema";
import { NumberDiv } from "@/main/components/ui/number-div";
import { Timestamp } from "@/main/components/ui/timestamp";

export const EtfMetadata = ({ etf }: { etf: C_Etf }) => {
  const statsOptions = ["Created", "Volume", "TVL", "Liquidity", "Mkt Cap"];

  const getStatsValue = (option: string) => {
    switch (option) {
      case "Created":
        return etf.details.createdAt;
      case "Volume":
        return etf.stats.assetsVolumeUsd;
      case "TVL":
        return etf.stats.tvl.usd;
      case "Liquidity":
        return etf.stats.assetsLiquidityUsd;
      case "Mkt Cap":
        return etf.stats.assetsMcapUsd;
      default:
        return 0;
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 border-b px-6 py-2">
      <div className="w-full flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <EtfImage address={etf.contracts.etfTokenAddress} withBox boxClassName="size-9" iconClassName="size-6" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold uppercase">{etf.details.ticker}</p>
            </div>
            <p className="text-sm font-medium text-subtext">{etf.details.name}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-10">
          {statsOptions.map((option) => (
            <div key={option} className="flex flex-col text-right gap-1">
              <p className="text-xs font-medium text-subtext">{option}</p>
              <div className="w-full flex items-center justify-end">
                {option === "Created" ? (
                  <div className="w-full flex items-center justify-end">
                    <Timestamp
                      timestamp={etf.details.createdAt}
                      pClassName="text-xs"
                      color="text-subtext text-text font-medium"
                      withLink={false}
                      iconClassName="size-3.5"
                    />
                  </div>
                ) : (
                  <NumberDiv
                    number={getStatsValue(option)}
                    symbolType={option === "Assets" ? undefined : "usd"}
                    noDecimals={option === "Assets"}
                    pClassName="text-xs font-medium"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
