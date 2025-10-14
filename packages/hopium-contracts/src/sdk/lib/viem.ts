import { createClient, http } from "viem";
import { mainnet, base } from "viem/chains";
import { type T_NETWORK } from "../utils/constants";

const networks = {
  mainnet: mainnet,
  base: base,
};

export const getViemClient = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => {
  return createClient({ chain: networks[network], transport: http(rpcUrl) });
};
