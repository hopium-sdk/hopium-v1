import { T_Token, TOTAL_BIPS } from "../create-etf";
import { ZERO_ADDRESS } from "../create-etf";

export const distributeEvenly = (setTokens: React.Dispatch<React.SetStateAction<T_Token[]>>) => {
  setTokens((prev) => {
    const validIdxs = prev.map((t, i) => ({ t, i })).filter(({ t }) => t.address && t.address !== ZERO_ADDRESS);

    if (validIdxs.length === 0) return prev;

    const even = Math.floor(TOTAL_BIPS / validIdxs.length);
    const remainder = TOTAL_BIPS - even * validIdxs.length;

    const updated = prev.map((t) => ({ ...t })); // shallow copy
    validIdxs.forEach(({ i }, idx) => {
      const isLast = idx === validIdxs.length - 1;
      updated[i]!.weight = isLast ? even + remainder : even;
    });

    // optional: zero out empty-address token weights
    updated.forEach((t) => {
      if (!t.address || t.address === ZERO_ADDRESS) t.weight = 0;
    });

    return updated;
  });
};
