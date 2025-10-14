"use client";
import { useEffect, useState } from "react";
import { getBalance } from "@wagmi/core";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { getWagmiClient, getChainId } from "@/main/lib/wagmi";
import { CONSTANTS } from "../lib/constants";
import { normalizeError } from "../utils/error";

const UPDATE_INTERVAL = 30_000;

export const useBalanceToken = ({ tokenAddress }: { tokenAddress?: `0x${string}` }) => {
  const { address } = useAccount();
  const [balanceToken, setBalanceToken] = useState<number>(0);
  const client = getWagmiClient();
  const chainId = getChainId(CONSTANTS.networkSelected);

  const updateBalanceToken = async () => {
    try {
      if (!address) return;

      const result = await getBalance(client, {
        address: address as `0x${string}`,
        token: tokenAddress,
        chainId,
      });

      setBalanceToken(Number(formatUnits(result.value, result.decimals)));
    } catch (e) {
      console.error(normalizeError(e));
    }
  };

  useEffect(() => {
    if (!address) return;

    // Fetch immediately on mount
    updateBalanceToken();

    // Then update every 60 seconds (1 minute)
    const interval = setInterval(() => {
      updateBalanceToken();
    }, UPDATE_INTERVAL); // 60,000 ms = 1 minute

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [address]);

  return {
    balanceToken,
    updateBalanceToken,
  };
};
