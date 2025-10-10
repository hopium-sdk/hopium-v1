import { defineSchema } from "convex/server";
import { defaultTokensTable } from "./schema/defaultTokensList";
import { etfsTable } from "./schema/etf";
import { holdingTokensTable } from "./schema/holdingTokens";
import { etfTokenTransfersTable } from "./schema/etfTokenTranfers";
import { syncStatusTable } from "./schema/syncStatus";
import { watchlistTable } from "./schema/watchlist";

export const allSchemas = {
  sync_status: syncStatusTable,
  default_tokens: defaultTokensTable,
  etfs: etfsTable,
  holding_tokens: holdingTokensTable,
  etf_token_transfers: etfTokenTransfersTable,
  watchlist: watchlistTable,
};

export default defineSchema(allSchemas);
