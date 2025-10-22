import { ethers } from "ethers";

export const formatAddress = (address: string) => {
  return address.slice(0, 2) + "_" + address.slice(-4);
};

export const isEthAddress = (address: string) => {
  return ethers.utils.isAddress(address);
};

export const normalizeAddress = (address: string) => {
  return ethers.utils.getAddress(address);
};
