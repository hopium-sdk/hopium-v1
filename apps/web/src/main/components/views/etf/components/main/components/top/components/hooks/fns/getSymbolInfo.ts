import { LibrarySymbolInfo } from "@/public/tv/charting_library/charting_library";
import { C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { getConfig } from "../lib/getConfig";

export const getSymbolInfo = ({ etf }: { etf: C_EtfWithAssetsAndPools }) => {
  const etfSymbol = etf.etf.details.ticker;
  const etfName = etf.etf.details.name;

  const symbolInfo: LibrarySymbolInfo = {
    ticker: `${etfSymbol}`,
    name: `HOPIUM:${etfSymbol}USD`,
    description: `${etfName} / USD`,
    type: "Crypto ETF",
    exchange: "Hopium",
    listed_exchange: "Hopium",
    session: "24x7",
    timezone: "Etc/UTC",
    minmov: 1,
    pricescale: calculatePriceScale(etf),
    visible_plots_set: "ohlc",
    supported_resolutions: getConfig().supported_resolutions,
    data_status: "streaming",
    format: "price",
    has_intraday: true,
  };
  return symbolInfo;
};

const calculatePriceScale = (etf: C_EtfWithAssetsAndPools) => {
  const usdPrice = etf.etf.stats.price.usd;

  if (usdPrice < 0.001) {
    return 10_000_000;
  } else if (usdPrice < 0.01) {
    return 1_000_000;
  } else if (usdPrice < 0.1) {
    return 100_000;
  } else if (usdPrice < 1) {
    return 10_000;
  } else {
    return 1_000;
  }
};
