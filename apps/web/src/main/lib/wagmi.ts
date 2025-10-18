import { createConfig, http, waitForTransactionReceipt } from "@wagmi/core";
import { mainnet, base } from "@wagmi/core/chains";
import { COMMON_CONSTANTS, T_Network } from "@repo/common/utils/constants";

const networks = {
  mainnet: mainnet,
  base: base,
};

export const getWagmiClient = () => {
  return createConfig({
    chains: [networks[COMMON_CONSTANTS.networkSelected]],
    transports: {
      [mainnet.id]: http(COMMON_CONSTANTS.rpcUrl.mainnet),
      [base.id]: http(COMMON_CONSTANTS.rpcUrl.base),
    },
  });
};

export const getChainId = (chain: T_Network) => {
  return chain === "mainnet" ? mainnet.id : base.id;
};

export const waitForTx = async (hash: `0x${string}`): Promise<boolean> => {
  const config = getWagmiClient();
  const receipt = await waitForTransactionReceipt(config, { hash, chainId: getChainId(COMMON_CONSTANTS.networkSelected), confirmations: 1 });
  return receipt.status === "success";
};
