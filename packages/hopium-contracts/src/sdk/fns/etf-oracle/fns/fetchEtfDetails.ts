import { _contracts } from "../../../contracts/contracts";
import type { T_NETWORK } from "../../../utils/constants";
import { formatUnits } from "viem";

export const _fetchEtfDetails = async ({ etfId, network, rpcUrl }: { etfId: bigint; network: T_NETWORK; rpcUrl: string }) => {
  const etfOracleContract = await _contracts({ network, rpcUrl }).contracts.etfOracle();

  const details = await etfOracleContract.read.getEtfDetails([etfId]);

  const data = details[0];
  const stats = details[1];
  const snapshot = details[2];
  const etfTvlWeth = details[3];
  const etfTvlUsd = details[4];

  return {
    data: data,
    stats: {
      price: {
        eth: Number(stats.price.eth18) / 1e18,
        usd: Number(stats.price.usd18) / 1e18,
      },
      volume: {
        eth: Number(stats.volume.eth18) / 1e18,
        usd: Number(stats.volume.usd18) / 1e18,
      },
      tvl: {
        eth: Number(stats.tvl.eth18) / 1e18,
        usd: Number(stats.tvl.usd18) / 1e18,
      },
      assetsLiquidityUsd: Number(stats.assetsLiquidityUsd) / 1e18,
      assetsMcapUsd: Number(stats.assetsMcapUsd) / 1e18,
    },
    snapshot: snapshot.map((s) => ({
      tokenAddress: s.tokenAddress,
      tokenDecimals: s.tokenDecimals,
      currentWeight: s.currentWeight,
      tokenBalance: Number(formatUnits(s.tokenRawBalance, s.tokenDecimals)),
      tokenPriceWeth: Number(s.tokenPriceWeth18) / 1e18,
      tokenPriceUsd: Number(s.tokenPriceUsd18) / 1e18,
      tokenValueWeth: Number(s.tokenValueWeth18) / 1e18,
      tokenValueUsd: Number(s.tokenValueUsd18) / 1e18,
    })),
    etfTvlWeth: Number(etfTvlWeth) / 1e18,
    etfTvlUsd: Number(etfTvlUsd) / 1e18,
  };
};
