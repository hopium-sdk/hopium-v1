"use client";
import React, { useEffect } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import type { C_Etf } from "@repo/convex/schema";
import { useSafeTheme } from "@/main/wrappers/components/theme-provider";

export const EtfChart = ({ etf }: { etf: C_Etf }) => {
  const { theme } = useSafeTheme();
  const symbol = "BINANCE:ETHUSD/BINANCE:BTCUSD*10000";

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdvancedRealTimeChart
        autosize
        symbol={symbol}
        interval="D"
        theme={theme == "light" ? "light" : "dark"}
        allow_symbol_change={false}
        copyrightStyles={{ parent: { display: "none" } }}
        hide_legend={true}
        withdateranges={false}
        // studies={["Volume@tv-basicstudies"]}
      />
    </div>
  );
};
