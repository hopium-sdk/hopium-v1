"use client";
import { useAddress } from "@/main/hooks/use-address";
import getViemClient from "@/main/lib/viem";
import { normalizeError } from "@/main/utils/error";
import { createContext, useContext, useEffect, useState } from "react";
import { formatEther } from "viem";
import { getBalance } from "viem/actions";
import { useAccount } from "wagmi";

const BalanceContext = createContext<{
  balanceEth: number;
  updateBalanceEth: () => Promise<void>;
}>({
  balanceEth: 0,
  updateBalanceEth: async () => {},
});

const UPDATE_INTERVAL = 30_000;

export const BalanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [balanceEth, setBalanceEth] = useState<number>(0);
  const client = getViemClient();
  const { address } = useAccount();

  const updateBalanceEth = async () => {
    try {
      if (!address) return;

      const balanceInWei = await getBalance(client, {
        address: address as `0x${string}`,
      });

      setBalanceEth(Number(formatEther(balanceInWei)));
    } catch (e) {
      console.error(normalizeError(e));
    }
  };

  useEffect(() => {
    if (!address) return;
    // Fetch immediately on mount
    updateBalanceEth();

    // Then update every 60 seconds (1 minute)
    const interval = setInterval(() => {
      updateBalanceEth();
    }, UPDATE_INTERVAL); // 60,000 ms = 1 minute

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [address]);

  return <BalanceContext.Provider value={{ balanceEth, updateBalanceEth }}>{children}</BalanceContext.Provider>;
};

export const useBalanceEth = () => {
  return useContext(BalanceContext);
};
