import { HopiumContracts } from "@repo/hopium-contracts";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";
import { CONSTANTS } from "./constants";

export const HOPIUM = new HopiumContracts({
  network: COMMON_CONSTANTS.networkSelected,
  rpcUrl: CONSTANTS.rpc[COMMON_CONSTANTS.networkSelected],
});
