import { RealtimeTable } from "@/main/components/ui/table";
import { C_Etf, T_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { getVaultColumns } from "./components/columns";

export type T_EtfVaultToken = C_Etf["details"]["assets"][number] & {
  tokenName: string;
  tokenSymbol: string;
};

export const EtfVault = ({ etf }: { etf: T_EtfWithAssetsAndPools }) => {
  const result: T_EtfVaultToken[] = etf.etf.details.assets.map((asset) => {
    const assetInfo = etf.assets.find((a) => a.address === asset.tokenAddress);
    return {
      ...asset,
      tokenName: assetInfo?.name ?? "",
      tokenSymbol: assetInfo?.symbol ?? "",
    };
  });

  const columns = getVaultColumns({ etf });

  return <RealtimeTable queryMode="query" columns={columns} queryData={result} emptyType="container" emptyContainerLabelVariant={"positions"} />;
};
