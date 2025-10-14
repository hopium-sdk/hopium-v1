import { C_EtfTokenTransfer } from "../../../convex/schema/etfTokenTranfers";
import { normalizeAddress } from "../../utils/normalizeAddress";
import { sortTransferByChainOrder } from "../../utils/sortTransfer";

type Holder = {
  address: string;
  amount: number;
};

const ZERO_ADDRESS = normalizeAddress("0x0000000000000000000000000000000000000000");

export const getAllHoldersByTokenAddress = async ({
  allTransfers,
  tokenAddress,
}: {
  allTransfers: C_EtfTokenTransfer[];
  tokenAddress: string;
}): Promise<Holder[]> => {
  const token = normalizeAddress(tokenAddress);

  // in case caller didn’t pre-filter, ensure we only process this token
  const onlyThisToken = allTransfers.filter((t) => normalizeAddress(t.etfTokenAddress) === token);

  const sorted = sortTransferByChainOrder({ transfers: onlyThisToken });

  const balances = new Map<string, number>();

  for (const t of sorted) {
    const from = normalizeAddress(t.fromAddress);
    const to = normalizeAddress(t.toAddress);
    const amt = t.transferAmount ?? 0;

    // debit sender
    balances.set(from, (balances.get(from) ?? 0) - amt);
    // credit receiver
    balances.set(to, (balances.get(to) ?? 0) + amt);
  }

  // build holder list, excluding zero address and zero balances
  const holders: Holder[] = [];
  for (const [address, amount] of balances.entries()) {
    if (address === ZERO_ADDRESS) continue; // exclude mint/burn address
    if (amount === 0) continue;
    holders.push({ address, amount });
  }

  // sort by amount desc, then address asc for determinism
  holders.sort((a, b) => b.amount - a.amount || a.address.localeCompare(b.address));

  return holders;
};
