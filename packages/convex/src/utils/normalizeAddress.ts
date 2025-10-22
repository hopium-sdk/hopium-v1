import { ethers } from "ethers";

export const normalizeAddress = (address: string) => {
  return ethers.utils.getAddress(address);
};

export const isEthAddress = (address: string) => {
  try {
    return ethers.utils.isAddress(address);
  } catch {
    return false;
  }
};
