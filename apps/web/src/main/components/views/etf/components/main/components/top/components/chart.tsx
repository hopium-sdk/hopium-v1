"use client";
import { useEffect, useRef } from "react";
import { ChartingLibraryWidgetOptions, ResolutionString, widget } from "@/public/tv/charting_library";
import { T_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { useDataFeed } from "./hooks/use-data-feed";
import { SUPPORTED_RESOLUTIONS } from "./hooks/lib/getConfig";

export const EtfChart = ({ etf }: { etf: T_EtfWithAssetsAndPools }) => {
  const { dataFeed } = useDataFeed({ etf });
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const widgetOptions: ChartingLibraryWidgetOptions = {
      load_last_chart: true,
      datafeed: dataFeed,
      interval: "1" as ResolutionString,
      container: chartContainerRef.current,
      library_path: "/tv/charting_library/",
      locale: "en",
      fullscreen: false,
      autosize: true,
      theme: "dark",
      favorites: {
        intervals: SUPPORTED_RESOLUTIONS,
      },
      disabled_features: ["header_quick_search"],
    };

    const tvWidget = new widget(widgetOptions);

    return () => {
      tvWidget.remove();
    };
  }, [chartContainerRef]);

  return (
    <div className={"flex flex-1 overflow-hidden"}>
      <div ref={chartContainerRef} className={"flex flex-1"} />
    </div>
  );
};
