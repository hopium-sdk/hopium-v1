import { _contracts } from "../../../contracts/contracts";
import type { T_NETWORK } from "../../../utils/constants";

export const _fetchWethUsdPool = async ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => {
  const uniswapOracleContract = await _contracts({ network, rpcUrl }).contracts.uniswapOracle();

  const wethUsdPool = await uniswapOracleContract.read.WETH_USD_PAIR_ADDRESS();

  return wethUsdPool;
};
