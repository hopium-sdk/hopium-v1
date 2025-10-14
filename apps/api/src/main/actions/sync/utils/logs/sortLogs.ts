import { T_QnLog } from "../../schema";

export const sortLogsByChainOrder = ({ logs }: { logs: T_QnLog[] }) => {
  const sortedLogs = [...logs].sort((a, b) => {
    // Convert hex or decimal strings safely
    const blockA = Number(a.blockNumber);
    const blockB = Number(b.blockNumber);

    if (blockA !== blockB) return blockA - blockB;

    const txA = Number(a.transactionIndex);
    const txB = Number(b.transactionIndex);
    if (txA !== txB) return txA - txB;

    const logA = Number(a.logIndex);
    const logB = Number(b.logIndex);
    return logA - logB;
  });

  return sortedLogs;
};
