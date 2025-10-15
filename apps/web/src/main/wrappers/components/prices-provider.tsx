"use client";
import { HOPIUM } from "@/main/lib/hopium";
import { createContext, useContext, useEffect, useState } from "react";

const PricesContext = createContext<{
  ethPrice: number;
}>({
  ethPrice: 0,
});

const UPDATE_INTERVAL = 30_000;

export const PricesProvider = ({ children }: { children: React.ReactNode }) => {
  const [ethPrice, setEthPrice] = useState<number>(0);

  const updateEthPrice = async () => {
    const price = await HOPIUM.fns.priceOracle.fetchWethUsdPrice();
    if (ethPrice !== price) {
      setEthPrice(price);
    }
  };

  useEffect(() => {
    // Fetch immediately on mount
    updateEthPrice();

    // Then update every 60 seconds (1 minute)
    const interval = setInterval(() => {
      updateEthPrice();
    }, UPDATE_INTERVAL); // 60,000 ms = 1 minute

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return <PricesContext.Provider value={{ ethPrice }}>{children}</PricesContext.Provider>;
};

export const usePrices = () => {
  return useContext(PricesContext);
};
