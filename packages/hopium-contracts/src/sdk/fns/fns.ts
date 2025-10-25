import type { T_NETWORK } from "../utils/constants";
import { _directory } from "./directory/directory";
import { _etfFactory } from "./etf-factory/etf-factory";
import { _erc20 } from "./erc20/erc20";
import { _uniswapOracle } from "./uniswap-oracle/uniswap-oracle";
import { _etfOracle } from "./etf-oracle/etf-oracle";
import { _etfAffiliate } from "./etf-affiliate/etf-affiliate";

export const _fns = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => ({
  directory: _directory({ network, rpcUrl }),
  etfFactory: _etfFactory({ network, rpcUrl }),
  etfOracle: _etfOracle({ network, rpcUrl }),
  erc20: _erc20({ network, rpcUrl }),
  uniswapOracle: _uniswapOracle({ network, rpcUrl }),
  etfAffiliate: _etfAffiliate({ network, rpcUrl }),
});
