"use client";
import { useAccount } from "wagmi";
import { CONVEX } from "../lib/convex";
import { useQuery } from "convex/react";

export const useBalanceEtf = ({ etfId }: { etfId: number }) => {
  const { address } = useAccount();

  const balanceEtf = useQuery(
    CONVEX.api.fns.etfToken.getTokenBalanceByAddress.default,
    address ? { etfId: etfId, userAddress: address as `0x${string}` } : "skip"
  );

  return { balanceEtf: balanceEtf ?? 0 };
};
