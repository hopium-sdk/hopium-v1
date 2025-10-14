import { T_Network } from "@repo/common/utils/network";

type T_CONSTANTS = {
  networkSelected: T_Network;
  walletConnectProjectId: string;
  minTxFee: number;
};

export const CONSTANTS: T_CONSTANTS = {
  networkSelected: "base" as T_Network,
  walletConnectProjectId: "56348231b108df6a940310672041abdd",
  minTxFee: 0.00001,
};
