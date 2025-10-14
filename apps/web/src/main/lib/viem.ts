import { createPublicClient, http } from "viem";
import { base, mainnet } from "viem/chains";
import { CONSTANTS } from "./constants";
import { NETWORK } from "@repo/common/utils/network";

const networks = {
  mainnet: mainnet,
  base: base,
};

const getViemClient = () =>
  createPublicClient({
    chain: networks[CONSTANTS.networkSelected],
    transport: http(NETWORK.rpcUrl[CONSTANTS.networkSelected]),
  });

export default getViemClient;
