"use client";
import { CONVEX } from "@/main/lib/convex";
import { usePaginatedQuery } from "convex/react";
import { T_EtfListOption, C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { RealtimeTable } from "../../ui/table";
import { getEtfListColumns } from "./components/columns";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
const PAGE_SIZE = 20;

export const EtfsList = ({ sortBy }: { sortBy: T_EtfListOption }) => {
  const router = useRouter();
  const result = usePaginatedQuery(CONVEX.api.fns.etf.getEtfList.default, { sortBy }, { initialNumItems: PAGE_SIZE });

  const columns = getEtfListColumns();

  const handleClick = (row: Row<C_EtfWithAssetsAndPools>) => {
    router.push(`/etf/${row.original.etf.details.etfId}`);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden border rounded-md bg-bg">
      <RealtimeTable<C_EtfWithAssetsAndPools, string, typeof CONVEX.api.fns.etf.getEtfList.default>
        queryMode="paginated"
        queryResult={result}
        pageSize={PAGE_SIZE}
        columns={columns}
        empty={{ containerLabelVariant: "default", containerShowSubtext: true }}
        loadingNumRows={14}
        loadingRowHeight="h-12"
        getRowClassName={() => "cursor-pointer"}
        handleClick={handleClick}
      />
    </div>
  );
};
