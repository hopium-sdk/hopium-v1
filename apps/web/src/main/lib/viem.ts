import { createPublicClient, http, Chain } from "viem";
import { base, mainnet } from "viem/chains";
import { COMMON_CONSTANTS, T_Network } from "@repo/common/utils/constants";

const networks: Record<T_Network, Chain> = {
  mainnet: mainnet,
  base: base,
};

const getViemClient = () =>
  createPublicClient({
    chain: networks[COMMON_CONSTANTS.networkSelected],
    transport: http(COMMON_CONSTANTS.rpcUrl[COMMON_CONSTANTS.networkSelected]),
  });

export default getViemClient;
