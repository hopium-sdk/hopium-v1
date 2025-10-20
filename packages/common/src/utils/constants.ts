export type T_Network = "mainnet" | "base";

type T_COMMON_CONSTANTS = {
  networkSelected: T_Network;
  addresses: {
    zero: `0x${string}`;
    weth: {
      [key in T_Network]: `0x${string}`;
    };
    usdc: {
      [key in T_Network]: `0x${string}`;
    };
  };
  rpcUrl: {
    [key in T_Network]: string;
  };
  explorer: {
    [key in T_Network]: string;
  };
  storage_url: string;
};

export const COMMON_CONSTANTS: T_COMMON_CONSTANTS = {
  networkSelected: "base" as T_Network,
  addresses: {
    zero: "0x0000000000000000000000000000000000000000",
    weth: {
      mainnet: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      base: "0x4200000000000000000000000000000000000006",
    },
    usdc: {
      mainnet: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    },
  },
  rpcUrl: {
    mainnet: "https://ethereum-rpc.publicnode.com",
    base: "https://base-rpc.publicnode.com",
  },
  explorer: {
    mainnet: "https://etherscan.io",
    base: "https://basescan.org",
  },
  storage_url: "https://rhzo270gblcou0le.public.blob.vercel-storage.com",
};
