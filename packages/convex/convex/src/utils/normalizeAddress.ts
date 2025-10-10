import { ethers } from "ethers";

export const normalizeAddress = (address: string) => {
  return ethers.getAddress(address);
};
