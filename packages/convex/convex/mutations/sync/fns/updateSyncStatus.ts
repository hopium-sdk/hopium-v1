import { MutationCtx } from "../../../_generated/server";

export const _updateSyncStatus = async (ctx: MutationCtx, lastBlockNumber: number) => {
  const syncStatus = await ctx.db.query("sync_status").first();

  if (!syncStatus) {
    await ctx.db.insert("sync_status", { docId: "0", lastBlockNumber });
  } else {
    await ctx.db.patch(syncStatus._id, { lastBlockNumber });
  }
};
