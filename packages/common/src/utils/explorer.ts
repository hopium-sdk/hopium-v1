import { NETWORK } from "./network";
import { T_Network } from "./network";

export const getExplorerTxHashUrl = ({ txHash, network }: { txHash: string; network: T_Network }) => {
  const baseUrl = NETWORK.explorer[network];
  return baseUrl + "/tx/" + txHash;
};

export const getExplorerAddressUrl = ({ address, network }: { address: string; network: T_Network }) => {
  const baseUrl = NETWORK.explorer[network];
  return baseUrl + "/address/" + address;
};
