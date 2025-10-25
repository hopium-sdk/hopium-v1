import { HOPIUM } from "@/main/lib/hopium";
import { Chain } from "viem";
import { useWriteContract } from "wagmi";
import { TOAST } from "@/main/components/ui/toast/toast";

export type T_CreateEtfFn = {
  name: string;
  ticker: string;
  assets: {
    tokenAddress: `0x${string}`;
    weightBips: number;
  }[];
  setLoading: (loading: string | null) => void;
  address: `0x${string}` | undefined;
  chain: Chain | undefined;
  writeContractAsync: ReturnType<typeof useWriteContract>["writeContractAsync"];
};

export const _createEtfFn = async ({ name, ticker, assets, setLoading, address, chain, writeContractAsync }: T_CreateEtfFn) => {
  const etfFactoryAddress = await HOPIUM.contracts.addresses.etfFactory();

  setLoading("Calculating tx fee...");
  const txFee = await HOPIUM.fns.etfFactory.fetchEtfSeedPrice();

  setLoading("Confirm tx...");
  const hash: `0x${string}` = await writeContractAsync({
    abi: HOPIUM.contracts.abis.etfFactory,
    address: etfFactoryAddress,
    functionName: "createEtf",
    args: [{ name, ticker, assets }],
    chain,
    account: address,
    value: txFee,
  });

  return hash;
};

export const _createEtfToastFn = ({ name, ticker }: { name: string; ticker: string }) => {
  TOAST.showSuccessToast({
    title: "Etf created successfully",
    description: `You successfully created etf : ${name} - ${ticker}`,
  });
};
