import { normalizeAddress } from "../../../src/utils/normalizeAddress";
import { query } from "../../_generated/server";
import { v } from "convex/values";
import { C_EtfTokenTransfer } from "../../schema/etfTokenTranfers";
import { C_Etf } from "../../schema/etf";
import { sortTransferByChainOrder } from "../../../src/utils/sortTransfer";

export type T_EtfTokenPosition = {
  tokenAddress: string;
  tokenSymbol: string; // from etfs.details.ticker
  tokenName: string; // from etfs.details.name
  balance: number;
  avgEntryPrice: { eth: number; usd: number };
  currentPrice: { eth: number; usd: number };
  etfId: number;
  value: number;
};

type Running = { balance: number; avg: { eth: number; usd: number } };

export default query({
  args: { userAddress: v.string() },
  handler: async (ctx, args) => {
    const user = normalizeAddress(args.userAddress);

    // 1) Fetch transfers for this user (by from/to)
    const outgoing: C_EtfTokenTransfer[] = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_from", (q) => q.eq("fromAddress", user))
      .collect();

    const incoming: C_EtfTokenTransfer[] = await ctx.db
      .query("etf_token_transfers")
      .withIndex("by_to", (q) => q.eq("toAddress", user))
      .collect();

    // 2) Sort in chain order (blockNumber, txIndex, logIndex)
    const all = sortTransferByChainOrder({ transfers: [...incoming, ...outgoing] });

    // 3) Running balances + moving-average entry prices, keyed by etfId
    const state = new Map<number, Running>();
    const wavg = (prev: number, prevBal: number, px: number | undefined, qty: number, newBal: number) =>
      px == null || Number.isNaN(px) ? prev : (prev * prevBal + px * qty) / newBal;

    for (const t of all) {
      const etfId = t.etfId;
      const inbound = t.toAddress === user;
      const amt = t.transferAmount ?? 0;
      const curr = state.get(etfId) ?? { balance: 0, avg: { eth: 0, usd: 0 } };

      if (inbound) {
        const newBal = curr.balance + amt;
        if (newBal <= 0) {
          state.set(etfId, { balance: 0, avg: { eth: 0, usd: 0 } });
          continue;
        }
        const newAvgEth = wavg(curr.avg.eth, curr.balance, t.etfPrice?.eth, amt, newBal);
        const newAvgUsd = wavg(curr.avg.usd, curr.balance, t.etfPrice?.usd, amt, newBal);
        state.set(etfId, { balance: newBal, avg: { eth: newAvgEth, usd: newAvgUsd } });
      } else {
        const newBal = Math.max(0, curr.balance - amt);
        state.set(etfId, { balance: newBal, avg: newBal === 0 ? { eth: 0, usd: 0 } : curr.avg });
      }
    }

    // 4) Build positions for nonzero balances
    const base = Array.from(state.entries())
      .filter(([_, v]) => v.balance > 0)
      .map(([etfId, { balance, avg }]) => ({
        etfId,
        balance,
        avgEntryPrice: { eth: avg.eth, usd: avg.usd },
      }));

    // 5) Enrich from ETFs via etfId (by_etfId index)
    const enriched: T_EtfTokenPosition[] = [];
    for (const p of base) {
      const etf: C_Etf | null = await ctx.db
        .query("etfs")
        .withIndex("by_etfId", (q) => q.eq("details.etfId", p.etfId))
        .first();

      const tokenAddress = etf?.contracts?.etfTokenAddress ? normalizeAddress(etf.contracts.etfTokenAddress) : "";

      enriched.push({
        tokenAddress,
        tokenSymbol: etf?.details.ticker ?? "",
        tokenName: etf?.details.name ?? "",
        balance: p.balance,
        avgEntryPrice: p.avgEntryPrice,
        etfId: p.etfId,
        currentPrice: { eth: etf?.stats.price.eth ?? 0, usd: etf?.stats.price.usd ?? 0 },
        value: p.balance * (etf?.stats.price.usd ?? 0),
      });
    }

    // 6) Filter tiny dust positions (optional)
    const filtered = enriched.filter((p) => p.value > 0.01);

    return filtered;
  },
});
