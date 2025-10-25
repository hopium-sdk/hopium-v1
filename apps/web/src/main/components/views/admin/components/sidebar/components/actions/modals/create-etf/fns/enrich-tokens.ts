import { fetchAssetDetailsFromGeckoTerminal } from "@repo/common/utils/asset-details";
import { T_Token, ZERO_ADDRESS } from "../create-etf";
import { isEthAddress } from "@repo/common/utils/address";

export const needsFetch = (t: T_Token) =>
  t.address && t.address !== ZERO_ADDRESS && isEthAddress(t.address) && (!t.details.symbol || !t.details.name || !t.details.imageUrl);

export const enrichTokens = async (tokens: T_Token[], setTokens: React.Dispatch<React.SetStateAction<T_Token[]>>, inFlight: React.RefObject<boolean>) => {
  if (inFlight.current) return;
  const candidates = tokens.filter(needsFetch);
  if (candidates.length === 0) return;

  inFlight.current = true;
  try {
    const fetched = await Promise.all(
      candidates.map(async (token) => {
        try {
          const details = await fetchAssetDetailsFromGeckoTerminal({ tokenAddress: token.address });
          return {
            address: token.address,
            details: {
              symbol: details.symbol ?? "",
              name: details.name ?? "",
              imageUrl: details.image_url ?? "",
            },
          };
        } catch {
          // On failure, don't mutate details; just return current state
          return { address: token.address, details: token.details };
        }
      })
    );

    // apply updates only if something changed
    setTokens((prev) => {
      let changed = false;
      const updated = prev.map((t) => {
        const found = fetched.find((f) => f.address.toLowerCase() === t.address.toLowerCase());
        if (!found) return t;

        const next = { ...t, details: { ...t.details, ...found.details } };
        if (next.details.symbol !== t.details.symbol || next.details.name !== t.details.name || next.details.imageUrl !== t.details.imageUrl) {
          changed = true;
        }
        return next;
      });

      return changed ? updated : prev;
    });
  } finally {
    inFlight.current = false;
  }
};
