import { RealtimeTable } from "@/main/components/ui/table";
import { C_Etf, C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { getVaultColumns } from "./components/columns";
import { usePrices } from "@/main/wrappers/components/prices-provider";
import { getExplorerAddressUrl } from "@repo/common/utils/explorer";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";

export type T_EtfVaultToken = C_Etf["details"]["assets"][number] & {
  tokenName: string;
  tokenSymbol: string;
};

export const EtfVault = ({ etf }: { etf: C_EtfWithAssetsAndPools }) => {
  const { ethUsdPrice } = usePrices();

  const result: T_EtfVaultToken[] = etf.etf.details.assets.map((asset) => {
    const assetInfo = etf.assets.find((a) => a.address === asset.tokenAddress);
    return {
      ...asset,
      tokenName: assetInfo?.name ?? "",
      tokenSymbol: assetInfo?.symbol ?? "",
    };
  });

  const columns = getVaultColumns({ etf, ethUsdPrice });

  const handleClick = () => {
    const addressUrl = getExplorerAddressUrl({ address: etf.etf.contracts.etfVaultAddress, network: COMMON_CONSTANTS.networkSelected });
    const url = addressUrl + "#asset-tokens";
    window.open(url, "_blank");
  };

  return <RealtimeTable queryMode="query" columns={columns} queryData={result} empty={{ containerLabelVariant: "positions" }} handleClick={handleClick} />;
};
