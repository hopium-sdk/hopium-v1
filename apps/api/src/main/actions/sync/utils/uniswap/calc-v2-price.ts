import { normalizeAddress } from "@repo/common/utils/address";
import { T_Pool } from "@repo/convex/schema";
import { decodeV2SyncLog } from "../logs/filter-logs/uni-v2-sync";

export const _calcPoolPriceV2 = ({
  decoded,
  pool,
  baseAddress,
}: {
  decoded: ReturnType<typeof decodeV2SyncLog>;
  pool: T_Pool;
  baseAddress: string;
}): number | null => {
  const args: ReturnType<typeof decodeV2SyncLog>["args"] = decoded.args ?? {};

  // Uniswap V2 Sync event provides reserves as bigint
  const reserve0 = args.reserve0;
  const reserve1 = args.reserve1;

  const token0 = normalizeAddress(pool.details.token0);
  const token1 = normalizeAddress(pool.details.token1);
  const base = normalizeAddress(baseAddress);

  const d0 = BigInt(pool.details.decimals0 ?? 0);
  const d1 = BigInt(pool.details.decimals1 ?? 0);
  const pow10 = (n: bigint) => 10n ** n;

  const price = (resA: bigint, decA: bigint, resB: bigint, decB: bigint): number => {
    if (decB >= decA) {
      // resA * 10^(decB-decA) / resB
      const num = resA * pow10(decB - decA);
      return Number(num) / Number(resB);
    } else {
      // resA / (resB * 10^(decA-decB))
      const den = resB * pow10(decA - decB);
      return Number(resA) / Number(den);
    }
  };

  if (base === token0) {
    // base=t0, other=t1
    return price(reserve0, d0, reserve1, d1);
  } else if (base === token1) {
    // base=t1, other=t0
    return price(reserve1, d1, reserve0, d0);
  } else {
    return null;
  }
};
