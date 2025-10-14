import type { T_NETWORK } from "./utils/constants";
import { _fns } from "./fns/fns";
import { _contracts } from "./contracts/contracts";

export class HopiumContracts {
  readonly network: T_NETWORK;
  readonly rpcUrl: string;

  readonly fns: ReturnType<typeof _fns>;
  readonly contracts: ReturnType<typeof _contracts>;

  constructor({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) {
    this.network = network;
    this.rpcUrl = rpcUrl;

    this.fns = _fns({ network, rpcUrl });
    this.contracts = _contracts({ network, rpcUrl });
  }
}
