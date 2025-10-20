"use client";
import { ColumnDef } from "@tanstack/react-table";
import { NumberDiv } from "@/main/components/ui/number-div";
import { Avatar } from "@/main/components/ui/avatar";
import { Progress } from "@/main/shadcn/components/ui/progress";
import { C_EtfWithAssetsAndPools, T_EtfTokenHolder } from "@repo/convex/schema";

export const getHoldersColumns = ({ etf, etfSupply }: { etf: C_EtfWithAssetsAndPools; etfSupply: number }) => {
  const allColumns: ColumnDef<T_EtfTokenHolder>[] = [
    {
      header: "Rank",
      cell: ({ row }) => {
        return <p className="text-subtext">{row.index + 1}</p>;
      },
    },
    {
      accessorKey: "userAddress",
      header: "Holder",
      cell: ({ row }) => {
        return <Avatar address={row.original.userAddress} withLinkIcon />;
      },
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => {
        const value = row.original.balance;
        return <NumberDiv number={value} symbolType={"coin"} displayZero={true} pClassName="text-xs" blink />;
      },
    },
    {
      header: "Value",
      cell: ({ row }) => {
        const value = row.original.balance * etf.etf.stats.price.usd;
        return <NumberDiv number={value} symbolType={"usd"} displayZero={true} pClassName="text-xs" blink />;
      },
    },
    {
      header: "Percent",
      cell: ({ row }) => {
        let value = (row.original.balance / etfSupply) * 100;
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
