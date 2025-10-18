import { normalizeAddress } from "../../../../src/utils/normalizeAddress";
import { QueryCtx } from "../../../_generated/server";
import { C_Pool } from "../../../schema/pools";

export const _getEtfsAndSupplyByPoolAddresses = async ({ ctx, poolAddresses }: { ctx: QueryCtx; poolAddresses: string[] }) => {
  const pools: C_Pool[] = (
    await Promise.all(
      poolAddresses.map(async (address) => {
        const pool = await ctx.db
          .query("pools")
          .withIndex("by_address", (q) => q.eq("address", normalizeAddress(address)))
          .first();

        return pool;
      })
    )
  ).filter((pool): pool is C_Pool => pool !== null);

  // Pre-build a set of all token addresses from all pools for O(1) lookup
  const poolTokenAddresses = new Set<string>();
  for (const pool of pools) {
    poolTokenAddresses.add(normalizeAddress(pool.details.token0));
    poolTokenAddresses.add(normalizeAddress(pool.details.token1));
  }

  const etfs = await ctx.db.query("etfs").collect();

  const finalEtfs = etfs.filter((etf) => etf.details.assets.some((asset) => poolTokenAddresses.has(normalizeAddress(asset.tokenAddress))));

  const etfSupplyMap = await _getEtfSupply({ ctx, tokenAddresses: finalEtfs.map((etf) => etf.contracts.etfTokenAddress) });

  return {
    etfs: finalEtfs,
    etfSupplyMap,
  };
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const _getEtfSupply = async ({ ctx, tokenAddresses }: { ctx: QueryCtx; tokenAddresses: string[] }) => {
  const totalSupplyMap = new Map<string, number>();

  for (const tokenAddress of tokenAddresses) {
    const normalizedTokenAddress = normalizeAddress(tokenAddress);
    // --- Fetch mints ---
    const mintedTransfers = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_token_from", (q) => q.eq("etfTokenAddress", normalizedTokenAddress).eq("fromAddress", ZERO_ADDRESS))
      .collect();

    const totalMinted = mintedTransfers.reduce((sum, t) => sum + t.transferAmount, 0);

    // --- Fetch burns ---
    const burnedTransfers = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_token_to", (q) => q.eq("etfTokenAddress", normalizedTokenAddress).eq("toAddress", ZERO_ADDRESS))
      .collect();

    const totalBurned = burnedTransfers.reduce((sum, t) => sum + t.transferAmount, 0);

    const totalSupply = totalMinted - totalBurned;

    totalSupplyMap.set(normalizedTokenAddress, totalSupply);
  }

  return Object.fromEntries(totalSupplyMap.entries());
};
