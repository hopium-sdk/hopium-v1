/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as fns_affiliate_getActivityByOwner from "../fns/affiliate/getActivityByOwner.js";
import type * as fns_affiliate_getAllCouponsByOwner from "../fns/affiliate/getAllCouponsByOwner.js";
import type * as fns_affiliate_getTotalEarnings from "../fns/affiliate/getTotalEarnings.js";
import type * as fns_etf_getAllEtfs from "../fns/etf/getAllEtfs.js";
import type * as fns_etf_getEtfList from "../fns/etf/getEtfList.js";
import type * as fns_etf_getEtfListByTag from "../fns/etf/getEtfListByTag.js";
import type * as fns_etf_getEtfWithAssetsAndPools from "../fns/etf/getEtfWithAssetsAndPools.js";
import type * as fns_etf_search from "../fns/etf/search.js";
import type * as fns_etf_utils_encrichWithAssetsAndPools from "../fns/etf/utils/encrichWithAssetsAndPools.js";
import type * as fns_etfToken_getAllPositionsByAddress from "../fns/etfToken/getAllPositionsByAddress.js";
import type * as fns_etfToken_getEtfTokenActivity from "../fns/etfToken/getEtfTokenActivity.js";
import type * as fns_etfToken_getEtfVolume from "../fns/etfToken/getEtfVolume.js";
import type * as fns_etfToken_getTokenBalanceByAddress from "../fns/etfToken/getTokenBalanceByAddress.js";
import type * as fns_etfToken_getTokenHolders from "../fns/etfToken/getTokenHolders.js";
import type * as fns_etfToken_getTotalVolume from "../fns/etfToken/getTotalVolume.js";
import type * as fns_ohlc_getHistorical from "../fns/ohlc/getHistorical.js";
import type * as fns_ohlc_getLatest from "../fns/ohlc/getLatest.js";
import type * as fns_platformFees_getPlatformFeeTransfers from "../fns/platformFees/getPlatformFeeTransfers.js";
import type * as fns_platformFees_getTotalPlatformFees from "../fns/platformFees/getTotalPlatformFees.js";
import type * as fns_pools_getWethUsdPrice from "../fns/pools/getWethUsdPrice.js";
import type * as fns_sync_fns_getAssetsByAddresses from "../fns/sync/fns/getAssetsByAddresses.js";
import type * as fns_sync_fns_getEtfsByIds from "../fns/sync/fns/getEtfsByIds.js";
import type * as fns_sync_fns_getEtfsByPoolAddreses from "../fns/sync/fns/getEtfsByPoolAddreses.js";
import type * as fns_sync_fns_getPoolsByAddresses from "../fns/sync/fns/getPoolsByAddresses.js";
import type * as fns_sync_fns_getWethUsdPool from "../fns/sync/fns/getWethUsdPool.js";
import type * as fns_sync_getPreloadCache from "../fns/sync/getPreloadCache.js";
import type * as fns_syncStatus_get from "../fns/syncStatus/get.js";
import type * as fns_user_getUserRewards from "../fns/user/getUserRewards.js";
import type * as fns_watchlist_getWatchlist from "../fns/watchlist/getWatchlist.js";
import type * as mutations__handleReorg_handle from "../mutations/_handleReorg/handle.js";
import type * as mutations_clearTable_clearTable from "../mutations/clearTable/clearTable.js";
import type * as mutations_etf_updateEtfs from "../mutations/etf/updateEtfs.js";
import type * as mutations_sync_fns_updateOhlcs from "../mutations/sync/fns/updateOhlcs.js";
import type * as mutations_sync_fns_updateSyncStatus from "../mutations/sync/fns/updateSyncStatus.js";
import type * as mutations_sync_fns_upsertAffiliateTransfers from "../mutations/sync/fns/upsertAffiliateTransfers.js";
import type * as mutations_sync_fns_upsertAffiliates from "../mutations/sync/fns/upsertAffiliates.js";
import type * as mutations_sync_fns_upsertAssets from "../mutations/sync/fns/upsertAssets.js";
import type * as mutations_sync_fns_upsertEtfs from "../mutations/sync/fns/upsertEtfs.js";
import type * as mutations_sync_fns_upsertPlatformFeeTransfers from "../mutations/sync/fns/upsertPlatformFeeTransfers.js";
import type * as mutations_sync_fns_upsertPools from "../mutations/sync/fns/upsertPools.js";
import type * as mutations_sync_fns_upsertTokenTransfers from "../mutations/sync/fns/upsertTokenTransfers.js";
import type * as mutations_sync_helpers_snapshot from "../mutations/sync/helpers/snapshot.js";
import type * as mutations_sync_sync from "../mutations/sync/sync.js";
import type * as mutations_watchlist_addToWatchlist from "../mutations/watchlist/addToWatchlist.js";
import type * as mutations_watchlist_removeFromWatchlist from "../mutations/watchlist/removeFromWatchlist.js";
import type * as mutations_watchlist_reorderWatchlist from "../mutations/watchlist/reorderWatchlist.js";
import type * as schema_affiliateTransfers from "../schema/affiliateTransfers.js";
import type * as schema_affiliates from "../schema/affiliates.js";
import type * as schema_assets from "../schema/assets.js";
import type * as schema_etf from "../schema/etf.js";
import type * as schema_etfTokenTranfers from "../schema/etfTokenTranfers.js";
import type * as schema_ohlc from "../schema/ohlc.js";
import type * as schema_platformFeeTransfers from "../schema/platformFeeTransfers.js";
import type * as schema_pools from "../schema/pools.js";
import type * as schema_sync_snapshot from "../schema/sync/snapshot.js";
import type * as schema_sync_syncStatus from "../schema/sync/syncStatus.js";
import type * as schema_watchlist from "../schema/watchlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "fns/affiliate/getActivityByOwner": typeof fns_affiliate_getActivityByOwner;
  "fns/affiliate/getAllCouponsByOwner": typeof fns_affiliate_getAllCouponsByOwner;
  "fns/affiliate/getTotalEarnings": typeof fns_affiliate_getTotalEarnings;
  "fns/etf/getAllEtfs": typeof fns_etf_getAllEtfs;
  "fns/etf/getEtfList": typeof fns_etf_getEtfList;
  "fns/etf/getEtfListByTag": typeof fns_etf_getEtfListByTag;
  "fns/etf/getEtfWithAssetsAndPools": typeof fns_etf_getEtfWithAssetsAndPools;
  "fns/etf/search": typeof fns_etf_search;
  "fns/etf/utils/encrichWithAssetsAndPools": typeof fns_etf_utils_encrichWithAssetsAndPools;
  "fns/etfToken/getAllPositionsByAddress": typeof fns_etfToken_getAllPositionsByAddress;
  "fns/etfToken/getEtfTokenActivity": typeof fns_etfToken_getEtfTokenActivity;
  "fns/etfToken/getEtfVolume": typeof fns_etfToken_getEtfVolume;
  "fns/etfToken/getTokenBalanceByAddress": typeof fns_etfToken_getTokenBalanceByAddress;
  "fns/etfToken/getTokenHolders": typeof fns_etfToken_getTokenHolders;
  "fns/etfToken/getTotalVolume": typeof fns_etfToken_getTotalVolume;
  "fns/ohlc/getHistorical": typeof fns_ohlc_getHistorical;
  "fns/ohlc/getLatest": typeof fns_ohlc_getLatest;
  "fns/platformFees/getPlatformFeeTransfers": typeof fns_platformFees_getPlatformFeeTransfers;
  "fns/platformFees/getTotalPlatformFees": typeof fns_platformFees_getTotalPlatformFees;
  "fns/pools/getWethUsdPrice": typeof fns_pools_getWethUsdPrice;
  "fns/sync/fns/getAssetsByAddresses": typeof fns_sync_fns_getAssetsByAddresses;
  "fns/sync/fns/getEtfsByIds": typeof fns_sync_fns_getEtfsByIds;
  "fns/sync/fns/getEtfsByPoolAddreses": typeof fns_sync_fns_getEtfsByPoolAddreses;
  "fns/sync/fns/getPoolsByAddresses": typeof fns_sync_fns_getPoolsByAddresses;
  "fns/sync/fns/getWethUsdPool": typeof fns_sync_fns_getWethUsdPool;
  "fns/sync/getPreloadCache": typeof fns_sync_getPreloadCache;
  "fns/syncStatus/get": typeof fns_syncStatus_get;
  "fns/user/getUserRewards": typeof fns_user_getUserRewards;
  "fns/watchlist/getWatchlist": typeof fns_watchlist_getWatchlist;
  "mutations/_handleReorg/handle": typeof mutations__handleReorg_handle;
  "mutations/clearTable/clearTable": typeof mutations_clearTable_clearTable;
  "mutations/etf/updateEtfs": typeof mutations_etf_updateEtfs;
  "mutations/sync/fns/updateOhlcs": typeof mutations_sync_fns_updateOhlcs;
  "mutations/sync/fns/updateSyncStatus": typeof mutations_sync_fns_updateSyncStatus;
  "mutations/sync/fns/upsertAffiliateTransfers": typeof mutations_sync_fns_upsertAffiliateTransfers;
  "mutations/sync/fns/upsertAffiliates": typeof mutations_sync_fns_upsertAffiliates;
  "mutations/sync/fns/upsertAssets": typeof mutations_sync_fns_upsertAssets;
  "mutations/sync/fns/upsertEtfs": typeof mutations_sync_fns_upsertEtfs;
  "mutations/sync/fns/upsertPlatformFeeTransfers": typeof mutations_sync_fns_upsertPlatformFeeTransfers;
  "mutations/sync/fns/upsertPools": typeof mutations_sync_fns_upsertPools;
  "mutations/sync/fns/upsertTokenTransfers": typeof mutations_sync_fns_upsertTokenTransfers;
  "mutations/sync/helpers/snapshot": typeof mutations_sync_helpers_snapshot;
  "mutations/sync/sync": typeof mutations_sync_sync;
  "mutations/watchlist/addToWatchlist": typeof mutations_watchlist_addToWatchlist;
  "mutations/watchlist/removeFromWatchlist": typeof mutations_watchlist_removeFromWatchlist;
  "mutations/watchlist/reorderWatchlist": typeof mutations_watchlist_reorderWatchlist;
  "schema/affiliateTransfers": typeof schema_affiliateTransfers;
  "schema/affiliates": typeof schema_affiliates;
  "schema/assets": typeof schema_assets;
  "schema/etf": typeof schema_etf;
  "schema/etfTokenTranfers": typeof schema_etfTokenTranfers;
  "schema/ohlc": typeof schema_ohlc;
  "schema/platformFeeTransfers": typeof schema_platformFeeTransfers;
  "schema/pools": typeof schema_pools;
  "schema/sync/snapshot": typeof schema_sync_snapshot;
  "schema/sync/syncStatus": typeof schema_sync_syncStatus;
  "schema/watchlist": typeof schema_watchlist;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
