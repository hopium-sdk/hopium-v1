import { COMMON_CONSTANTS, T_Network } from "@repo/common/utils/constants";

type T_CONSTANTS = {
  rpc: {
    [key in T_Network]: string;
  };
  qn: {
    url: string;
    apiKey: string;
    poolKey: string;
  };
};

export const CONSTANTS: T_CONSTANTS = {
  rpc: {
    mainnet: "https://hidden-black-aura.quiknode.pro/a0da55eaf9cbbcf5ef670100fbe2858884bcbc28",
    base: "https://hidden-black-aura.base-mainnet.quiknode.pro/a0da55eaf9cbbcf5ef670100fbe2858884bcbc28",
  },
  qn: {
    url: "https://api.quicknode.com",
    apiKey: "QN_b05ef5482043482cbe4d2bf12f06f7da",
    poolKey: "hopium-pools-" + COMMON_CONSTANTS.networkSelected,
  },
};
