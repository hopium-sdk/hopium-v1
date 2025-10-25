"use client";
import { ColumnDef } from "@tanstack/react-table";
import { C_Affiliate } from "@repo/convex/schema";
import { Timestamp } from "@/main/components/ui/timestamp";
import { Icons } from "@/main/utils/icons";

export const getCreatedCouponsColumns = ({
  setShareLinkModalOpen,
  setShareCode,
}: {
  setShareLinkModalOpen: (open: boolean) => void;
  setShareCode: (code: string) => void;
}) => {
  const allColumns: ColumnDef<C_Affiliate>[] = [
    {
      header: "Coupon",
      cell: ({ row }) => {
        return <p className="text-sm font-medium">{row.original.affiliateCode}</p>;
      },
    },
    {
      header: "Created",
      cell: ({ row }) => {
        const value = row.original.createdAt;
        return <Timestamp timestamp={value} withLink={false} pClassName="text-sm font-medium" className="text-text" />;
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div
            className="flex items-center gap-1.5 cursor-pointer text-main hover:opacity-70"
            onClick={() => {
              setShareCode(row.original.affiliateCode);
              setShareLinkModalOpen(true);
            }}
          >
            <Icons.Share className="size-4.5" />
            <p className="text-sm font-medium">Share</p>
          </div>
        );
      },
    },
  ];

  return allColumns;
};
