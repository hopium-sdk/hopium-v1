import { type T_NETWORK } from "../../../utils/constants";
import { _contracts } from "../../../contracts/contracts";

export const _fetchTotalSupply = async ({ tokenAddress, network, rpcUrl }: { tokenAddress: string; network: T_NETWORK; rpcUrl: string }) => {
  const erc20Contract = await _contracts({ network, rpcUrl }).contracts.erc20({ address: tokenAddress as `0x${string}` });

  const totalSupply = await erc20Contract.read.totalSupply();
  return totalSupply;
};
