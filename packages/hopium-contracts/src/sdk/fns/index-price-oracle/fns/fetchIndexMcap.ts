import { _contracts } from "../../../contracts/contracts";
import type { T_NETWORK } from "../../../utils/constants";

export const _fetchIndexMcapUsd = async ({ indexId, network, rpcUrl }: { indexId: bigint; network: T_NETWORK; rpcUrl: string }) => {
  const indexPriceOracleContract = await _contracts({ network, rpcUrl }).contracts.indexPriceOracle();

  const indexMcapUsd = await indexPriceOracleContract.read.getIndexMarketCapUsd([indexId]);

  return Number(indexMcapUsd) / 1e18;
};
