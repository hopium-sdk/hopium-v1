import { formatUnits } from "viem";
import { _contracts } from "../../../contracts/contracts";
import type { T_NETWORK } from "../../../utils/constants";

export const _fetchEtfSnapshot = async ({ etfId, network, rpcUrl }: { etfId: bigint; network: T_NETWORK; rpcUrl: string }) => {
  const etfOracleContract = await _contracts({ network, rpcUrl }).contracts.etfOracle();

  const [rows, etfTvlWeth, etfTvlUsd] = await etfOracleContract.read.snapshotVaultWithUsd([etfId]);

  return {
    s: rows.map((row) => ({
      tokenAddress: row.tokenAddress,
      tokenDecimals: Number(row.tokenDecimals),
      currentWeight: Number(row.currentWeight),
      tokenBalance: Number(formatUnits(row.tokenRawBalance, Number(row.tokenDecimals))),
      tokenPriceWeth: Number(row.tokenPriceWeth18) / 1e18,
      tokenPriceUsd: Number(row.tokenPriceUsd18) / 1e18,
      tokenValueWeth: Number(row.tokenValueWeth18) / 1e18,
      tokenValueUsd: Number(row.tokenValueUsd18) / 1e18,
    })),
    etfTvlWeth: Number(etfTvlWeth) / 1e18,
    etfTvlUsd: Number(etfTvlUsd) / 1e18,
  };
};
