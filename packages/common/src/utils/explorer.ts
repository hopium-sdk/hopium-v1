import { COMMON_CONSTANTS } from "./constants";
import { T_Network } from "./constants";

export const getExplorerTxHashUrl = ({ txHash, network }: { txHash: string; network: T_Network }) => {
  const baseUrl = COMMON_CONSTANTS.explorer[network];
  return baseUrl + "/tx/" + txHash;
};

export const getExplorerAddressUrl = ({ address, network }: { address: string; network: T_Network }) => {
  const baseUrl = COMMON_CONSTANTS.explorer[network];
  return baseUrl + "/address/" + address;
};

export const getExplorerTokenUrl = ({ address, network }: { address: string; network: T_Network }) => {
  const baseUrl = COMMON_CONSTANTS.explorer[network];
  return baseUrl + "/token/" + address;
};
