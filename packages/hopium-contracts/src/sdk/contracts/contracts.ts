import { type Abi, getContract, type GetContractReturnType, type Client } from "viem";
import { getViemClient } from "../lib/viem";
import { _addresses } from "./addresses";
import { ABI } from "./abi";
import type { T_NETWORK } from "../utils/constants";

type ContractsReturnType = {
  abis: typeof ABI;
  addresses: ReturnType<typeof _addresses>;
  contracts: {
    uniswapOracle: () => Promise<GetContractReturnType<typeof ABI.uniswapOracle, Client>>;
    etfFactory: () => Promise<GetContractReturnType<typeof ABI.etfFactory, Client>>;
    etfOracle: () => Promise<GetContractReturnType<typeof ABI.etfOracle, Client>>;
    etfTokenEvents: () => Promise<GetContractReturnType<typeof ABI.etfTokenEvents, Client>>;
    erc20: ({ address }: { address: `0x${string}` }) => Promise<GetContractReturnType<typeof ABI.erc20, Client>>;
    etfAffiliate: () => Promise<GetContractReturnType<typeof ABI.etfAffiliate, Client>>;
  };
};

export const _contracts = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }): ContractsReturnType => {
  const client = getViemClient({ network, rpcUrl });
  const addresses = _addresses({ network, rpcUrl });

  const lazy =
    <A extends Abi>(abi: A, addr: () => Promise<`0x${string}`>) =>
    async (): Promise<GetContractReturnType<A, Client>> =>
      getContract({ address: await addr(), abi, client });

  return {
    abis: ABI,
    addresses,
    contracts: {
      uniswapOracle: lazy(ABI.uniswapOracle, addresses.uniswapOracle),
      etfFactory: lazy(ABI.etfFactory, addresses.etfFactory),
      etfOracle: lazy(ABI.etfOracle, addresses.etfOracle),
      etfTokenEvents: lazy(ABI.etfTokenEvents, addresses.etfTokenEvents),
      etfAffiliate: lazy(ABI.etfAffiliate, addresses.etfAffiliate),
      // no directory lookup needed; keep it tiny:
      erc20: ({ address }: { address: `0x${string}` }) => Promise.resolve(getContract({ address, abi: ABI.erc20, client })),
    },
  };
};
