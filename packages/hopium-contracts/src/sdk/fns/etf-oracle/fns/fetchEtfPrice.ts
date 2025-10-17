import { _contracts } from "../../../contracts/contracts";
import type { T_NETWORK } from "../../../utils/constants";

export const _fetchEtfPrice = async ({ etfId, network, rpcUrl }: { etfId: bigint; network: T_NETWORK; rpcUrl: string }) => {
  const etfOracleContract = await _contracts({ network, rpcUrl }).contracts.etfOracle();

  const [etfPriceWeth, etfPriceUsd] = await Promise.all([etfOracleContract.read.getEtfWethPrice([etfId]), etfOracleContract.read.getEtfUsdPrice([etfId])]);

  return {
    etfPriceWeth: Number(etfPriceWeth) / 1e18,
    etfPriceUsd: Number(etfPriceUsd) / 1e18,
  };
};
