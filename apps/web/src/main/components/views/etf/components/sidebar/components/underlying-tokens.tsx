"use client";
import { CoinImage } from "@/main/components/ui/coin-image";
import { CONSTANTS } from "@/main/lib/constants";
import { CONVEX } from "@/main/lib/convex";
import { Table, TableCell, TableRow, TableHead, TableHeader, TableBody } from "@/main/shadcn/components/ui/table";
import { Icons } from "@/main/utils/icons";
import { getExplorerTokenUrl } from "@repo/common/utils/explorer";
import { C_Etf, T_HoldingToken } from "@repo/convex/schema";
import { useQuery } from "convex/react";
import { SidebarBox } from "../ui/box";

type T_UnderlyingToken = T_HoldingToken & {
  weightBips: number;
};

export const EtfUnderlyingTokens = ({ etf }: { etf: C_Etf }) => {
  const tokens = useQuery(CONVEX.api.fns.etf.getEtfUnderlyingTokens.default, { indexId: etf.index.indexId });

  const underlyingTokens: T_UnderlyingToken[] =
    tokens?.map((token) => ({
      ...token,
      weightBips: etf.index.holdings?.find((holding) => holding.tokenAddress === token.address)?.weightBips || 0,
    })) || [];

  return (
    <SidebarBox title="Underlying Assets" icon={<Icons.Assets className="text-subtext" />}>
      <div className="w-full border rounded-md">
        <TokenTable underlyingTokens={underlyingTokens} />
      </div>
    </SidebarBox>
  );
};

const TokenTable = ({ underlyingTokens }: { underlyingTokens: T_UnderlyingToken[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-5/12 h-8 pl-3 text-subtext font-medium text-xs">Token</TableHead>
          <TableHead className="w-7/12 h-8 pr-3 text-subtext font-medium text-xs text-right">Weight</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {underlyingTokens.map((token, index) => (
          <UnderlyingToken key={index} index={index} token={token} />
        ))}
      </TableBody>
    </Table>
  );
};
const UnderlyingToken = ({ token, index }: { token: T_UnderlyingToken; index: number }) => {
  const percent = (token.weightBips / 100).toFixed(2);

  const handleClick = () => {
    const url = getExplorerTokenUrl({ address: token.address, network: CONSTANTS.networkSelected });
    window.open(url, "_blank");
  };

  return (
    <TableRow key={index} onClick={handleClick} className="cursor-pointer px-4">
      <TableCell className="w-5/12 pl-3">
        <div className="flex items-center gap-2">
          <CoinImage address={token.address} boxClassName="size-6" />
          <div className="flex flex-col gap-0">
            <p className="text-2xs font-medium">{token.symbol}</p>
            <p className="text-2xs font-medium text-subtext">{token.name}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="w-7/12 text-right pr-3">
        <div className="flex flex-col gap-1">
          <p className="text-2xs font-medium text-subtext">{percent}%</p>

          <div className="w-full h-1 rounded-full flex items-center overflow-hidden">
            <div className="h-full bg-main" style={{ width: `${percent}%` }} />
            <div className="h-full bg-bg-900" style={{ width: `${100 - parseFloat(percent)}%` }} />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
