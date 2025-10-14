import { _contracts } from "../../../contracts/contracts";
import type { T_NETWORK } from "../../../utils/constants";

export const _fetchIndexLiquidityUsd = async ({ indexId, network, rpcUrl }: { indexId: bigint; network: T_NETWORK; rpcUrl: string }) => {
  const indexPriceOracleContract = await _contracts({ network, rpcUrl }).contracts.indexPriceOracle;

  const indexLiquidityUsd = await indexPriceOracleContract.read.getIndexLiquidityUsd([indexId]);

  return Number(indexLiquidityUsd) / 1e18;
};
