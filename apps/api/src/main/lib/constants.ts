export type T_NETWORK = "mainnet" | "base";

type T_CONSTANTS = {
  networkSelected: T_NETWORK;
  rpcUrl: {
    [key in T_NETWORK]: string;
  };
};

export const CONSTANTS: T_CONSTANTS = {
  networkSelected: "base" as T_NETWORK,
  rpcUrl: {
    mainnet: "https://ethereum-rpc.publicnode.com",
    base: "https://base-rpc.publicnode.com",
  },
};
