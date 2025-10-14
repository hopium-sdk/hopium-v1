import { directoryAbi } from "./abi/directory";
import { priceOracleAbi } from "./abi/priceOracle";
import { etfFactoryAbi } from "./abi/etfFactory";
import { indexFactoryAbi } from "./abi/indexFactory";
import { indexPriceOracleAbi } from "./abi/indexPriceOracle";
import { erc20Abi } from "./abi/erc20";
import { etfRouterAbi } from "./abi/etfRouter";
import { etfTokenEventsAbi } from "./abi/etfTokenEvents";

export const ABI = {
  directory: directoryAbi,
  priceOracle: priceOracleAbi,
  etfFactory: etfFactoryAbi,
  indexFactory: indexFactoryAbi,
  indexPriceOracle: indexPriceOracleAbi,
  erc20: erc20Abi,
  etfRouter: etfRouterAbi,
  etfTokenEvents: etfTokenEventsAbi,
};
