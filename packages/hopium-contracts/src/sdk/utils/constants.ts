export type T_NETWORK = "mainnet" | "base";

type T_CONSTANTS = {
  addresses: {
    directory: {
      [key in T_NETWORK]: `0x${string}`;
    };
  };
};

export const CONSTANTS: T_CONSTANTS = {
  addresses: {
    directory: {
      mainnet: "0x0000000000000000000000000000000000000000",
      base: "0xEC8B3D03fae8fF245Fd629172E776811188C5447",
    },
  },
};
