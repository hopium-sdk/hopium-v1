"use client";
import { useAccount } from "wagmi";
import { CONVEX } from "../lib/convex";
import { useQuery } from "convex/react";

export const useBalanceEtf = ({ etfTokenAddress }: { etfTokenAddress?: `0x${string}` }) => {
  const { address } = useAccount();

  const balanceEtf = useQuery(
    CONVEX.api.fns.etfToken.getTokenBalanceByAddress.default,
    address ? { tokenAddress: etfTokenAddress as `0x${string}`, userAddress: address as `0x${string}` } : "skip"
  );

  return { balanceEtf: balanceEtf ?? 0 };
};
