import { type Abi, getContract, type GetContractReturnType, type Client } from "viem";
import { getViemClient } from "../lib/viem";
import { _addresses } from "./addresses";
import { ABI } from "./abi";
import type { T_NETWORK } from "../utils/constants";

export const _contracts = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => {
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
      priceOracle: lazy(ABI.priceOracle, addresses.priceOracle),
      etfFactory: lazy(ABI.etfFactory, addresses.etfFactory),
      indexFactory: lazy(ABI.indexFactory, addresses.indexFactory),
      indexPriceOracle: lazy(ABI.indexPriceOracle, addresses.indexPriceOracle),
      etfTokenEvents: lazy(ABI.etfTokenEvents, addresses.etfTokenEvents),
      // no directory lookup needed; keep it tiny:
      erc20: ({ address }: { address: `0x${string}` }) => Promise.resolve(getContract({ address, abi: ABI.erc20, client })),
    },
  };
};
