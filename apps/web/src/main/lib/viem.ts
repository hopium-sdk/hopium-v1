import { createConfig, http } from "@wagmi/core";
import { mainnet, base } from "@wagmi/core/chains";
import { NETWORK } from "@repo/common/utils/network";
import { T_Network } from "@repo/common/utils/network";

export const getViemClient = () => {
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
