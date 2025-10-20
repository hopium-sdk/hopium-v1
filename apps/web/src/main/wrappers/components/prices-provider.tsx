"use client";
import { CONVEX } from "@/main/lib/convex";
import { useQuery } from "convex/react";
import { createContext, useContext } from "react";

const PricesContext = createContext<{
  ethUsdPrice: number;
}>({
  ethUsdPrice: 0,
});

export const PricesProvider = ({ children }: { children: React.ReactNode }) => {
  const ethUsdPrice = useQuery(CONVEX.api.fns.pools.getWethUsdPrice.default);

  return <PricesContext.Provider value={{ ethUsdPrice: ethUsdPrice ?? 0 }}>{children}</PricesContext.Provider>;
};

export const usePrices = () => {
  return useContext(PricesContext);
};
