"use client";
import { ColumnDef } from "@tanstack/react-table";
import { C_AffiliateTransfers } from "@repo/convex/schema";
import { Timestamp } from "@/main/components/ui/timestamp";
import { NumberDiv } from "@/main/components/ui/number-div";
import { getExplorerTxHashUrl } from "@repo/common/utils/explorer";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";

export const getActivityColumns = () => {
  const allColumns: ColumnDef<C_AffiliateTransfers>[] = [
    {
      header: "Coupon",
      cell: ({ row }) => {
        return <p className="text-sm font-medium">{row.original.affiliateCode}</p>;
      },
    },
    {
      header: "Reward",
      cell: ({ row }) => {
        const value = row.original.ethAmount;
        return <NumberDiv number={value} symbolType={"eth"} displayZero={true} pClassName="text-sm" className="text-buy" />;
      },
    },
    {
      header: "Time",
      cell: ({ row }) => {
        const value = row.original.timestamp;
        return (
          <Timestamp
            timestamp={value}
            withLink={true}
            linkHref={getExplorerTxHashUrl({ txHash: row.original.txHash, network: COMMON_CONSTANTS.networkSelected })}
            pClassName="text-sm font-medium"
            className="text-text"
          />
        );
      },
    },
  ];

  return allColumns;
};
