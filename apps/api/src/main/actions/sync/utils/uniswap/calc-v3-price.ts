import { T_Pool } from "@repo/convex/schema";
import { decodeSwapV3Log } from "../logs/filter-logs/swap-v3";
import { normalizeAddress } from "@repo/common/utils/address";

export const _calcPoolPriceV3 = ({
  decoded,
  pool,
  baseAddress,
}: {
  decoded: ReturnType<typeof decodeSwapV3Log>;
  pool: T_Pool;
  baseAddress: string;
}): number | null => {
  const args: ReturnType<typeof decodeSwapV3Log>["args"] = decoded.args ?? {};

  // Ensure this looks like a V3 Swap event
  if (args.amount0 === undefined || args.amount1 === undefined) {
    return null;
  }

  const d0 = pool.details.decimals0 ?? 0;
  const d1 = pool.details.decimals1 ?? 0;
  const toDec = (x: bigint, d: number) => Number(x) / 10 ** d;

  // V3 logs use signed ints (pool perspective)
  const amount0Delta = toDec(BigInt(args.amount0), d0); // + => pool received token0
  const amount1Delta = toDec(BigInt(args.amount1), d1); // + => pool received token1

  // Determine trade direction from pool perspective
  let direction: "0->1" | "1->0";
  if (amount0Delta > 0 && amount1Delta < 0)
    direction = "0->1"; // trader swapped token0 -> token1
  else if (amount1Delta > 0 && amount0Delta < 0)
    direction = "1->0"; // trader swapped token1 -> token0
  else return null;

  const EPS = 1e-18;
  let price0Per1: number;
  let price1Per0: number;

  // Compute effective price from this swap
  // 0->1: pool got token0 (+), sent token1 (-)
  if (direction === "0->1") {
    const p1Per0 = Math.abs(amount0Delta) < EPS ? Number.NaN : -amount1Delta / amount0Delta;
    price1Per0 = p1Per0; // token1 per 1 token0
    price0Per1 = 1 / p1Per0; // token0 per 1 token1
  } else {
    const p0Per1 = Math.abs(amount1Delta) < EPS ? Number.NaN : -amount0Delta / amount1Delta;
    price0Per1 = p0Per1; // token0 per 1 token1
    price1Per0 = 1 / p0Per1; // token1 per 1 token0
  }

  // Normalize base
  const base = normalizeAddress(baseAddress);
  const token0 = normalizeAddress(pool.details.token0);
  const token1 = normalizeAddress(pool.details.token1);

  // Return the price of 1 base in terms of the other token
  if (base === token1) {
    // base = token0 → return token1 per 1 token0
    return price1Per0;
  } else if (base === token0) {
    // base = token1 → return token0 per 1 token1
    return price0Per1;
  } else {
    // base not in this pool
    return null;
  }
};
