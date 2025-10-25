import { RealtimeTable } from "@/main/components/ui/table";
import { usePaginatedQuery } from "convex/react";
import { getActivityColumns } from "./components/columns";
import { C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { CONVEX } from "@/main/lib/convex";

const PAGE_SIZE = 5;

export const EtfActivity = ({ etf }: { etf: C_EtfWithAssetsAndPools }) => {
  const result = usePaginatedQuery(CONVEX.api.fns.etfToken.getEtfTokenActivity.default, { etfId: etf.etf.details.etfId }, { initialNumItems: PAGE_SIZE });

  const columns = getActivityColumns();

  return (
    <RealtimeTable
      queryMode="paginated"
      columns={columns}
      queryResult={result}
      pageSize={PAGE_SIZE}
      empty={{ containerLabelVariant: "activity" }}
      isBlinkable
      isPausable
    />
  );
};
