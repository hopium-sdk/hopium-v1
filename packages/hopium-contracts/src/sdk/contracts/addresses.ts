import type { T_NETWORK } from "../utils/constants";
import { _fetchFromDirectory } from "../fns/directory/fns/fetchFromDirectory";

export const _addresses = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => ({
  priceOracle: _fetchFromDirectory({ key: "price-oracle", network, rpcUrl }),
  etfFactory: _fetchFromDirectory({ key: "etf-factory", network, rpcUrl }),
  indexFactory: _fetchFromDirectory({ key: "index-factory", network, rpcUrl }),
  indexPriceOracle: _fetchFromDirectory({ key: "index-price-oracle", network, rpcUrl }),
  etfTokenEvents: _fetchFromDirectory({ key: "etf-token-events", network, rpcUrl }),
  etfRouter: _fetchFromDirectory({ key: "etf-router", network, rpcUrl }),
});
