"use client";
import { ColumnDef } from "@tanstack/react-table";
import { NumberDiv } from "@/main/components/ui/number-div";
import { C_Etf } from "@repo/convex/schema";
import { CoinImage } from "@/main/components/ui/coin-image";
import { T_EtfVaultToken } from "../vault";
import { Progress } from "@/main/shadcn/components/ui/progress";

export const getVaultColumns = ({ etf }: { etf: C_Etf }) => {
  const allColumns: ColumnDef<T_EtfVaultToken>[] = [
    {
      accessorKey: "tokenAddress",
      header: "Token",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <CoinImage address={row.original.tokenAddress} boxClassName="size-6.5" />
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
      header: "Balance",
      cell: ({ row }) => {
        const value = row.original.balance;
        return <NumberDiv number={value} symbolType={"coin"} displayZero={true} pClassName="text-xs" />;
      },
    },
    {
      header: "Value",
      cell: ({ row }) => {
        const value = row.original.balance * row.original.price.usd;
        return <NumberDiv number={value} symbolType={"usd"} displayZero={true} pClassName="text-xs" />;
      },
    },
    {
      header: "Current Weight",
      cell: ({ row }) => {
        const tvl = etf.stats.tvl.usd;
        let value = (row.original.balance / tvl) * 100;
        if (isNaN(value) || value == Infinity) {
          value = 0;
        }
        return (
          <div className="flex flex-col items-start gap-1">
            <NumberDiv number={value} symbolType={"percent"} displayZero={true} pClassName="text-xs" />
            <Progress value={value} className="w-2/3 bg-bg-900 h-1.25" progressClassName="bg-main" />
          </div>
        );
      },
    },
    {
      header: "Target Weight",
      cell: ({ row }) => {
        let value = row.original.targetWeightBips / 100;
        if (isNaN(value) || value == Infinity) {
          value = 0;
        }
        return (
          <div className="flex flex-col items-start gap-1">
            <NumberDiv number={value} symbolType={"percent"} displayZero={true} pClassName="text-xs" />
            <Progress value={value} className="w-2/3 bg-bg-900 h-1.25" progressClassName="bg-main" />
          </div>
        );
      },
    },
  ];

  return allColumns;
};
