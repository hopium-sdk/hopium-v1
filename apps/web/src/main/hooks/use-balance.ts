"use client";
import { useEffect, useRef, useState } from "react";
import { getBalance } from "@wagmi/core";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { getWagmiClient, getChainId } from "@/main/lib/wagmi";
import { CONSTANTS } from "../lib/constants";

type UseBalanceOpts = {
  tokenAddress?: `0x${string}`;
  /** Poll interval in ms. 0 disables polling. */
  pollMs?: number;
  /** Refetch when the window regains focus. */
  refetchOnWindowFocus?: boolean;
};

export type T_Balance = {
  value: bigint;
  decimals: number;
  symbol?: string;
  formattedString: string;
  formattedNumber: number;
};

export const useBalance = ({ tokenAddress, pollMs = 0, refetchOnWindowFocus = true }: UseBalanceOpts = {}) => {
  const { address, isConnected } = useAccount();

  const [eth, setEth] = useState<T_Balance | null>(null);
  const [token, setToken] = useState<T_Balance | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inFlightRef = useRef(0);

  const client = getWagmiClient();
  const chainId = getChainId(CONSTANTS.networkSelected);

  const reset = () => {
    setEth(null);
    setToken(null);
  };

  const updateBalances = async () => {
    if (!isConnected || !address) return;

    const reqId = ++inFlightRef.current;
    try {
      const ethPromise = getBalance(client, {
        address: address as `0x${string}`,
        chainId,
      });

      const tokenPromise = tokenAddress
        ? getBalance(client, {
            address: address as `0x${string}`,
            token: tokenAddress,
            chainId,
          })
        : Promise.resolve(null);

      const [ethRes, tokenRes] = await Promise.all([ethPromise, tokenPromise]);

      if (reqId !== inFlightRef.current) return; // prevent race condition

      const nextEth: T_Balance = {
        value: ethRes.value,
        decimals: ethRes.decimals,
        symbol: ethRes.symbol,
        formattedString: formatUnits(ethRes.value, ethRes.decimals),
        formattedNumber: Number(formatUnits(ethRes.value, ethRes.decimals)),
      };

      setEth((prev) => (prev && prev.value === nextEth.value && prev.decimals === nextEth.decimals ? prev : nextEth));

      if (tokenRes) {
        const nextToken: T_Balance = {
          value: tokenRes.value,
          decimals: tokenRes.decimals,
          symbol: tokenRes.symbol,
          formattedString: formatUnits(tokenRes.value, tokenRes.decimals),
          formattedNumber: Number(formatUnits(tokenRes.value, tokenRes.decimals)),
        };
        setToken((prev) => (prev && prev.value === nextToken.value && prev.decimals === nextToken.decimals ? prev : nextToken));
      } else {
        setToken(null);
      }
    } catch {
      // silently ignore errors
    }
  };

  // Initial + on address/token change
  useEffect(() => {
    if (!isConnected || !address) {
      reset();
      return;
    }
    updateBalances();
  }, [isConnected, address, tokenAddress, updateBalances, reset]);

  // Polling
  useEffect(() => {
    if (pollMs <= 0) return;
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(updateBalances, pollMs);
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [pollMs, updateBalances]);

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus) return;
    const onFocus = () => updateBalances();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refetchOnWindowFocus, updateBalances]);

  return {
    balanceEth: eth,
    balanceEthNumber: eth?.formattedNumber ?? 0,
    balanceToken: token,
    balanceTokenNumber: token?.formattedNumber ?? 0,
    updateBalances,
  };
};
