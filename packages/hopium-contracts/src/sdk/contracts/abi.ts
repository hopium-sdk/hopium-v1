import { directoryAbi } from "./abi/directory";
import { poolFinderAbi } from "./abi/poolFinder";
import { uniswapOracleAbi } from "./abi/uniswapOracle";
import { etfFactoryAbi } from "./abi/etfFactory";
import { etfOracleAbi } from "./abi/etfOracle";
import { erc20Abi } from "./abi/erc20";
import { etfRouterAbi } from "./abi/etfRouter";
import { etfTokenEventsAbi } from "./abi/etfTokenEvents";
import { uniswapV3PoolAbi } from "./abi/uniswapV3Pool";
import { uniswapV2PoolAbi } from "./abi/uniswapV2Pool";
import { etfAffiliateAbi } from "./abi/etfAffiliate";

export const ABI = {
  directory: directoryAbi,
  poolFinder: poolFinderAbi,
  uniswapOracle: uniswapOracleAbi,
  etfFactory: etfFactoryAbi,
  etfOracle: etfOracleAbi,
  erc20: erc20Abi,
  etfRouter: etfRouterAbi,
  etfTokenEvents: etfTokenEventsAbi,
  uniswapV2Pool: uniswapV2PoolAbi,
  uniswapV3Pool: uniswapV3PoolAbi,
  etfAffiliate: etfAffiliateAbi,
};
