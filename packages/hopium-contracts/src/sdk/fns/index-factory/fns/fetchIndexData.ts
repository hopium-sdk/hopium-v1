import { _contracts } from "../../../contracts/contracts";
import type { T_NETWORK } from "../../../utils/constants";

export const _fetchIndexData = async ({ indexId, network, rpcUrl }: { indexId: bigint; network: T_NETWORK; rpcUrl: string }) => {
  const indexFactoryContract = await _contracts({ network, rpcUrl }).contracts.indexFactory();

  const index = await indexFactoryContract.read.getIndexById([indexId]);

  return index;
};
