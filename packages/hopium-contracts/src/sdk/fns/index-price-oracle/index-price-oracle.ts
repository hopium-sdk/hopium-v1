import { _fetchIndexMcapUsd } from "./fns/fetchIndexMcap";
import { _fetchIndexPrice } from "./fns/fetchIndexPrice";
import { _fetchIndexLiquidityUsd } from "./fns/fetchIndexLiquidity";
import type { T_NETWORK } from "../../utils/constants";

export const _indexPriceOracle = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => ({
  fetchIndexMcapUsd: ({ indexId }: { indexId: bigint }) => _fetchIndexMcapUsd({ indexId, network, rpcUrl }),
  fetchIndexPrice: ({ indexId }: { indexId: bigint }) => _fetchIndexPrice({ indexId, network, rpcUrl }),
  fetchIndexLiquidityUsd: ({ indexId }: { indexId: bigint }) => _fetchIndexLiquidityUsd({ indexId, network, rpcUrl }),
});
