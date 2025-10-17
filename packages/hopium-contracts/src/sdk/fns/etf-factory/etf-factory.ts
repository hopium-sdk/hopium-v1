import { _fetchEtfData } from "./fns/fetchEtfData";
import type { T_NETWORK } from "../../utils/constants";

export const _etfFactory = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => ({
  fetchEtfData: ({ etfId }: { etfId: bigint }) => _fetchEtfData({ etfId, network, rpcUrl }),
});
