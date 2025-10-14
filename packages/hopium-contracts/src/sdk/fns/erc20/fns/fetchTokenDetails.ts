import { type T_NETWORK } from "../../../utils/constants";
import { _contracts } from "../../../contracts/contracts";

export const _fetchTokenDetails = async ({ tokenAddress, network, rpcUrl }: { tokenAddress: string; network: T_NETWORK; rpcUrl: string }) => {
  const erc20Contract = await _contracts({ network, rpcUrl }).contracts.erc20({ address: tokenAddress as `0x${string}` });

  const [name, symbol, decimals] = await Promise.allSettled([erc20Contract.read.name(), erc20Contract.read.symbol(), erc20Contract.read.decimals()]);

  const token = {
    address: tokenAddress as `0x${string}`,
    name: name.status === "fulfilled" ? name.value : "Unknown",
    symbol: symbol.status === "fulfilled" ? symbol.value : "Unknown",
    decimals: decimals.status === "fulfilled" ? decimals.value : 18,
  };

  return token;
};
