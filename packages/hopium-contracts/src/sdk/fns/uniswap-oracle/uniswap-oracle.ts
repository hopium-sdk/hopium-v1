import { T_NETWORK } from "../../utils/constants";
import { _fetchWethUsdPrice } from "./fns/fetchWethUsdPrice";

export const _uniswapOracle = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => ({
  fetchWethUsdPrice: () => _fetchWethUsdPrice({ network, rpcUrl }),
});
