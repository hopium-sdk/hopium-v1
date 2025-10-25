import { _contracts } from "../../../contracts/contracts";
import type { T_NETWORK } from "../../../utils/constants";

export const _fetchEtfSeedPrice = async ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => {
  const etfFactoryContract = await _contracts({ network, rpcUrl }).contracts.etfFactory();

  const seedPrice = await etfFactoryContract.read.getSeedPrice();

  return seedPrice;
};
