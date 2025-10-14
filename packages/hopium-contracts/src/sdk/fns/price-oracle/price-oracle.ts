import { T_NETWORK } from "../../utils/constants";
import { _fetchWethUsdPrice } from "./fns/fetchWethUsdPrice";

export const _priceOracle = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => ({
  fetchWethUsdPrice: () => _fetchWethUsdPrice({ network, rpcUrl }),
});
