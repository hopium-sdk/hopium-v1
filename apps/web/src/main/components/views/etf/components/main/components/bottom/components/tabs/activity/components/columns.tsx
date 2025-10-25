"use client";
import { ColumnDef } from "@tanstack/react-table";
import { C_EtfTokenTransfer } from "@repo/convex/schema";
import { Avatar } from "@/main/components/ui/avatar";
import { Timestamp } from "@/main/components/ui/timestamp";
import { NumberDiv } from "@/main/components/ui/number-div";
import { Icons } from "@/main/utils/icons";
import { SubscriptDiv } from "@/main/components/ui/subscript-div";
import { cn } from "@/main/shadcn/lib/utils";
import { getExplorerTxHashUrl } from "@repo/common/utils/explorer";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const colors = {
  Buy: { bg: "bg-buy-900", text: "text-buy" },
  Sell: { bg: "bg-sell-900", text: "text-sell" },
  Transfer: { bg: "bg-main-900", text: "text-main" },
};
export const getActivityColumns = () => {
  const allColumns: ColumnDef<C_EtfTokenTransfer>[] = [
    {
      header: "Type",
      cell: ({ row }) => {
        let type = "Buy";
        if (row.original.fromAddress === ZERO_ADDRESS) {
          type = "Buy";
        } else if (row.original.toAddress === ZERO_ADDRESS) {
          type = "Sell";
        } else {
          type = "Transfer";
        }

        return (
          <div
            className={cn(
              "w-fit flex items-center gap-2 px-3 py-1 rounded-full",
              colors[type as keyof typeof colors].bg,
              colors[type as keyof typeof colors].text
            )}
          >
            <SubscriptDiv
              baseItem={<Icons.Trade className="size-4.5" />}
              subscriptItem={<p className="text-sm font-medium">{type == "Buy" ? "+" : type == "Sell" ? "-" : ""}</p>}
            />
            <p className="text-sm font-medium">{type}</p>
          </div>
        );
      },
    },
    {
      header: "Maker",
      cell: ({ row }) => {
        let maker = row.original.fromAddress;
        if (row.original.fromAddress === ZERO_ADDRESS) {
          maker = row.original.toAddress;
        } else if (row.original.toAddress === ZERO_ADDRESS) {
          maker = row.original.fromAddress;
        } else {
          maker = row.original.fromAddress;
        }
        return <Avatar address={maker} withLinkIcon />;
      },
    },
    {
      header: "Token",
      cell: ({ row }) => {
        const value = row.original.transferAmount;
        return <NumberDiv number={value} symbolType={"coin"} displayZero={true} pClassName="text-sm" />;
      },
    },
    {
      header: "Value",
      cell: ({ row }) => {
        const value = row.original.transferAmount * row.original.etfPrice.usd;
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
