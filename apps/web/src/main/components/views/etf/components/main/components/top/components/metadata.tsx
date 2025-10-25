import { EtfImage } from "@/main/components/ui/etf-image";
import { C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { NumberDiv } from "@/main/components/ui/number-div";
import { Timestamp } from "@/main/components/ui/timestamp";
import { calculateTvl } from "@/main/utils/calc-etf";
import { usePrices } from "@/main/wrappers/components/prices-provider";

export const EtfMetadata = ({ etf }: { etf: C_EtfWithAssetsAndPools }) => {
  const { ethUsdPrice } = usePrices();
  const statsOptions = ["Created", "Volume", "TVL", "Liquidity", "Mkt Cap"];

  const getStatsValue = (option: string) => {
    switch (option) {
      case "Created":
        return etf.etf.details.createdAt;
      case "Volume":
        return etf.etf.stats.volume.usd;
      case "TVL":
        return calculateTvl({ etf, ethUsdPrice }).usd;
      case "Liquidity":
        return etf.etf.stats.assetsLiquidityUsd;
      case "Mkt Cap":
        return etf.etf.stats.assetsMcapUsd;
      default:
        return 0;
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 border-b-2 px-6 py-2 overflow-hidden">
      <div className="w-full flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-3">
          <EtfImage address={etf.etf.contracts.etfTokenAddress} withBox boxClassName="size-9" iconClassName="size-6" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium uppercase">{etf.etf.details.ticker}</p>
            </div>
            <p className="text-sm font-medium text-subtext">{etf.etf.details.name}</p>
          </div>
        </div>
        <div className="w-full flex flex-1 overflow-x-auto md:justify-end">
          <div className="w-fit flex items-center justify-end gap-8 md:gap-10">
            {statsOptions.map((option) => (
              <div key={option} className="flex flex-col items-end text-right gap-1">
                <p className="text-sm font-medium text-subtext whitespace-nowrap">{option}</p>
                <div className="w-fit flex items-center justify-end">
                  {option === "Created" ? (
                    <div className="w-full flex items-center justify-end">
                      <Timestamp
                        timestamp={etf.etf.details.createdAt}
                        pClassName="text-sm whitespace-nowrap"
                        className="text-text font-medium"
                        withLink={false}
                      />
                    </div>
                  ) : (
                    <NumberDiv
                      number={getStatsValue(option)}
                      symbolType={option === "Assets" ? undefined : "usd"}
                      noDecimals={option === "Assets"}
                      pClassName="text-sm font-medium whitespace-nowrap"
                      blink
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
