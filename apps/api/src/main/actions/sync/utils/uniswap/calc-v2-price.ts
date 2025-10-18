import { normalizeAddress } from "@repo/common/utils/address";
import { T_Pool } from "@repo/convex/schema";
import { decodeSwapV2Log } from "../logs/filter-logs/swap-v2";

export const _calcPoolPriceV2 = ({
  decoded,
  pool,
  baseAddress,
}: {
  decoded: ReturnType<typeof decodeSwapV2Log>;
  pool: T_Pool;
  baseAddress: string;
}): number | null => {
  const args: ReturnType<typeof decodeSwapV2Log>["args"] = decoded.args ?? {};

  // Ensure this is a Uniswap V2 Swap event
  if (args.amount0In === undefined || args.amount0Out === undefined || args.amount1In === undefined || args.amount1Out === undefined) {
    return null;
  }

  const d0 = pool.details.decimals0 ?? 0;
  const d1 = pool.details.decimals1 ?? 0;
  const toDec = (x: bigint, d: number) => Number(x) / 10 ** d;

  // Normalize amounts to decimals
  const amount0In = toDec(BigInt(args.amount0In), d0);
  const amount0Out = toDec(BigInt(args.amount0Out), d0);
  const amount1In = toDec(BigInt(args.amount1In), d1);
  const amount1Out = toDec(BigInt(args.amount1Out), d1);

  // Determine swap direction
  const direction = amount0In > 0 && amount1Out > 0 ? "0->1" : amount1In > 0 && amount0Out > 0 ? "1->0" : null;

  if (!direction) return null;

  // Compute trade-effective price ratio
  let price0Per1: number;
  let price1Per0: number;
  const EPS = 1e-18;

  if (direction === "0->1") {
    const p1Per0 = Math.abs(amount0In) < EPS ? Number.NaN : amount1Out / amount0In;
    price1Per0 = p1Per0; // token1 per 1 token0
    price0Per1 = 1 / p1Per0; // token0 per 1 token1
  } else {
    const p0Per1 = Math.abs(amount1In) < EPS ? Number.NaN : amount0Out / amount1In;
    price0Per1 = p0Per1; // token0 per 1 token1
    price1Per0 = 1 / p0Per1; // token1 per 1 token0
  }

  // Determine which token is base
  const base = normalizeAddress(baseAddress);
  const token0 = normalizeAddress(pool.details.token0);
  const token1 = normalizeAddress(pool.details.token1);

  // Return the price of 1 "base" in terms of the other token
  if (base === token1) {
    // base = token0 → return token1 per 1 token0
    return price1Per0;
  } else if (base === token0) {
    // base = token1 → return token0 per 1 token1
    return price0Per1;
  } else {
    return null; // base not part of this pool
  }
};
