"use client";
import { ColumnDef } from "@tanstack/react-table";
import { NumberDiv } from "@/main/components/ui/number-div";
import { C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { EtfImage } from "@/main/components/ui/etf-image";
import { cn } from "@/main/shadcn/lib/utils";
import { Timestamp } from "@/main/components/ui/timestamp";
import { CoinImage } from "@/main/components/ui/coin-image";
import Link from "next/link";

export const getEtfListColumns = () => {
  const allColumns: ColumnDef<C_EtfWithAssetsAndPools>[] = [
    {
      header: "Token",
      cell: ({ row }) => {
        return (
          <Link href={`/etf/${row.original.etf.details.etfId}`} className="flex items-center gap-3">
            <EtfImage address={row.original.etf.contracts.etfTokenAddress} withBox boxClassName="size-9" iconClassName="size-6" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{row.original.etf.details.ticker}</p>
              </div>
              <p className="text-sm font-medium text-subtext">{row.original.etf.details.name}</p>
            </div>
          </Link>
        );
      },
    },

    {
      header: "Price",
      cell: ({ row }) => {
        const value = row.original.etf.stats.price.usd;
        return <NumberDiv number={value} symbolType={"usd"} pClassName="text-sm text-main" blink />;
      },
    },
    {
      header: "TVL",
      cell: () => {
        const value = 0;
        return <NumberDiv number={value} symbolType={"usd"} pClassName="text-sm" blink />;
      },
    },
    {
      header: "Volume",
      cell: ({ row }) => {
        const value = row.original.etf.stats.volume.usd;
        return <NumberDiv number={value} symbolType={"usd"} pClassName="text-sm" blink />;
      },
    },
    {
      header: "Liquidity",
      cell: ({ row }) => {
        const value = row.original.etf.stats.assetsLiquidityUsd;
        return <NumberDiv number={value} symbolType={"usd"} pClassName="text-sm" blink />;
      },
    },
    {
      header: "Mkt Cap",
      cell: ({ row }) => {
        const value = row.original.etf.stats.assetsMcapUsd;
        return <NumberDiv number={value} symbolType={"usd"} pClassName="text-sm" blink />;
      },
    },

    {
      header: "Assets",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            {row.original.etf.details.assets.map((etfAsset, index) => {
              return (
                <div
                  key={index}
                  className={cn(index !== 0 ? "-ml-3" : "")} // overlap each subsequent image
                  style={{ zIndex: row.original.etf.details.assets.length - index }}
                >
                  <CoinImage address={etfAsset.tokenAddress} boxClassName="size-6.5 rounded-full" />
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      header: "Created",
      cell: ({ row }) => {
        const value = row.original.etf.details.createdAt;
        return <Timestamp timestamp={value} withLink={false} pClassName="text-sm font-medium" />;
      },
    },
  ];

  return allColumns;
};
