"use client";
import React, { useEffect } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import type { C_Etf } from "@repo/convex/schema";
import { useSafeTheme } from "@/main/wrappers/components/theme-provider";
import { T_HoldingToken } from "@repo/convex/schema";
import { T_UnderlyingTokenWithWeight } from "../../../../sidebar/components/underlying-tokens";

export const buildUsdIndexFormula = ({ etf, underlyingTokens }: { etf: C_Etf; underlyingTokens: T_HoldingToken[] }): string => {
  const underlyingTokensWithWeight: T_UnderlyingTokenWithWeight[] =
    underlyingTokens?.map((token) => ({
      ...token,
      weightBips: etf.index.holdings?.find((holding) => holding.tokenAddress === token.address)?.weightBips || 0,
    })) || [];

  if (
    underlyingTokensWithWeight.length === 0 ||
    underlyingTokensWithWeight.some((token) => token.weightBips === 0) ||
    underlyingTokensWithWeight.some((token) => token.tv_ticker === "") ||
    underlyingTokensWithWeight.some((token) => token.tv_ticker === null)
  ) {
    return "";
  }

  const symbol = underlyingTokensWithWeight
    .map((h) => {
      const weight = h.weightBips / 10000; // convert bips → fraction
      const symbol = h.tv_ticker;
      return `${weight} * ${symbol}`;
    })
    .join(" + ");

  return symbol;
};

export const EtfChart = ({ etf, underlyingTokens }: { etf: C_Etf; underlyingTokens: T_HoldingToken[] }) => {
  const { theme } = useSafeTheme();
  const symbol = buildUsdIndexFormula({ etf, underlyingTokens });
  console.log(symbol);
  if (symbol === "") {
    return null;
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
