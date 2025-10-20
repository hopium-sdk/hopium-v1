import { RealtimeTable } from "@/main/components/ui/table";
import { useQuery } from "convex/react";
import { T_EtfTokenPosition } from "@repo/convex/schema";
import { CONVEX } from "@/main/lib/convex";
import { getPositionsColumns } from "./components/columns";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";

export const EtfPositions = () => {
  const router = useRouter();
  const { address } = useAccount();
  const result: T_EtfTokenPosition[] | undefined = useQuery(
    CONVEX.api.fns.etfToken.getAllPositionsByAddress.default,
    address
      ? {
          userAddress: address as `0x${string}`,
        }
      : "skip"
  );

  const columns = getPositionsColumns();

  const handleClick = (row: Row<T_EtfTokenPosition>) => {
    router.push(`/etf/${row.original.etfId}`);
  };

  return (
    <RealtimeTable
      queryMode="query"
      columns={columns}
      queryData={!address ? [] : result}
      empty={{ containerLabelVariant: "positions" }}
      handleClick={handleClick}
    />
  );
};
