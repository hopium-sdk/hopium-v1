"use client";
import { ColumnDef } from "@tanstack/react-table";
import { T_PlatformFeeTransferWithEtf } from "@repo/convex/schema";
import { Timestamp } from "@/main/components/ui/timestamp";
import { NumberDiv } from "@/main/components/ui/number-div";
import { getExplorerTxHashUrl } from "@repo/common/utils/explorer";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";
import { EtfImage } from "@/main/components/ui/etf-image";

export const getFeeTransfersColumns = () => {
  const allColumns: ColumnDef<T_PlatformFeeTransferWithEtf>[] = [
    {
      header: "Token",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <EtfImage address={row.original.etf?.contracts.etfTokenAddress ?? ""} withBox boxClassName="size-9" iconClassName="size-6" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{row.original.etf?.details.ticker}</p>
              </div>
              <p className="text-sm font-medium text-subtext">{row.original.etf?.details.name}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Amount",
      cell: ({ row }) => {
        const value = row.original.amount.eth;
        return <NumberDiv number={value} symbolType={"eth"} displayZero={true} pClassName="text-sm" />;
      },
    },
    {
      header: "Value",
      cell: ({ row }) => {
        const value = row.original.amount.usd;
        return <NumberDiv number={value} symbolType={"usd"} displayZero={true} pClassName="text-sm" />;
      },
    },
    {
      header: "Time",
      cell: ({ row }) => {
        return (
          <Timestamp
            timestamp={row.original.timestamp}
            withLink={true}
            linkHref={getExplorerTxHashUrl({ txHash: row.original.txHash, network: COMMON_CONSTANTS.networkSelected })}
          />
        );
      },
    },
  ];

  return allColumns;
};
