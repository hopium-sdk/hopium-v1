import { C_EtfTokenTransfer } from "../../../convex/schema/etfTokenTranfers";
import { normalizeAddress } from "../../utils/normalizeAddress";
import { sortTransferByChainOrder } from "../../utils/sortTransfer";

export type T_Holding = {
  tokenAddress: string;
  amount: number;
};

export const getAllHoldingsOfAddress = ({ allTransfers, address }: { allTransfers: C_EtfTokenTransfer[]; address: string }): T_Holding[] => {
  const me = normalizeAddress(address);

  // sort transfers in exact blockchain order
  const sortedTransfers = sortTransferByChainOrder({ transfers: allTransfers });

  const balances = new Map<string, number>();

  for (const t of sortedTransfers) {
    const token = normalizeAddress(t.etfTokenAddress);
    const prev = balances.get(token) ?? 0;

    let next = prev;

    // credit if I'm the receiver
    if (normalizeAddress(t.toAddress) === me) {
      next += t.transferAmount ?? 0;
    }

    // debit if I'm the sender
    if (normalizeAddress(t.fromAddress) === me) {
      next -= t.transferAmount ?? 0;
    }

    balances.set(token, next);
  }

  return Array.from(balances.entries())
    .map(([tokenAddress, amount]) => ({ tokenAddress, amount }))
    .filter((h) => h.amount !== 0)
    .sort((a, b) => a.tokenAddress.localeCompare(b.tokenAddress));
};
