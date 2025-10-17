import type { T_NETWORK } from "../../utils/constants";
import { _fetchEtfPrice } from "./fns/fetchEtfPrice";
import { _fetchEtfSnapshot } from "./fns/fetchEtfSnapshot";
import { _fetchEtfStats } from "./fns/fetchEtfStats";

export const _etfOracle = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => ({
  fetchEtfPrice: ({ etfId }: { etfId: bigint }) => _fetchEtfPrice({ etfId, network, rpcUrl }),
  fetchEtfSnapshot: ({ etfId }: { etfId: bigint }) => _fetchEtfSnapshot({ etfId, network, rpcUrl }),
  fetchEtfStats: ({ etfId }: { etfId: bigint }) => _fetchEtfStats({ etfId, network, rpcUrl }),
});
