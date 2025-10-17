import { T_Network } from "@repo/common/utils/network";

type T_CONSTANTS = {
  networkSelected: T_Network;
  qn: {
    url: string;
    apiKey: string;
  };
};

export const CONSTANTS: T_CONSTANTS = {
  networkSelected: "base" as T_Network,
  qn: {
    url: "https://api.quicknode.com",
    apiKey: "QN_b05ef5482043482cbe4d2bf12f06f7da",
  },
};
