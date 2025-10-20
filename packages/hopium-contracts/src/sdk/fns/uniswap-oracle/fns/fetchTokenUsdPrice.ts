import { _contracts } from "../../../contracts/contracts";
import type { T_NETWORK } from "../../../utils/constants";
import { normalizeAddress } from "@repo/common/utils/address";

export const _fetchTokenUsdPrice = async ({ network, rpcUrl, tokenAddress }: { network: T_NETWORK; rpcUrl: string; tokenAddress: string }) => {
  const uniswapOracleContract = await _contracts({ network, rpcUrl }).contracts.uniswapOracle();

  const price18 = await uniswapOracleContract.read.getTokenUsdPrice([normalizeAddress(tokenAddress) as `0x${string}`]);

  return Number(price18) / 1e18;
};
