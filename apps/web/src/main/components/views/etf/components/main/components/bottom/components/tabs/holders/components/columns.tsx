"use client";
import { ColumnDef } from "@tanstack/react-table";
import { NumberDiv } from "@/main/components/ui/number-div";
import { Avatar } from "@/main/components/ui/avatar";
import { Progress } from "@/main/shadcn/components/ui/progress";
import { C_Etf, T_Holder } from "@repo/convex/schema";

export const getHoldersColumns = ({ etf, etfSupply }: { etf: C_Etf; etfSupply: number }) => {
  const allColumns: ColumnDef<T_Holder>[] = [
    {
      header: "Rank",
      cell: ({ row }) => {
        return <p className="text-subtext">{row.index + 1}</p>;
      },
    },
    {
      accessorKey: "user_address",
      header: "Holder",
      cell: ({ row }) => {
        return <Avatar address={row.original.address} />;
      },
    },
    {
      accessorKey: "balance.total_coin_amount",
      header: "Total Coin",
      cell: ({ row }) => {
        const value = row.original.amount;
        return <NumberDiv number={value} symbolType={"coin"} displayZero={true} color={"text-green-500"} />;
      },
    },
    {
      header: "Value",
      cell: ({ row }) => {
        const value = row.original.amount * etf.stats.price.usd;
        return <NumberDiv number={value} symbolType={"usd"} displayZero={true} color={"text-green-500"} />;
      },
    },
    {
      header: "Percent",
      cell: ({ row }) => {
        let value = (row.original.amount / etfSupply) * 100;
        if (isNaN(value) || value == Infinity) {
          value = 0;
        }
        return (
          <div className="flex flex-col items-start gap-1">
            <NumberDiv number={value} symbolType={"percent"} displayZero={true} color={"text-subtext"} />
            <Progress value={value} className="w-2/3 bg-bg-900 h-1.25" progressClassName="bg-main" />
          </div>
        );
      },
    },
  ];

  return allColumns;
};
