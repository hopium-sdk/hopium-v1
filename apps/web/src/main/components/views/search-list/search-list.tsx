"use client";
import { CONVEX } from "@/main/lib/convex";
import { useQuery } from "convex/react";
import { C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { RealtimeTable } from "../../ui/table";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { getEtfListColumns } from "../etfs-list/components/columns";

export const SearchList = ({ query }: { query: string }) => {
  const router = useRouter();
  const result = useQuery(CONVEX.api.fns.etf.search.default, query ? { searchTerm: query } : "skip");

  const columns = getEtfListColumns();

  const handleClick = (row: Row<C_EtfWithAssetsAndPools>) => {
    router.push(`/etf/${row.original.etf.details.etfId}`);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <RealtimeTable<C_EtfWithAssetsAndPools, string, typeof CONVEX.api.fns.etf.getEtfList.default>
        queryMode="query"
        queryData={result}
        columns={columns}
        empty={{ containerLabelVariant: "search", containerShowSubtext: true }}
        loadingNumRows={14}
        loadingRowHeight="h-12"
        getRowClassName={() => "cursor-pointer"}
        handleClick={handleClick}
      />
    </div>
  );
};
