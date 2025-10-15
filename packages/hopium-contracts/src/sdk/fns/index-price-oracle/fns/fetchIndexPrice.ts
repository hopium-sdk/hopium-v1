import { _contracts } from "../../../contracts/contracts";
import type { T_NETWORK } from "../../../utils/constants";

export const _fetchIndexPrice = async ({ indexId, network, rpcUrl }: { indexId: bigint; network: T_NETWORK; rpcUrl: string }) => {
  const indexPriceOracleContract = await _contracts({ network, rpcUrl }).contracts.indexPriceOracle();

  const [indexPriceWeth, indexPriceUsd] = await Promise.all([
    indexPriceOracleContract.read.getIndexWethPrice([indexId]),
    indexPriceOracleContract.read.getIndexUsdPrice([indexId]),
  ]);

  return {
    indexPriceWeth: Number(indexPriceWeth) / 1e18,
    indexPriceUsd: Number(indexPriceUsd) / 1e18,
  };
};
