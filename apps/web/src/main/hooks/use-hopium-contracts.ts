"use client";
import { HOPIUM } from "../lib/hopium";
import { useAddress } from "./use-address";
import { parseEther, parseUnits } from "viem";
import { useAccount, useWriteContract, useSwitchChain } from "wagmi";
import { getChainId, waitForTx } from "../lib/wagmi";
import { CONSTANTS } from "../lib/constants";
import { TOAST } from "../components/ui/toast/toast";
import { C_Etf } from "@repo/convex/schema";
import { normalizeError } from "../utils/error";

export const useHopiumContracts = ({ setLoading }: { setLoading: (loading: string | null) => void }) => {
  const { walletAddress } = useAddress();
  const { chain } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();
  const chainId = getChainId(CONSTANTS.networkSelected);

  const _ensureCorrectChain = async () => {
    if (chain?.id !== chainId) {
      setLoading("Switch chain...");
      await switchChainAsync({ chainId });
    }
  };

  const _throwError = () => {
    TOAST.showErrorToast({ description: "Something went wrong" });
  };

  const _executeFn = async ({ etf, isBuy, inputAmount }: { etf: C_Etf; isBuy: boolean; inputAmount: number }) => {
    try {
      setLoading("Loading...");
      await _ensureCorrectChain();
      const etfRouterAddress = await HOPIUM.contracts.addresses.etfRouter;

      setLoading("Confirm tx...");
      let hash: `0x${string}`;

      if (isBuy) {
        const amount = parseEther(inputAmount.toString());
        hash = await writeContractAsync({
          abi: HOPIUM.contracts.abis.etfRouter,
          address: etfRouterAddress,
          functionName: "mintEtfTokens",
          args: [BigInt(etf.index.indexId), walletAddress as `0x${string}`],
          value: amount,
          chainId,
        });
      } else {
        const amount = parseUnits(inputAmount.toString(), 18);
        hash = await writeContractAsync({
          abi: HOPIUM.contracts.abis.etfRouter,
          address: etfRouterAddress,
          functionName: "redeemEtfTokens",
          args: [BigInt(etf.index.indexId), amount, walletAddress as `0x${string}`],
          chainId,
        });
      }

      setLoading("Waiting for tx to confirm...");
      const isSuccess = await waitForTx(hash);

      if (isSuccess) {
        TOAST.showSuccessToast({
          title: isBuy ? "Buy successful" : "Sell successful",
          description: isBuy
            ? `You successfully bought ${etf.index.ticker} for ${inputAmount} ETH`
            : `You successfully sold ${inputAmount} ${etf.index.ticker}`,
        });
      } else {
        _throwError();
      }
    } catch (e) {
      console.error(normalizeError(e));
      _throwError();
    } finally {
      setLoading(null);
    }
  };

  const buyEtf = async ({ etf, inputAmount }: { etf: C_Etf; inputAmount: number }) => {
    await _executeFn({ etf, isBuy: true, inputAmount });
  };

  const sellEtf = async ({ etf, inputAmount }: { etf: C_Etf; inputAmount: number }) => {
    await _executeFn({ etf, isBuy: false, inputAmount });
  };

  return {
    buyEtf,
    sellEtf,
  };
};
