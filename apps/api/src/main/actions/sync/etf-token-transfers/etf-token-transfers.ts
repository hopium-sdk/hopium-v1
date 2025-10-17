import { T_QnLog } from "../schema";
import { sortLogsByChainOrder } from "../utils/logs/sortLogs";
import { buildTokenTransfers } from "../utils/token-transfer/build-token-transfers";
import { CONVEX } from "@/main/lib/convex";

export const _syncEtfTokenTransfers = async ({ logs }: { logs: T_QnLog[] }) => {
  const sortedTransfers = sortLogsByChainOrder({ logs });

  const allEtfTokenTransfers = await buildTokenTransfers({ logs: sortedTransfers });

  if (allEtfTokenTransfers.length > 0) {
    await CONVEX.httpClient.mutation(CONVEX.api.mutations.etfTokenTransfers.upsert.default, {
      etfTokenTransfers: allEtfTokenTransfers,
    });
  }

  if (allEtfTokenTransfers.length > 0) {
    console.log("Sync success for etf token transfers");
  }
};
