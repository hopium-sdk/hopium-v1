import { C_EtfTokenTransfer } from "../../convex/schema/etfTokenTranfers";

export const sortTransferByChainOrder = ({ transfers }: { transfers: C_EtfTokenTransfer[] }) => {
  const sortedTransfers = [...transfers].sort((a, b) => {
    if (a.blockNumber !== b.blockNumber) {
      return a.blockNumber - b.blockNumber;
    }
    if (a.transactionIndex !== b.transactionIndex) {
      return a.transactionIndex - b.transactionIndex;
    }
    return a.logIndex - b.logIndex;
  });

  return sortedTransfers;
};
