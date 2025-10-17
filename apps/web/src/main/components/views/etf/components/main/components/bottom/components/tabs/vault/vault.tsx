import { RealtimeTable } from "@/main/components/ui/table";
import { C_Etf, C_Asset } from "@repo/convex/schema";
import { getVaultColumns } from "./components/columns";

export type T_EtfVaultToken = C_Etf["details"]["assets"][number] & {
  tokenName: string;
  tokenSymbol: string;
};

export const EtfVault = ({ etf, assets }: { etf: C_Etf; assets: C_Asset[] }) => {
  const result: T_EtfVaultToken[] = etf.details.assets.map((asset) => {
    const assetInfo = assets.find((a) => a.address === asset.tokenAddress);
    return {
      ...asset,
      tokenName: assetInfo?.name ?? "",
      tokenSymbol: assetInfo?.symbol ?? "",
    };
  });

  const columns = getVaultColumns({ etf });

  return <RealtimeTable queryMode="query" columns={columns} queryData={result} emptyType="container" emptyContainerLabelVariant={"positions"} />;
};
