import { EtfImage } from "@/main/components/ui/etf-image";
import { Modal } from "@/main/components/ui/modal";
import { Input } from "@/main/shadcn/components/ui/input";
import { Icons } from "@/main/utils/icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/main/shadcn/components/ui/button";
import { LoadingButton } from "@/main/components/ui/loading-button";
import { CoinImageWithUrl } from "@/main/components/ui/coin-image";
import { TableBody, Table, TableCell, TableHeader, TableRow, TableHead } from "@/main/shadcn/components/ui/table";
import { getExplorerTokenUrl } from "@repo/common/utils/explorer";
import { Progress } from "@/main/shadcn/components/ui/progress";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";
import { isEthAddress } from "@repo/common/utils/address";
import { useHopiumContracts } from "@/main/hooks/use-hopium-contracts/use-hopium-contracts";
import { TOAST } from "@/main/components/ui/toast/toast";
import { distributeEvenly } from "./fns/distribute-evenly";
import { distributeGeometric } from "./fns/distribute-geometric";
import { enrichTokens, needsFetch } from "./fns/enrich-tokens";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const TOTAL_BIPS = 10_000; // 100% in basis points
const emptyToken = { address: "", weight: 0, details: { symbol: "", name: "", imageUrl: "" } };

export type T_Token = {
  address: string;
  weight: number; // stored in bips (e.g. 2500 = 25%)
  details: {
    symbol: string;
    name: string;
    imageUrl: string;
  };
};

export const CreateEtfModal = ({ modalOpen, setModalOpen }: { modalOpen: boolean; setModalOpen: (open: boolean) => void }) => {
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [tokens, setTokens] = useState<T_Token[]>([emptyToken]);
  const inFlight = useRef<boolean>(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { createEtf } = useHopiumContracts({ setLoading });

  const shouldFetch = useMemo(() => tokens.some(needsFetch), [tokens]);

  useEffect(() => {
    if (shouldFetch) void enrichTokens(tokens, setTokens, inFlight);
  }, [shouldFetch, tokens, setTokens, inFlight]);

  const handleCreateEtf = async () => {
    const invalidTokens = tokens.filter((token) => !token.address || token.address === ZERO_ADDRESS || !isEthAddress(token.address));
    if (invalidTokens.length > 0) {
      TOAST.showErrorToast({ description: "Invalid tokens" });
      return;
    }
    const invalidWeights = tokens.filter((token) => token.weight <= 0 || token.weight > TOTAL_BIPS);
    const totalWeight = tokens.reduce((acc, token) => acc + token.weight, 0);
    if (invalidWeights.length > 0 || totalWeight !== TOTAL_BIPS) {
      TOAST.showErrorToast({ description: "Invalid weights" });
      return;
    }
    if (!name || name.length < 3 || name.length > 32) {
      TOAST.showErrorToast({ description: "Invalid name" });
      return;
    }
    if (!ticker || ticker.length < 3 || ticker.length > 32) {
      TOAST.showErrorToast({ description: "Invalid ticker" });
      return;
    }
    if (tokens.length < 2) {
      TOAST.showErrorToast({ description: "At least 2 tokens are required" });
      return;
    }

    await createEtf({ name, ticker, assets: tokens.map((token) => ({ tokenAddress: token.address as `0x${string}`, weightBips: token.weight })) });
    setModalOpen(false);
    setName("");
    setTicker("");
    setTokens([emptyToken]);
  };

  return (
    <Modal title="Create ETF" modalOpen={modalOpen} setModalOpen={setModalOpen} buttonVisible={false} className="sm:max-w-5xl">
      <div className="flex flex-1 overflow-hidden h-[600px] divide-x-2">
        <div className="flex flex-1 flex-col py-2 pr-4 overflow-hidden">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-subtext">Name</p>
              <div className="w-full flex items-center gap-2 bg-bg-900 rounded-base px-3 py-2">
                <Input placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-subtext">Ticker</p>
              <div className="w-full flex items-center gap-2 bg-bg-900 rounded-base px-3 py-2">
                <Input placeholder="Enter ticker" value={ticker} onChange={(e) => setTicker(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-subtext font-medium">Add tokens</p>
            <div className="flex items-center gap-2">
              <Button variant="bg900" className="text-text" size="sm" onClick={() => setTokens((tks) => [...tks, emptyToken])}>
                <Icons.Plus className="size-4.5" />
                <p className="text-sm font-medium">Add</p>
              </Button>
              <Button
                variant="bg900"
                className="text-text"
                size="sm"
                onClick={() => distributeEvenly(setTokens)}
                title="Distribute weights evenly across tokens with addresses"
              >
                {/* pick any icon you like */}
                <Icons.Equal className="size-4.5" />
                <p className="text-sm font-medium">Evenly</p>
              </Button>
              <Button
                variant="bg900"
                className="text-text"
                size="sm"
                onClick={() => distributeGeometric(setTokens, 0.7)}
                title="Geometric / Halving Distribution"
              >
                <Icons.Percent className="size-4.5" />
                <p className="text-sm font-medium">Halving</p>
              </Button>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 mt-4 overflow-y-auto">
            {tokens.map((token, index) => (
              <TokenInput key={index} index={index} tokens={tokens} setTokens={setTokens} />
            ))}
          </div>
        </div>
        <Preview tokens={tokens} name={name} ticker={ticker} handleCreateEtf={handleCreateEtf} loading={loading} />
      </div>
    </Modal>
  );
};

const Preview = ({
  tokens,
  name,
  ticker,
  handleCreateEtf,
  loading,
}: {
  tokens: T_Token[];
  name: string;
  ticker: string;
  handleCreateEtf: () => void;
  loading: string | null;
}) => {
  return (
    <div className="w-[350px] h-full flex flex-col justify-between pl-4 py-2 gap-4 overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <p className="text-sm text-subtext font-medium">Preview</p>
        <div className="flex items-center gap-3 mt-4">
          <EtfImage address={ZERO_ADDRESS} withBox boxClassName="size-9" iconClassName="size-6" />
          <div className="flex flex-col">
            <p className="text-sm font-medium">{name ? name : "ETF Name"}</p>
            <p className="text-sm font-medium text-subtext">{ticker ? ticker : "ETF Ticker"}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-1 overflow-hidden">
          <TokenTable tokens={tokens} />
        </div>
      </div>
      <div className="flex flex-col">
        <LoadingButton className="w-full" loading={loading} onClick={handleCreateEtf}>
          <Icons.Create className="size-4.5" />
          <p className="text-sm font-medium">Create</p>
        </LoadingButton>
      </div>
    </div>
  );
};

const TokenTable = ({ tokens }: { tokens: T_Token[] }) => {
  return (
    <div className="w-full flex-1 overflow-y-auto">
      <div className="w-full h-fit rounded-base overflow-hidden">
        <Table>
          <TableHeader className="border-b-2 border-bg-800">
            <TableRow className="hover:bg-bg-900 bg-bg-900">
              <TableHead className="w-5/12 h-8 pl-3 text-subtext font-medium text-sm">Token</TableHead>
              <TableHead className="w-7/12 h-8 pr-3 text-subtext font-medium text-sm text-right">Target Weight</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tokens.map((token, index) => (token ? <TokenItem key={`${token.address}-${token.details.imageUrl}-${index}`} token={token} /> : null))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const TokenItem = ({ token }: { token: T_Token }) => {
  const percent = (token.weight / 100).toFixed(2); // bips -> percent

  const handleClick = () => {
    const url = getExplorerTokenUrl({ address: token.address, network: COMMON_CONSTANTS.networkSelected });
    window.open(url, "_blank");
  };

  return (
    <TableRow onClick={handleClick} className="cursor-pointer px-4 bg-bg-900 hover:bg-bg-800 border-b-2 border-bg-800">
      <TableCell className="w-5/12 pl-3">
        <div className="flex items-center gap-2.5">
          <CoinImageWithUrl
            key={token.details.imageUrl || token.address} // ensure the image updates when URL changes
            imageUrl={token.details.imageUrl}
            boxClassName="size-8"
          />
          <div className="flex flex-col gap-0 max-w-[6rem]">
            <p className="text-sm font-medium truncate">{token.details.symbol}</p>
            <p className="text-sm font-medium text-subtext truncate">{token.details.name}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="w-7/12 text-right pr-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-subtext">{percent}%</p>
          {/* Progress expects 0..100; pass percent number */}
          <Progress value={token.weight / 100} className="w-full bg-bg-900 h-1.25" progressClassName="bg-main" />
        </div>
      </TableCell>
    </TableRow>
  );
};

const TokenInput = ({ index, tokens, setTokens }: { index: number; tokens: T_Token[]; setTokens: React.Dispatch<React.SetStateAction<T_Token[]>> }) => {
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTokens((prev) => prev.map((t, i) => (i === index ? { ...t, address: value } : t)));
  };

  // input is shown as percent; stored as bips
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = parseFloat(e.target.value); // e.g. "25.5"
    const bips = isNaN(percent) ? 0 : Math.round(percent * 100); // 25.5% -> 2550 bips
    setTokens((prev) => prev.map((t, i) => (i === index ? { ...t, weight: bips } : t)));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="w-9/12">
          <p className="text-sm font-medium text-subtext">Token</p>
          <div className="w-full flex items-center gap-2 bg-bg-900 rounded-base px-3 py-2 mt-2">
            <Input placeholder={ZERO_ADDRESS} value={tokens[index]?.address ?? ""} onChange={handleAddressChange} />
          </div>
        </div>
        <div className="w-3/12">
          <p className="text-sm font-medium text-subtext">Weight</p>
          <div className="w-full flex items-center justify-end gap-2 bg-bg-900 rounded-base px-3 py-2 mt-2">
            <Input
              placeholder="0.00"
              type="number"
              value={(tokens[index]?.weight ?? 0) / 100} // bips -> percent
              onChange={handleWeightChange}
              min={0}
              max={100}
              step="0.01"
            />
            <p className="text-sm font-medium text-subtext">%</p>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Button variant="bg900" className="text-text w-fit px-2 py-1" size="sm" onClick={() => setTokens((prev) => prev.filter((_, i) => i !== index))}>
          <Icons.Trash className="size-3.5" />
          <p className="text-xs font-medium">Remove</p>
        </Button>
      </div>
    </div>
  );
};
