"use client";
import { Icons } from "@/main/utils/icons";
import { getActivityColumns } from "./components/columns";
import { RealtimeTable } from "@/main/components/ui/table";
import { usePaginatedQuery } from "convex/react";
import { CONVEX } from "@/main/lib/convex";
import { useAccount } from "wagmi";

const PAGE_SIZE = 20;

export const AffiliateActivity = () => {
  const { address } = useAccount();

  const results = usePaginatedQuery(CONVEX.api.fns.affiliate.getActivityByOwner.default, address ? { owner: address } : "skip", { initialNumItems: PAGE_SIZE });

  const columns = getActivityColumns();

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-bg">
      <div className="flex items-center justify-between px-6 h-10 border-b-2">
        <div className="flex items-center gap-2">
          <Icons.Activity className="size-4" />
          <p className="text-sm font-medium">Activity</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <RealtimeTable queryMode="paginated" columns={columns} queryResult={results} pageSize={PAGE_SIZE} empty={{ containerLabelVariant: "activity" }} />
      </div>
    </div>
  );
};
