export type T_Network = "mainnet" | "base";

type T_NetworkConfig = {
  rpcUrl: {
    [key in T_Network]: string;
  };
  explorer: {
    [key in T_Network]: string;
  };
};

export const NETWORK: T_NetworkConfig = {
  rpcUrl: {
    mainnet: "https://ethereum-rpc.publicnode.com",
    base: "https://base-rpc.publicnode.com",
  },
  explorer: {
    mainnet: "https://etherscan.io",
    base: "https://basescan.org",
  },
};
