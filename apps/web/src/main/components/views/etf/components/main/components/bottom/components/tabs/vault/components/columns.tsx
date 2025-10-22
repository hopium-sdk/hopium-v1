"use client";
import { ColumnDef } from "@tanstack/react-table";
import { NumberDiv } from "@/main/components/ui/number-div";
import { C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { CoinImage } from "@/main/components/ui/coin-image";
import { T_EtfVaultToken } from "../vault";
import { Progress } from "@/main/shadcn/components/ui/progress";
import { calcCurrentWeight } from "@/main/utils/calc-etf";
import { normalizeAddress } from "@repo/common/utils/address";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";

export const getVaultColumns = ({ etf, ethUsdPrice }: { etf: C_EtfWithAssetsAndPools; ethUsdPrice: number }) => {
  const allColumns: ColumnDef<T_EtfVaultToken>[] = [
    {
      accessorKey: "tokenAddress",
      header: "Token",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <CoinImage address={row.original.tokenAddress} boxClassName="size-8" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{row.original.tokenSymbol}</p>
              </div>
              <p className="text-sm font-medium text-subtext">{row.original.tokenName}</p>
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
        return <NumberDiv number={value} symbolType={"coin"} displayZero={true} pClassName="text-sm" blink />;
      },
    },
    // {
    //   accessorKey: "price",
    //   header: "Price",
    //   cell: ({ row }) => {
    //     const wethAddress = normalizeAddress(COMMON_CONSTANTS.addresses.weth[COMMON_CONSTANTS.networkSelected]);
    //     let poolPrice = 0;
    //     if (row.original.tokenAddress === wethAddress) {
    //       poolPrice = ethUsdPrice;
    //     } else {
    //       const pool = etf.pools.find((pool) => pool.details.token0 === row.original.tokenAddress || pool.details.token1 === row.original.tokenAddress);
    //       if (!pool) return 0;
    //       poolPrice = pool.stats.price.usd;
    //     }
    //     return <NumberDiv number={poolPrice} symbolType={"usd"} displayZero={true} pClassName="text-xs" blink />;
    //   },
    // },
    {
      header: "Value",
      cell: ({ row }) => {
        let value = 0;
        const wethAddress = normalizeAddress(COMMON_CONSTANTS.addresses.weth[COMMON_CONSTANTS.networkSelected]);
        let poolPrice = 0;
        if (row.original.tokenAddress === wethAddress) {
          poolPrice = ethUsdPrice;
        } else {
          const pool = etf.pools.find((pool) => pool.details.token0 === row.original.tokenAddress || pool.details.token1 === row.original.tokenAddress);
          if (!pool) return 0;
          poolPrice = pool.stats.price.usd;
        }
        value = row.original.balance * poolPrice;
        return <NumberDiv number={value} symbolType={"usd"} displayZero={true} pClassName="text-sm" blink />;
      },
    },
    {
      header: "Current Weight",
      cell: ({ row }) => {
        let value = calcCurrentWeight({ etf, assetAddress: row.original.tokenAddress, ethUsdPrice });
        if (isNaN(value) || value == Infinity) {
          value = 0;
        }
        return (
          <div className="flex flex-col items-start gap-1">
            <NumberDiv number={value} symbolType={"percent"} displayZero={true} pClassName="text-sm" blink />
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
            <NumberDiv number={value} symbolType={"percent"} displayZero={true} pClassName="text-sm" />
            <Progress value={value} className="w-2/3 bg-bg-900 h-1.25" progressClassName="bg-main" />
          </div>
        );
      },
    },
  ];

  return allColumns;
};
