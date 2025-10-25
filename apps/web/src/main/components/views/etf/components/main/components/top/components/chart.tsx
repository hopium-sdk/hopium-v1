"use client";
import { useEffect, useRef, useState } from "react";
import { ChartingLibraryWidgetOptions, IChartingLibraryWidget, ResolutionString, widget } from "@/public/tv/charting_library";
import { C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { useDataFeed } from "./hooks/use-data-feed";
import { SUPPORTED_RESOLUTIONS } from "./hooks/lib/getConfig";
import { cn } from "@/main/shadcn/lib/utils";
import { LoadingDiv } from "@/main/components/ui/loading-div";
import { useSafeTheme } from "@/main/wrappers/components/theme-provider";

export const EtfChart = ({ etf }: { etf: C_EtfWithAssetsAndPools }) => {
  const { hydrated, theme } = useSafeTheme();
  const [isReady, setIsReady] = useState(false);
  const { dataFeed } = useDataFeed({ etf, setIsReady });

  const containerRef = useRef<HTMLDivElement>(null);
  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null);
  const chartReadyRef = useRef(false);

  // Create the widget ONCE
  useEffect(() => {
    if (!containerRef.current || tvWidgetRef.current || !hydrated) return;

    const opts: ChartingLibraryWidgetOptions = {
      load_last_chart: true,
      datafeed: dataFeed, // stable by etf.id
      interval: "60" as ResolutionString,
      container: containerRef.current,
      library_path: "/tv/charting_library/",
      locale: "en",
      fullscreen: false,
      autosize: true,
      theme: theme === "light" ? "light" : "dark",
      favorites: { intervals: SUPPORTED_RESOLUTIONS },
      disabled_features: ["header_quick_search"],
      custom_css_url: "/tv/tv-chart.css",
      custom_font_family: "Bricolage Grotesque",
    };

    const w = new widget(opts);
    tvWidgetRef.current = w;

    w.onChartReady(() => {
      chartReadyRef.current = true;
      w.changeTheme?.(theme === "light" ? "light" : "dark");
    });

    return () => {
      chartReadyRef.current = false;
      tvWidgetRef.current?.remove();
      tvWidgetRef.current = null;
    };
  }, [hydrated]);

  // Theme switching (no widget recreation)
  useEffect(() => {
    const w = tvWidgetRef.current;
    if (!w || !chartReadyRef.current) return;
    const next = theme === "light" ? "light" : "dark";
    w.changeTheme?.(next);
  }, [theme]);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div ref={containerRef} className={cn("flex flex-1", isReady ? "" : "hidden")} />
      {!isReady && <LoadingDiv className="border-none" />}
    </div>
  );
};
