import { HopiumContracts } from "@repo/hopium-contracts";
import { CONSTANTS } from "./constants";
import { NETWORK } from "@repo/common/utils/network";

export const HOPIUM = new HopiumContracts({
  network: CONSTANTS.networkSelected,
  rpcUrl: NETWORK.rpcUrl[CONSTANTS.networkSelected],
});
