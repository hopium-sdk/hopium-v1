/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as fns_defaultTokens_getByAddress from "../fns/defaultTokens/getByAddress.js";
import type * as fns_etf_getEtf from "../fns/etf/getEtf.js";
import type * as fns_etf_getEtfUnderlyingTokens from "../fns/etf/getEtfUnderlyingTokens.js";
import type * as fns_holders_getAllByTokenAddress from "../fns/holders/getAllByTokenAddress.js";
import type * as fns_holdingTokens_getFromAddresses from "../fns/holdingTokens/getFromAddresses.js";
import type * as fns_holdings_getAllByAddress from "../fns/holdings/getAllByAddress.js";
import type * as fns_syncStatus_get from "../fns/syncStatus/get.js";
import type * as fns_watchlist_getWatchlist from "../fns/watchlist/getWatchlist.js";
import type * as mutations__handleReorg_handle from "../mutations/_handleReorg/handle.js";
import type * as mutations_defaultTokens_upsert from "../mutations/defaultTokens/upsert.js";
import type * as mutations_etfTokenTransfers_upsert from "../mutations/etfTokenTransfers/upsert.js";
import type * as mutations_etfs_upsert from "../mutations/etfs/upsert.js";
import type * as mutations_holdingTokens_upsert from "../mutations/holdingTokens/upsert.js";
import type * as mutations_syncStatus_update from "../mutations/syncStatus/update.js";
import type * as mutations_watchlist_addToWatchlist from "../mutations/watchlist/addToWatchlist.js";
import type * as mutations_watchlist_removeFromWatchlist from "../mutations/watchlist/removeFromWatchlist.js";
import type * as mutations_watchlist_reorderWatchlist from "../mutations/watchlist/reorderWatchlist.js";
import type * as schema_defaultTokensList from "../schema/defaultTokensList.js";
import type * as schema_etf from "../schema/etf.js";
import type * as schema_etfTokenTranfers from "../schema/etfTokenTranfers.js";
import type * as schema_holdingTokens from "../schema/holdingTokens.js";
import type * as schema_syncStatus from "../schema/syncStatus.js";
import type * as schema_watchlist from "../schema/watchlist.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "fns/defaultTokens/getByAddress": typeof fns_defaultTokens_getByAddress;
  "fns/etf/getEtf": typeof fns_etf_getEtf;
  "fns/etf/getEtfUnderlyingTokens": typeof fns_etf_getEtfUnderlyingTokens;
  "fns/holders/getAllByTokenAddress": typeof fns_holders_getAllByTokenAddress;
  "fns/holdingTokens/getFromAddresses": typeof fns_holdingTokens_getFromAddresses;
  "fns/holdings/getAllByAddress": typeof fns_holdings_getAllByAddress;
  "fns/syncStatus/get": typeof fns_syncStatus_get;
  "fns/watchlist/getWatchlist": typeof fns_watchlist_getWatchlist;
  "mutations/_handleReorg/handle": typeof mutations__handleReorg_handle;
  "mutations/defaultTokens/upsert": typeof mutations_defaultTokens_upsert;
  "mutations/etfTokenTransfers/upsert": typeof mutations_etfTokenTransfers_upsert;
  "mutations/etfs/upsert": typeof mutations_etfs_upsert;
  "mutations/holdingTokens/upsert": typeof mutations_holdingTokens_upsert;
  "mutations/syncStatus/update": typeof mutations_syncStatus_update;
  "mutations/watchlist/addToWatchlist": typeof mutations_watchlist_addToWatchlist;
  "mutations/watchlist/removeFromWatchlist": typeof mutations_watchlist_removeFromWatchlist;
  "mutations/watchlist/reorderWatchlist": typeof mutations_watchlist_reorderWatchlist;
  "schema/defaultTokensList": typeof schema_defaultTokensList;
  "schema/etf": typeof schema_etf;
  "schema/etfTokenTranfers": typeof schema_etfTokenTranfers;
  "schema/holdingTokens": typeof schema_holdingTokens;
  "schema/syncStatus": typeof schema_syncStatus;
  "schema/watchlist": typeof schema_watchlist;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
