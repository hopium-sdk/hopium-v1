import type { T_NETWORK } from "../utils/constants";
import { _directory } from "./directory/directory";
import { _indexFactory } from "./index-factory/index-factory";
import { _indexPriceOracle } from "./index-price-oracle/index-price-oracle";
import { _erc20 } from "./erc20/erc20";

export const _fns = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => ({
  directory: _directory({ network, rpcUrl }),
  indexFactory: _indexFactory({ network, rpcUrl }),
  indexPriceOracle: _indexPriceOracle({ network, rpcUrl }),
  erc20: _erc20({ network, rpcUrl }),
});
