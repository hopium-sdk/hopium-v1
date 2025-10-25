import { _isCodeTaken } from "./fns/is-code-taken";
import type { T_NETWORK } from "../../utils/constants";

export const _etfAffiliate = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => ({
  isCodeTaken: ({ code }: { code: string }) => _isCodeTaken({ code, network, rpcUrl }),
});
