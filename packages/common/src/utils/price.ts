import { z } from "zod";

const Z_CoingeckoPrice = z.record(
  z.string(),
  z.object({
    usd: z.number(),
  })
);

export const fetchCoingeckoPrice = async ({ coinId }: { coinId: string }) => {
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
  const json = await res.json();
  const prices = Z_CoingeckoPrice.safeParse(json);

  if (!prices.success) {
    return 0;
  }

  return prices.data[coinId]?.usd ?? 0;
};
