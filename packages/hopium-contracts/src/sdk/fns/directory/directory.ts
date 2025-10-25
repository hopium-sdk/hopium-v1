import type { T_NETWORK } from "../../utils/constants";
import { _fetchFromDirectory } from "./fns/fetchFromDirectory";
import { _getOwner } from "./fns/getOwner";

export const _directory = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => ({
  fetchFromDirectory: ({ key }: { key: string }) => _fetchFromDirectory({ key, network, rpcUrl }),
  getOwner: () => _getOwner({ network, rpcUrl }),
});
