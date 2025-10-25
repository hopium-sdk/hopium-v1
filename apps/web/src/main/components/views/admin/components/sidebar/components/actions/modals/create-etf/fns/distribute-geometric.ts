import { T_Token, TOTAL_BIPS, ZERO_ADDRESS } from "../create-etf";

export const distributeGeometric = (setTokens: React.Dispatch<React.SetStateAction<T_Token[]>>, ratio = 0.7) => {
  if (ratio <= 0 || ratio >= 1) ratio = 0.5; // guard against invalid ratios

  setTokens((prev) => {
    // Filter tokens that have valid addresses
    const valid = prev.map((t, i) => ({ t, i })).filter(({ t }) => t.address && t.address !== ZERO_ADDRESS);

    if (valid.length === 0) {
      // No valid tokens → zero all weights
      return prev.map((t) => ({ ...t, weight: 0 }));
    }

    // --- geometric decay weights ---
    const rawWeights = valid.map((_, k) => Math.pow(ratio, k));
    const denom = rawWeights.reduce((a, b) => a + b, 0);

    // convert to bips
    const exact = rawWeights.map((w) => (w / denom) * TOTAL_BIPS);
    const floors = exact.map((x) => Math.floor(x));

    // sum and correct rounding remainder to ensure total = 10000
    const total = floors.reduce((a, b) => a + b, 0);
    const remainder = TOTAL_BIPS - total;

    // assign remaining bips by largest fractional parts
    const fracs = exact.map((x, i) => ({ i, frac: x - floors[i]! }));
    fracs.sort((a, b) => b.frac - a.frac);
    for (let r = 0; r < remainder; r++) {
      floors[fracs[r]!.i]! += 1;
    }

    // build updated tokens array
    const updated = prev.map((t) => ({ ...t, weight: 0 }));
    valid.forEach(({ i }, idx) => {
      updated[i]!.weight = floors[idx]!;
    });

    return updated;
  });
};
