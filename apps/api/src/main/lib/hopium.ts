import { HopiumContracts } from "@repo/hopium-contracts";
import { CONSTANTS } from "./constants";

export const HOPIUM = new HopiumContracts({
  network: CONSTANTS.networkSelected,
  rpcUrl: CONSTANTS.rpcUrl[CONSTANTS.networkSelected],
});
