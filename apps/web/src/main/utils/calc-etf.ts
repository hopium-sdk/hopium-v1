import { T_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";

export const calcCurrentWeight = ({ etf, assetAddress, ethUsdPrice }: { etf: T_EtfWithAssetsAndPools; assetAddress: string; ethUsdPrice: number }) => {
  const wethAddress = COMMON_CONSTANTS.addresses.weth[COMMON_CONSTANTS.networkSelected];
  const tvl = calculateTvl({ etf, ethUsdPrice });

  const asset = etf.etf.details.assets.find((asset) => asset.tokenAddress === assetAddress);
  if (!asset) return 0;

  let poolPrice = 0;
  if (asset.tokenAddress === wethAddress) {
    poolPrice = 1;
  } else {
    const pool = etf.pools.find((pool) => pool.details.token0 === assetAddress || pool.details.token1 === assetAddress);
    if (!pool) return 0;
    poolPrice = pool.stats.price.eth;
  }

  const balance = asset.balance;
  return ((balance * poolPrice) / tvl.eth) * 100;
};

export const calculateTvl = ({ etf, ethUsdPrice }: { etf: T_EtfWithAssetsAndPools; ethUsdPrice: number }) => {
  const wethAddress = COMMON_CONSTANTS.addresses.weth[COMMON_CONSTANTS.networkSelected];
  const tvl = etf.etf.details.assets.reduce((acc, asset) => {
    let poolPrice = 0;
    if (asset.tokenAddress === wethAddress) {
      poolPrice = 1;
    } else {
      const pool = etf.pools.find((pool) => pool.details.token0 === asset.tokenAddress || pool.details.token1 === asset.tokenAddress);
      if (!pool) return 0;
      poolPrice = pool.stats.price.eth;
    }
    const balance = asset.balance;
    return acc + balance * poolPrice;
  }, 0);

  const tvlUsd = etf.etf.details.assets.reduce((acc, asset) => {
    let poolPrice = 0;
    if (asset.tokenAddress === wethAddress) {
      poolPrice = ethUsdPrice;
    } else {
      const pool = etf.pools.find((pool) => pool.details.token0 === asset.tokenAddress || pool.details.token1 === asset.tokenAddress);
      if (!pool) return 0;
      poolPrice = pool.stats.price.usd;
    }
    const balance = asset.balance;
    return acc + balance * poolPrice;
  }, 0);

  return {
    eth: tvl,
    usd: tvlUsd,
  };
};
