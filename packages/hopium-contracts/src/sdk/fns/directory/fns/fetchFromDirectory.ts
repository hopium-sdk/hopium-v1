import { getContract, type Abi } from "viem";
import { ABI } from "../../../contracts/abi";
import { CONSTANTS, type T_NETWORK } from "../../../utils/constants";
import { getViemClient } from "../../../lib/viem";

export const _fetchFromDirectory = async ({ key, network, rpcUrl }: { key: string; network: T_NETWORK; rpcUrl: string }) => {
  const viemClient = getViemClient({ network, rpcUrl });

  const contract = getContract({
    address: CONSTANTS.addresses.directory[network] as `0x${string}`,
    abi: ABI.directory satisfies Abi,
    client: viemClient,
  });

  const addr = await contract.read.fetchFromDirectory([key]);

  return addr;
};
