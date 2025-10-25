import { _contracts } from "../../../contracts/contracts";
import type { T_NETWORK } from "../../../utils/constants";

export const _getOwner = async ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => {
  const directoryContract = await _contracts({ network, rpcUrl }).contracts.directory();

  const owner = await directoryContract.read.owner();

  return owner;
};
