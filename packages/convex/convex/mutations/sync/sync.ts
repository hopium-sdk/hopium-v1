import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { EtfSchema } from "../../schema/etf";
import { EtfTokenTransfersSchema } from "../../schema/etfTokenTranfers";
import { AssetSchema } from "../../schema/assets";
import { _upsertAssets } from "./fns/upsertAssets";
import { _upsertEtfs } from "./fns/upsertEtfs";
import { _upsertTokenTransfers } from "./fns/upsertTokenTransfers";
import { _updateSyncStatus } from "./fns/updateSyncStatus";

export default mutation({
  args: {
    etfs: v.array(v.object(EtfSchema)),
    etfTokenTransfers: v.array(v.object(EtfTokenTransfersSchema)),
    assets: v.array(v.object(AssetSchema)),
    lastBlockNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const { etfs, etfTokenTransfers, assets, lastBlockNumber } = args;

    await _upsertAssets(ctx, assets);
    await _upsertEtfs(ctx, etfs);
    await _upsertTokenTransfers(ctx, etfTokenTransfers);
    await _updateSyncStatus(ctx, lastBlockNumber);
  },
});
