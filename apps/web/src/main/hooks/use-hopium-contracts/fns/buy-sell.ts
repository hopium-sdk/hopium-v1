import { HOPIUM } from "@/main/lib/hopium";
import { C_Etf } from "@repo/convex/schema";
import { Chain } from "viem";
import { useWriteContract } from "wagmi";
import { parseEther, parseUnits } from "viem";
import { TOAST } from "@/main/components/ui/toast/toast";
import { NUMBERS_WEB } from "@/main/utils/numbers";

type T_BuySellFn = {
  etf: C_Etf;
  isBuy: boolean;
  inputAmount: number;
  savedCoupon: string;
  setLoading: (loading: string | null) => void;
  address: `0x${string}` | undefined;
  chain: Chain | undefined;
  writeContractAsync: ReturnType<typeof useWriteContract>["writeContractAsync"];
};

export const _buySellFn = async ({ etf, isBuy, inputAmount, savedCoupon, setLoading, address, chain, writeContractAsync }: T_BuySellFn) => {
  const etfRouterAddress = await HOPIUM.contracts.addresses.etfRouter();

  setLoading("Confirm tx...");
  let hash: `0x${string}`;

  console.log("savedCoupon", savedCoupon);
  if (isBuy) {
    const amount = parseEther(inputAmount.toString());
    hash = await writeContractAsync({
      abi: HOPIUM.contracts.abis.etfRouter,
      address: etfRouterAddress,
      functionName: "mintEtfTokens",
      args: [BigInt(etf.details.etfId), address as `0x${string}`, savedCoupon.toUpperCase()],
      value: amount,
      chain,
      account: address,
    });
  } else {
    const amount = parseUnits(inputAmount.toString(), 18);
    hash = await writeContractAsync({
      abi: HOPIUM.contracts.abis.etfRouter,
      address: etfRouterAddress,
      functionName: "redeemEtfTokens",
      args: [BigInt(etf.details.etfId), amount, address as `0x${string}`, savedCoupon.toUpperCase()],
      chain,
      account: address,
    });
  }

  return hash;
};

export const _buySellToastFn = ({ etf, isBuy, inputAmount }: { etf: C_Etf; isBuy: boolean; inputAmount: number }) => {
  TOAST.showSuccessToast({
    title: isBuy ? "Buy successful" : "Sell successful",
    description: isBuy
      ? `You successfully bought ${etf.details.ticker} for ${NUMBERS_WEB.formatNumber(inputAmount)} ETH`
      : `You successfully sold ${NUMBERS_WEB.formatNumber(inputAmount)} ${etf.details.ticker}`,
  });
};
