"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchCoingeckoPrice } from "@repo/common/utils/price";

const PricesContext = createContext<{
  ethPrice: number;
}>({
  ethPrice: 0,
});

export const PricesProvider = ({ children }: { children: React.ReactNode }) => {
  const [ethPrice, setEthPrice] = useState<number>(0);

  useEffect(() => {
    const fetchEthPrice = async () => {
      const price = await fetchCoingeckoPrice({ coinId: "ethereum" });
      setEthPrice(price);
    };

    fetchEthPrice();
  }, []);

  return <PricesContext.Provider value={{ ethPrice }}>{children}</PricesContext.Provider>;
};

export const usePrices = () => {
  return useContext(PricesContext);
};
