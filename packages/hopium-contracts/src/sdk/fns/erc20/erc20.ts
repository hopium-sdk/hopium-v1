import type { T_NETWORK } from "../../utils/constants";
import { _fetchTokenDetails } from "./fns/fetchTokenDetails";

export const _erc20 = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => ({
  fetchTokenDetails: ({ tokenAddress }: { tokenAddress: `0x${string}` }) => _fetchTokenDetails({ tokenAddress, network, rpcUrl }),
});
