"use client";
import { useEffect, useRef, useState } from "react";
import { ChartingLibraryWidgetOptions, ResolutionString, widget } from "@/public/tv/charting_library";
import { T_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { useDataFeed } from "./hooks/use-data-feed";
import { SUPPORTED_RESOLUTIONS } from "./hooks/lib/getConfig";
import { cn } from "@/main/shadcn/lib/utils";
import { LoadingDiv } from "@/main/components/ui/loading-div";

export const EtfChart = ({ etf }: { etf: T_EtfWithAssetsAndPools }) => {
  const [isReady, setIsReady] = useState(false);
  const { dataFeed } = useDataFeed({ etf, setIsReady });
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
      <div ref={chartContainerRef} className={cn("flex flex-1", isReady ? "" : "hidden")} />
      {!isReady && <LoadingDiv />}
    </div>
  );
};
