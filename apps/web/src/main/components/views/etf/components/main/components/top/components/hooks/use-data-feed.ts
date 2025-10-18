import { OnReadyCallback, IBasicDataFeed, SubscribeBarsCallback } from "@/public/tv/charting_library/charting_library";
import { T_EtfWithAssetsAndPools, T_OhlcTimeframe } from "@repo/convex/schema";
import { getSymbolInfo } from "./fns/getSymbolInfo";
import { getConfig } from "./lib/getConfig";
import { convertResolution } from "./utils/convert-resolution";
import { CONVEX } from "@/main/lib/convex";
import { useEffect, useRef } from "react";
import { useQuery } from "convex/react";

export const useDataFeed = ({ etf }: { etf: T_EtfWithAssetsAndPools }) => {
  const timeframeRef = useRef<T_OhlcTimeframe | null>(null);
  const liveCbRef = useRef<SubscribeBarsCallback | null>(null);

  const latestOhlc = useQuery(
    CONVEX.api.fns.ohlc.getLatest.default,
    timeframeRef.current && liveCbRef.current
      ? {
          etfId: etf.etf.details.etfId,
          timeframe: timeframeRef.current,
        }
      : "skip"
  );

  useEffect(() => {
    if (latestOhlc && liveCbRef.current) {
      liveCbRef.current({
        time: latestOhlc.bucketTimestamp,
        open: latestOhlc.open,
        high: latestOhlc.high,
        low: latestOhlc.low,
        close: latestOhlc.close,
        volume: latestOhlc.volume,
      });
    }
  }, [latestOhlc, liveCbRef.current]);

  const dataFeed: IBasicDataFeed = {
    onReady: (callback: OnReadyCallback) => {
      setTimeout(() => callback(getConfig()));
    },
    searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
      onResultReadyCallback([]);
    },
    resolveSymbol: (_, onSymbolResolvedCallback) => {
      const symbolInfo = getSymbolInfo({ etf });
      setTimeout(() => {
        onSymbolResolvedCallback(symbolInfo);
      }, 0);
    },
    getBars: (symbolInfo, resolution, periodParams, onHistoryCallback, _) => {
      setTimeout(async () => {
        const timeframe = convertResolution(resolution);
        const ohlcs = await CONVEX.httpClient.query(CONVEX.api.fns.ohlc.getHistorical.default, {
          etfId: etf.etf.details.etfId,
          timeframe,
          latestTimestamp: periodParams.to,
          countBack: periodParams.countBack,
        });

        if (ohlcs.length === 0) {
          onHistoryCallback([], { noData: true });
          return;
        }

        onHistoryCallback(
          ohlcs.map((ohlc) => ({
            time: ohlc.bucketTimestamp,
            open: ohlc.open,
            high: ohlc.high,
            low: ohlc.low,
            close: ohlc.close,
            volume: ohlc.volume,
          }))
        );
      }, 0);
    },
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
      const timeframe = convertResolution(resolution);
      timeframeRef.current = timeframe;
      liveCbRef.current = onRealtimeCallback;
    },
    unsubscribeBars: (_) => {},
  };

  return { dataFeed };
};
