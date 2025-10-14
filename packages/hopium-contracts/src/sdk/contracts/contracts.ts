import { type Abi, getContract, type GetContractReturnType, type Client } from "viem";
import { getViemClient } from "../lib/viem";
import { _addresses } from "./addresses";
import { ABI } from "./abi";
import type { T_NETWORK } from "../utils/constants";

async function fetchContract<const abi extends Abi>({
  address,
  _abi,
  network,
  rpcUrl,
}: {
  address: Promise<`0x${string}`>;
  _abi: abi;
  network: T_NETWORK;
  rpcUrl: string;
}): Promise<GetContractReturnType<abi, Client>> {
  const viemClient = getViemClient({ network, rpcUrl });
  const address_ = await address;
  return getContract({ address: address_, abi: _abi, client: viemClient });
}

export const _contracts = ({ network, rpcUrl }: { network: T_NETWORK; rpcUrl: string }) => ({
  abis: ABI,
  addresses: _addresses({ network, rpcUrl }),
  contracts: {
    priceOracle: fetchContract({ address: _addresses({ network, rpcUrl }).priceOracle, _abi: ABI.priceOracle, network, rpcUrl }),
    etfFactory: fetchContract({ address: _addresses({ network, rpcUrl }).etfFactory, _abi: ABI.etfFactory, network, rpcUrl }),
    indexFactory: fetchContract({ address: _addresses({ network, rpcUrl }).indexFactory, _abi: ABI.indexFactory, network, rpcUrl }),
    indexPriceOracle: fetchContract({ address: _addresses({ network, rpcUrl }).indexPriceOracle, _abi: ABI.indexPriceOracle, network, rpcUrl }),
    erc20: ({ address }: { address: `0x${string}` }) =>
      fetchContract({ address: new Promise((resolve) => resolve(address)), _abi: ABI.erc20, network, rpcUrl }),
    etfTokenEvents: fetchContract({ address: _addresses({ network, rpcUrl }).etfTokenEvents, _abi: ABI.etfTokenEvents, network, rpcUrl }),
  },
});
