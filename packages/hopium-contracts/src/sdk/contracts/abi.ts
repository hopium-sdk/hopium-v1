import { directoryAbi } from "./abi/directory";
import { uniswapOracleAbi } from "./abi/uniswapOracle";
import { etfFactoryAbi } from "./abi/etfFactory";
import { etfOracleAbi } from "./abi/etfOracle";
import { erc20Abi } from "./abi/erc20";
import { etfRouterAbi } from "./abi/etfRouter";
import { etfTokenEventsAbi } from "./abi/etfTokenEvents";

export const ABI = {
  directory: directoryAbi,
  uniswapOracle: uniswapOracleAbi,
  etfFactory: etfFactoryAbi,
  etfOracle: etfOracleAbi,
  erc20: erc20Abi,
  etfRouter: etfRouterAbi,
  etfTokenEvents: etfTokenEventsAbi,
};
