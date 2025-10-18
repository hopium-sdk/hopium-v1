"use client";
import { CoinImage } from "@/main/components/ui/coin-image";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";
import { Table, TableCell, TableRow, TableHead, TableHeader, TableBody } from "@/main/shadcn/components/ui/table";
import { Icons } from "@/main/utils/icons";
import { getExplorerTokenUrl } from "@repo/common/utils/explorer";
import { C_Asset, T_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { SidebarBox } from "../ui/box";
import { Progress } from "@/main/shadcn/components/ui/progress";

export type T_AssetWithWeight = C_Asset & {
  weightBips: number;
};

export const EtfAssets = ({ etf }: { etf: T_EtfWithAssetsAndPools }) => {
  const assetsWithWeight: T_AssetWithWeight[] =
    etf.assets.map((asset) => ({
      ...asset,
      weightBips: etf.etf.details.assets?.find((a) => a.tokenAddress === asset.address)?.targetWeightBips || 0,
    })) || [];

  return (
    <SidebarBox title="Underlying Assets" icon={<Icons.Assets />}>
      <div className="w-full border rounded-md">
        <TokenTable assetsWithWeight={assetsWithWeight} />
      </div>
    </SidebarBox>
  );
};

const TokenTable = ({ assetsWithWeight }: { assetsWithWeight: T_AssetWithWeight[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-5/12 h-8 pl-3 text-subtext font-medium text-2xs">Token</TableHead>
          <TableHead className="w-7/12 h-8 pr-3 text-subtext font-medium text-2xs text-right">Target Weight</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assetsWithWeight.map((asset, index) => (
          <AssetItem key={index} index={index} asset={asset} />
        ))}
      </TableBody>
    </Table>
  );
};
const AssetItem = ({ asset, index }: { asset: T_AssetWithWeight; index: number }) => {
  const percent = (asset.weightBips / 100).toFixed(2);

  const handleClick = () => {
    const url = getExplorerTokenUrl({ address: asset.address, network: COMMON_CONSTANTS.networkSelected });
    window.open(url, "_blank");
  };

  return (
    <TableRow key={index} onClick={handleClick} className="cursor-pointer px-4">
      <TableCell className="w-5/12 pl-3">
        <div className="flex items-center gap-2">
          <CoinImage address={asset.address} boxClassName="size-6" />
          <div className="flex flex-col gap-0 max-w-[6rem]">
            <p className="text-2xs font-medium truncate">{asset.symbol}</p>
            <p className="text-2xs font-medium text-subtext truncate">{asset.name}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="w-7/12 text-right pr-3">
        <div className="flex flex-col gap-1">
          <p className="text-2xs font-medium text-subtext">{percent}%</p>

          <Progress value={parseFloat(percent)} className="w-full bg-bg-900 h-1.25" progressClassName="bg-main" />
        </div>
      </TableCell>
    </TableRow>
  );
};
