import { COMMON_CONSTANTS } from "@repo/common/utils/constants";
import { HopiumContracts } from "@repo/hopium-contracts";

export const HOPIUM = new HopiumContracts({
  network: COMMON_CONSTANTS.networkSelected,
  rpcUrl: COMMON_CONSTANTS.rpcUrl[COMMON_CONSTANTS.networkSelected],
});
