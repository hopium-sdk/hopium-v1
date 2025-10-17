import { RealtimeTable } from "@/main/components/ui/table";
import { useQuery } from "convex/react";
import { getHoldersColumns } from "./components/columns";
import { C_Etf, T_EtfTokenHolder } from "@repo/convex/schema";
import { CONVEX } from "@/main/lib/convex";
import { useEffect, useState } from "react";
import { HOPIUM } from "@/main/lib/hopium";
import { formatUnits } from "viem";

export const EtfHolders = ({ etf }: { etf: C_Etf }) => {
  const [etfSupply, setEtfSupply] = useState<number>(0);
  const result: T_EtfTokenHolder[] | undefined = useQuery(CONVEX.api.fns.etfToken.getTokenHolders.default, {
    tokenAddress: etf.contracts.etfTokenAddress as `0x${string}`,
  });

  const columns = getHoldersColumns({ etf, etfSupply });

  const fetchEtfSupply = async () => {
    const supply = await HOPIUM.fns.erc20.fetchTotalSupply({ tokenAddress: etf.contracts.etfTokenAddress as `0x${string}` });
    setEtfSupply(Number(formatUnits(supply, 18)));
  };

  useEffect(() => {
    fetchEtfSupply();
  }, [etf, result]);

  return <RealtimeTable queryMode="query" columns={columns} queryData={result} emptyType="container" emptyContainerLabelVariant={"holders"} />;
};
