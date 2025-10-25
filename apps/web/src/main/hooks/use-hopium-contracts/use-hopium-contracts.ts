"use client";
import { useAccount, useWriteContract, useSwitchChain, useReadContract } from "wagmi";
import { getChainId, waitForTx } from "../../lib/wagmi";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";
import { TOAST } from "../../components/ui/toast/toast";
import { C_Etf } from "@repo/convex/schema";
import { normalizeError } from "../../utils/error";
import { _buySellFn, _buySellToastFn } from "./fns/buy-sell";
import { _createCouponFn, _createCouponToastFn } from "./fns/create-coupon";
import { useCoupon } from "@/main/hooks/use-coupon";
import { _createEtfFn, _createEtfToastFn } from "./fns/create-etf";

export const useHopiumContracts = ({ setLoading }: { setLoading: (loading: string | null) => void }) => {
  const { address } = useAccount();
  const { chain } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();
  const chainId = getChainId(COMMON_CONSTANTS.networkSelected);
  const { savedCoupon } = useCoupon();

  const _ensureCorrectChain = async () => {
    if (chain?.id !== chainId) {
      setLoading("Switch chain...");
      await switchChainAsync({ chainId });
    }
  };

  const _throwError = () => {
    TOAST.showErrorToast({ description: "Something went wrong" });
  };

  const _executeFn = async ({ fn, toastFn }: { fn: () => Promise<`0x${string}`>; toastFn: () => void }) => {
    try {
      if (!address) {
        throw new Error("No address found");
      }

      setLoading("Loading...");
      await _ensureCorrectChain();

      const hash = await fn();

      setLoading("Waiting for tx to confirm...");
      const isSuccess = await waitForTx(hash);

      if (isSuccess) {
        toastFn();
      } else {
        throw new Error("Transaction failed");
      }
    } catch (e) {
      console.error(normalizeError(e));
      _throwError();
    } finally {
      setLoading(null);
    }
  };

  const buyEtf = async ({ etf, inputAmount }: { etf: C_Etf; inputAmount: number }) => {
    const fn = () => _buySellFn({ etf, isBuy: true, inputAmount, savedCoupon, setLoading, address, chain, writeContractAsync });
    const toastFn = () => _buySellToastFn({ etf, isBuy: true, inputAmount });
    await _executeFn({ fn, toastFn });
  };

  const sellEtf = async ({ etf, inputAmount }: { etf: C_Etf; inputAmount: number }) => {
    const fn = () => _buySellFn({ etf, isBuy: false, inputAmount, savedCoupon, setLoading, address, chain, writeContractAsync });
    const toastFn = () => _buySellToastFn({ etf, isBuy: false, inputAmount });
    await _executeFn({ fn, toastFn });
  };

  const createCoupon = async ({ code }: { code: string }) => {
    const fn = () => _createCouponFn({ code, setLoading, address, chain, writeContractAsync });
    const toastFn = () => _createCouponToastFn({ code });
    await _executeFn({ fn, toastFn });
  };

  const createEtf = async ({ name, ticker, assets }: { name: string; ticker: string; assets: { tokenAddress: `0x${string}`; weightBips: number }[] }) => {
    const fn = () => _createEtfFn({ name, ticker, assets, setLoading, address, chain, writeContractAsync });
    const toastFn = () => _createEtfToastFn({ name, ticker });
    await _executeFn({ fn, toastFn });
  };

  return {
    buyEtf,
    sellEtf,
    createCoupon,
    createEtf,
  };
};
