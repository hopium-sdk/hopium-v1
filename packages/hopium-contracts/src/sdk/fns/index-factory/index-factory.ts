import { _fetchIndexData } from "./fns/fetchIndexData";
import type { T_NETWORK } from "../../utils/constants";

export const _indexFactory = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => ({
  fetchIndexData: ({ indexId }: { indexId: bigint }) => _fetchIndexData({ indexId, network, rpcUrl }),
});
