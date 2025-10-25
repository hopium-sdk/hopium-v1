import { RealtimeTable } from "@/main/components/ui/table";
import { usePaginatedQuery } from "convex/react";
import { CONVEX } from "@/main/lib/convex";
import { getFeeTransfersColumns } from "./components/columns";

const PAGE_SIZE = 20;

export const AdminFeeTransfers = () => {
  const result = usePaginatedQuery(CONVEX.api.fns.platformFees.getPlatformFeeTransfers.default, {}, { initialNumItems: PAGE_SIZE });

  const columns = getFeeTransfersColumns();

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
