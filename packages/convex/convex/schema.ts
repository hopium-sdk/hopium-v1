import { defineSchema } from "convex/server";
import { etfsTable } from "./schema/etf";
import { assetsTable } from "./schema/assets";
import { etfTokenTransfersTable } from "./schema/etfTokenTranfers";
import { syncStatusTable } from "./schema/sync/syncStatus";
import { watchlistTable } from "./schema/watchlist";
import { ohlcTable } from "./schema/ohlc";
import { poolsTable } from "./schema/pools";
import { snapshotsTable } from "./schema/sync/snapshot";
import { affiliateTransfersTable } from "./schema/affiliateTransfers";
import { affiliateTable } from "./schema/affiliates";
import { platformFeeTransfersTable } from "./schema/platformFeeTransfers";

export const allSchemas = {
  etfs: etfsTable,
  assets: assetsTable,
  pools: poolsTable,
  ohlc: ohlcTable,
  etf_token_transfers: etfTokenTransfersTable,
  watchlist: watchlistTable,
  affiliate_transfers: affiliateTransfersTable,
  affiliates: affiliateTable,
  platform_fee_transfers: platformFeeTransfersTable,
  //Sync
  snapshots: snapshotsTable,
  sync_status: syncStatusTable,
};

export default defineSchema(allSchemas);
