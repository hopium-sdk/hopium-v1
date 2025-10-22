import { _contracts } from "../../../contracts/contracts";
import type { T_NETWORK } from "../../../utils/constants";

export const _fetchEtfStats = async ({ etfId, network, rpcUrl }: { etfId: bigint; network: T_NETWORK; rpcUrl: string }) => {
  const etfOracleContract = await _contracts({ network, rpcUrl }).contracts.etfOracle();

  const stats = await etfOracleContract.read.getEtfStats([etfId]);

  return {
    assetsLiquidityUsd: Number(stats.assetsLiquidityUsd) / 1e18,
    assetsMcapUsd: Number(stats.assetsMcapUsd) / 1e18,
  };
};
