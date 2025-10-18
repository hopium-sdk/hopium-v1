import { T_EtfWithAssetsAndPools } from "@repo/convex/schema";

export const calcCurrentWeight = ({ etf, assetAddress }: { etf: T_EtfWithAssetsAndPools; assetAddress: string }) => {
  const tvl = calculateTvl({ etf });

  const asset = etf.etf.details.assets.find((asset) => asset.tokenAddress === assetAddress);
  if (!asset) return 0;
  const pool = etf.pools.find((pool) => pool.details.token0 === assetAddress || pool.details.token1 === assetAddress);
  if (!pool) return 0;
  const price = pool.stats.price.eth;
  const balance = asset.balance;
  return ((balance * price) / tvl.eth) * 100;
};

export const calculateTvl = ({ etf }: { etf: T_EtfWithAssetsAndPools }) => {
  const tvl = etf.etf.details.assets.reduce((acc, asset) => {
    const pool = etf.pools.find((pool) => pool.details.token0 === asset.tokenAddress || pool.details.token1 === asset.tokenAddress);
    if (!pool) return 0;
    const price = pool.stats.price.eth;
    const balance = asset.balance;
    return acc + balance * price;
  }, 0);

  const tvlUsd = etf.etf.details.assets.reduce((acc, asset) => {
    const pool = etf.pools.find((pool) => pool.details.token0 === asset.tokenAddress || pool.details.token1 === asset.tokenAddress);
    if (!pool) return 0;
    const price = pool.stats.price.usd;
    const balance = asset.balance;
    return acc + balance * price;
  }, 0);

  return {
    eth: tvl,
    usd: tvlUsd,
  };
};
