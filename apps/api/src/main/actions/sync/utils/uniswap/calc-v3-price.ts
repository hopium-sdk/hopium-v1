import { normalizeAddress } from "@repo/common/utils/address";
import { T_Pool } from "@repo/convex/schema";

// Returns base-per-1-other (scaled 1e18), using the same math as _getTokenPriceV3.
export const _calcPoolPriceV3 = ({
  decoded, // must include sqrtPriceX96 from Swap event
  pool,
  baseAddress,
}: {
  decoded: { args?: { sqrtPriceX96?: bigint } }; // ensure your decoder surfaces this
  pool: T_Pool;
  baseAddress: string;
}): number | null => {
  const sqrt = decoded.args?.sqrtPriceX96;
  if (sqrt === undefined) return null;

  const Q96 = 1n << 96n;
  const priceQ96 = (sqrt * sqrt) / Q96; // = (token1/token0) * 2^96

  const token0 = normalizeAddress(pool.details.token0);
  const token1 = normalizeAddress(pool.details.token1);
  const base = normalizeAddress(baseAddress);

  const d0 = BigInt(pool.details.decimals0 ?? 0);
  const d1 = BigInt(pool.details.decimals1 ?? 0);
  const pow10 = (n: bigint) => 10n ** n;

  if (base === token1) {
    // base=t1, other=t0 → want (t1 per 1 t0)
    if (d0 >= d1) {
      // price = priceQ96 * 10^(d0-d1) / 2^96
      const num = priceQ96 * pow10(d0 - d1);
      return Number(num) / Number(Q96);
    } else {
      // price = priceQ96 / (2^96 * 10^(d1-d0))
      const den = Q96 * pow10(d1 - d0);
      return Number(priceQ96) / Number(den);
    }
  } else if (base === token0) {
    // base=t0, other=t1 → want inverse of (t1 per 1 t0)
    if (d1 >= d0) {
      // price = (2^96 * 10^(d1-d0)) / priceQ96
      const num = Q96 * pow10(d1 - d0);
      return Number(num) / Number(priceQ96);
    } else {
      // price = (2^96) / (priceQ96 * 10^(d0-d1))
      const den = priceQ96 * pow10(d0 - d1);
      return Number(Q96) / Number(den);
    }
  } else {
    return null;
  }
};
