"use client";
import { CONVEX } from "@/main/lib/convex";
import { PaginatedQueryReference, usePaginatedQuery } from "convex/react";
import { T_EtfListOption, C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { RealtimeTable } from "../../ui/table";
import { getEtfListColumns } from "./components/columns";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { LoadingDiv } from "../../ui/loading-div";

const PAGE_SIZE = 20;

type T_EtfsList = {
  type: "list" | "tag" | "search";
  query: string;
};

export const EtfsList = ({ type, query }: T_EtfsList) => {
  const router = useRouter();

  const params = {
    list: {
      fn: CONVEX.api.fns.etf.getEtfList.default,
      args: { sortBy: query as T_EtfListOption },
    },
    tag: {
      fn: CONVEX.api.fns.etf.getEtfListByTag.default,
      args: { tag: query },
    },
    search: {
      fn: CONVEX.api.fns.etf.search.default,
      args: { searchTerm: query },
    },
  };

  const result = usePaginatedQuery(params[type].fn as PaginatedQueryReference, params[type].args, {
    initialNumItems: PAGE_SIZE,
  });

  const columns = getEtfListColumns();

  const handleClick = (row: Row<C_EtfWithAssetsAndPools>) => {
    router.push(`/etf/${row.original.etf.details.etfId}`);
  };

  if (result === undefined) {
    return <LoadingDiv />;
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden lg:rounded-box bg-bg">
      <RealtimeTable<C_EtfWithAssetsAndPools, string, typeof CONVEX.api.fns.etf.getEtfList.default>
        queryMode="paginated"
        queryResult={result}
        pageSize={PAGE_SIZE}
        columns={columns}
        empty={{ containerLabelVariant: type === "search" ? "search" : "default", containerShowSubtext: true }}
        loading={{ type: "spinner" }}
        getRowClassName={() => "cursor-pointer"}
        handleClick={handleClick}
      />
    </div>
  );
};
