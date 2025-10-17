import { _contracts } from "../../../contracts/contracts";
import type { T_NETWORK } from "../../../utils/constants";

export const _fetchEtfData = async ({ etfId, network, rpcUrl }: { etfId: bigint; network: T_NETWORK; rpcUrl: string }) => {
  const etfFactoryContract = await _contracts({ network, rpcUrl }).contracts.etfFactory();

  const etf = await etfFactoryContract.read.getEtfById([etfId]);

  return etf;
};
