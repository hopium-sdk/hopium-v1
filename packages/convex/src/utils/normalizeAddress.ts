import { ethers } from "ethers";

export const normalizeAddress = (address: string) => {
  return ethers.getAddress(address);
};

export const isEthAddress = (address: string) => {
  try {
    return ethers.getAddress(address);
  } catch {
    return false;
  }
};
