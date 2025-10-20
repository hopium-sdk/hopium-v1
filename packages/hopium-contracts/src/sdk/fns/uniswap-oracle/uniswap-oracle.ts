import { T_NETWORK } from "../../utils/constants";
import { _fetchWethUsdPrice } from "./fns/fetchWethUsdPrice";
import { _fetchTokenUsdPrice } from "./fns/fetchTokenUsdPrice";

export const _uniswapOracle = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => ({
  fetchWethUsdPrice: () => _fetchWethUsdPrice({ network, rpcUrl }),
  fetchTokenUsdPrice: (tokenAddress: string) => _fetchTokenUsdPrice({ network, rpcUrl, tokenAddress }),
});
