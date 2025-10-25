import { _contracts } from "../../../contracts/contracts";
import type { T_NETWORK } from "../../../utils/constants";

export const _isCodeTaken = async ({ code, network, rpcUrl }: { code: string; network: T_NETWORK; rpcUrl: string }) => {
  const etfAffiliateContract = await _contracts({ network, rpcUrl }).contracts.etfAffiliate();

  const isCodeTaken = await etfAffiliateContract.read.isCodeTaken([code]);

  return isCodeTaken;
};
