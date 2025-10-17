"use client";
import { ColumnDef } from "@tanstack/react-table";
import { NumberDiv } from "@/main/components/ui/number-div";
import { Avatar } from "@/main/components/ui/avatar";
import { C_Etf, T_EtfTokenPosition } from "@repo/convex/schema";
import { EtfImage } from "@/main/components/ui/etf-image";
import { cn } from "@/main/shadcn/lib/utils";

export const getPositionsColumns = ({ etf }: { etf: C_Etf }) => {
  const allColumns: ColumnDef<T_EtfTokenPosition>[] = [
    {
      accessorKey: "tokenAddress",
      header: "Token",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <EtfImage address={row.original.tokenAddress} withBox boxClassName="size-8" iconClassName="size-6" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium">{row.original.tokenSymbol}</p>
              </div>
              <p className="text-xs font-medium text-subtext">{row.original.tokenName}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "balance",
      header: "Position",
      cell: ({ row }) => {
        const value = row.original.balance;
        return <NumberDiv number={value} symbolType={"coin"} displayZero={true} pClassName="text-xs" />;
      },
    },
    {
      header: "Value",
      cell: ({ row }) => {
        const value = row.original.balance * etf.stats.price.usd;
        return <NumberDiv number={value} symbolType={"usd"} displayZero={true} pClassName="text-xs" />;
      },
    },
    {
      header: "Avg Entry Price",
      cell: ({ row }) => {
        const value = row.original.avgEntryPrice.usd;
        return <NumberDiv number={value} symbolType={"usd"} displayZero={true} pClassName="text-xs" />;
      },
    },
    {
      header: "PnL",
      cell: ({ row }) => {
        const pnlUsd = row.original.balance * (etf.stats.price.usd - row.original.avgEntryPrice.usd);
        const pnlPercent = pnlUsd / (row.original.balance * row.original.avgEntryPrice.usd);
        const pnlColor = pnlUsd > 0 ? "text-buy" : "text-sell";
        return (
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-1">
              <p className={cn("text-xs font-medium", pnlColor)}>{pnlUsd > 0 ? "+" : ""}</p>
              <NumberDiv number={pnlUsd} symbolType={"usd"} displayZero={true} color={pnlColor} pClassName="text-xs" />
            </div>
            <div className="flex items-center gap-1">
              <span className={cn("text-xs font-medium", pnlColor)}>(</span>
              <span className={cn("text-xs font-medium", pnlColor)}>{pnlPercent > 0 ? "+" : ""}</span>
              <NumberDiv
                number={pnlPercent}
                symbolType={"percent"}
                displayZero={true}
                color={pnlColor}
                pClassName="text-xs"
                unformatted
                unformattedDecimals={2}
              />
              <span className={cn("text-xs font-medium", pnlColor)}>)</span>
            </div>
          </div>
        );
      },
    },
  ];

  return allColumns;
};
