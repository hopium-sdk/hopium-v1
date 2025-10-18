import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { EtfSchema } from "../../schema/etf";
import { EtfTokenTransfersSchema } from "../../schema/etfTokenTranfers";
import { AssetSchema } from "../../schema/assets";
import { _upsertAssets } from "./fns/upsertAssets";
import { _upsertEtfs } from "./fns/upsertEtfs";
import { _upsertTokenTransfers } from "./fns/upsertTokenTransfers";
import { _updateSyncStatus } from "./fns/updateSyncStatus";
import { PoolSchema } from "../../schema/pools";
import { _upsertPools } from "./fns/upsertPools";
import { _updateOhlcs } from "./fns/updateOhlcs";

export default mutation({
  args: {
    etfs: v.array(v.object(EtfSchema)),
    etfTokenTransfers: v.array(v.object(EtfTokenTransfersSchema)),
    assets: v.array(v.object(AssetSchema)),
    pools: v.array(v.object(PoolSchema)),
    ohlcUpdates: v.array(
      v.object({
        etfId: v.number(),
        timestamp: v.number(),
        price: v.number(),
        syncBlockNumber_: v.number(),
      })
    ),
    lastBlockNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const { etfs, etfTokenTransfers, assets, pools, ohlcUpdates, lastBlockNumber } = args;

    await _upsertAssets(ctx, assets);
    await _upsertEtfs(ctx, etfs);
    await _upsertTokenTransfers(ctx, etfTokenTransfers);
    await _upsertPools(ctx, pools);
    await _updateOhlcs(ctx, ohlcUpdates);
    await _updateSyncStatus(ctx, lastBlockNumber);
  },
});
