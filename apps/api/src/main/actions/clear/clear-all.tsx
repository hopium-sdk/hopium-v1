import { CONVEX } from "@/main/lib/convex";
import { removeAllPoolsFromQn } from "../sync/utils/qn/upsert-assets";

export const clearAll = async () => {
  console.log("Clearing all data...");
  await clearTables();

  await removeAllPoolsFromQn();

  console.log("All data cleared");
};

const TABLES = [
  "etfs",
  "assets",
  "pools",
  "ohlc",
  "etf_token_transfers",
  "affiliate_transfers",
  "affiliates",
  "snapshots",
  "sync_status",
  "watchlist",
] as const;

const clearTables = async () => {
  for (const table of TABLES) {
    while (true) {
      const result = await CONVEX.httpClient.mutation(CONVEX.api.mutations.clearTable.clearTable.default, { table });
      if (result.clearedAll) {
        break;
      }
    }
  }
};
