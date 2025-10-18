"use client";
import React from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import type { C_Etf, T_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { useSafeTheme } from "@/main/wrappers/components/theme-provider";
import { C_Asset } from "@repo/convex/schema";
import { T_AssetWithWeight } from "../../../../sidebar/components/assets";

export const buildUsdIndexFormula = ({ etf, assets }: { etf: C_Etf; assets: C_Asset[] }): string => {
  const assetsWithWeight: T_AssetWithWeight[] =
    assets?.map((asset) => ({
      ...asset,
      weightBips: etf.details.assets?.find((a) => a.tokenAddress === asset.address)?.targetWeightBips || 0,
    })) || [];

  if (assetsWithWeight.length === 0 || assetsWithWeight.some((asset) => asset.weightBips === 0) || assetsWithWeight.some((asset) => asset.tv_ticker === "")) {
    return "";
  }

  const symbol = assetsWithWeight
    .map((h) => {
      const weight = h.weightBips / 10000; // convert bips → fraction
      const symbol = h.tv_ticker;
      return `${weight} * ${symbol}`;
    })
    .join(" + ");

  return symbol;
};

export const EtfChart = ({ etf }: { etf: T_EtfWithAssetsAndPools }) => {
  const { theme } = useSafeTheme();
  let symbol: string = buildUsdIndexFormula({ etf: etf.etf, assets: etf.assets });

  if (symbol === "") {
    symbol = "BINANCE:BTCUSD";
  }

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
