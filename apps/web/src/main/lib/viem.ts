import { createPublicClient, http } from "viem";
import { base, mainnet } from "viem/chains";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";

const networks = {
  mainnet: mainnet,
  base: base,
};

const getViemClient = () =>
  createPublicClient({
    chain: networks[COMMON_CONSTANTS.networkSelected],
    transport: http(COMMON_CONSTANTS.rpcUrl[COMMON_CONSTANTS.networkSelected]),
  });

export default getViemClient;
