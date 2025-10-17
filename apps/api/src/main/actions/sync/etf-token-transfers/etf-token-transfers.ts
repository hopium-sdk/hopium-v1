import { T_QnLog } from "../schema";
import { sortLogsByChainOrder } from "../utils/logs/sortLogs";
import { buildTokenTransfers } from "../utils/token-transfer/build-token-transfers";

export const _syncEtfTokenTransfers = async ({ logs }: { logs: T_QnLog[] }) => {
  const sortedTransfers = sortLogsByChainOrder({ logs });

  const allEtfTokenTransfers = await buildTokenTransfers({ logs: sortedTransfers });

  return allEtfTokenTransfers;
};
