import { createConfig, http, waitForTransactionReceipt } from "@wagmi/core";
import { mainnet, base } from "@wagmi/core/chains";
import { NETWORK } from "@repo/common/utils/network";
import { T_Network } from "@repo/common/utils/network";
import { CONSTANTS } from "./constants";

export const getWagmiClient = () => {
  return createConfig({
    chains: [mainnet, base],
    transports: {
      [mainnet.id]: http(NETWORK.rpcUrl.mainnet),
      [base.id]: http(NETWORK.rpcUrl.base),
    },
  });
};

export const getChainId = (chain: T_Network) => {
  return chain === "mainnet" ? mainnet.id : base.id;
};

export const waitForTx = async (hash: `0x${string}`): Promise<boolean> => {
  const config = getWagmiClient();
  const receipt = await waitForTransactionReceipt(config, { hash, chainId: getChainId(CONSTANTS.networkSelected), confirmations: 1 });
  return receipt.status === "success";
};
