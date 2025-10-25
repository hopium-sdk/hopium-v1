import { _fetchEtfData } from "./fns/fetchEtfData";
import { _fetchEtfSeedPrice } from "./fns/fetchEtfSeedPrice";
import type { T_NETWORK } from "../../utils/constants";

export const _etfFactory = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => ({
  fetchEtfData: ({ etfId }: { etfId: bigint }) => _fetchEtfData({ etfId, network, rpcUrl }),
  fetchEtfSeedPrice: () => _fetchEtfSeedPrice({ network, rpcUrl }),
});
