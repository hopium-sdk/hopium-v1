import { _contracts } from "../../../contracts/contracts";
import type { T_NETWORK } from "../../../utils/constants";

export const _fetchWethUsdPrice = async ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => {
  const uniswapOracleContract = await _contracts({ network, rpcUrl }).contracts.uniswapOracle();

  const price18 = await uniswapOracleContract.read.getWethUsdPrice();

  return Number(price18) / 1e18;
};
