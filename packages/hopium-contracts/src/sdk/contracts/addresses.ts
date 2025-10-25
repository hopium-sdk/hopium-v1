import type { T_NETWORK } from "../utils/constants";
import { _fetchFromDirectory } from "../fns/directory/fns/fetchFromDirectory";

export const _addresses = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => ({
  uniswapOracle: () => _fetchFromDirectory({ key: "uniswap-oracle", network, rpcUrl }),
  etfFactory: () => _fetchFromDirectory({ key: "etf-factory", network, rpcUrl }),
  etfOracle: () => _fetchFromDirectory({ key: "etf-oracle", network, rpcUrl }),
  etfTokenEvents: () => _fetchFromDirectory({ key: "etf-token-events", network, rpcUrl }),
  etfRouter: () => _fetchFromDirectory({ key: "etf-router", network, rpcUrl }),
  poolFinder: () => _fetchFromDirectory({ key: "pool-finder", network, rpcUrl }),
  etfAffiliate: () => _fetchFromDirectory({ key: "etf-affiliate", network, rpcUrl }),
});
