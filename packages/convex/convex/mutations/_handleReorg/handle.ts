import { mutation, MutationCtx } from "../../_generated/server";
import { v } from "convex/values";
import { _updateSyncStatus } from "../sync/fns/updateSyncStatus";

// Remove Convex meta so we can patch/insert safely
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function stripMeta<T extends Record<string, any> | null | undefined>(doc: T): Omit<NonNullable<T>, "_id" | "_creationTime"> | null {
  if (!doc) return null;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const { _id, _creationTime, ...rest } = doc as any;
  return rest;
}

export default mutation({
  args: { safeBlockNumber: v.number() },
  handler: async (ctx, { safeBlockNumber }) => {
    // 1) Fetch all snapshots for unsafe blocks
    const snapshots = await ctx.db
      .query("snapshots")
      .withIndex("by_block", (q) => q.gt("blockNumber", safeBlockNumber))
      .collect();

    // Process newest → oldest so multi-block rollbacks land on the correct final state
    snapshots.sort((a, b) => b.blockNumber - a.blockNumber);

    console.log(`🌀 Reorg: rolling back ${snapshots.length} snapshots above block ${safeBlockNumber}`);

    for (const snap of snapshots) {
      const { table, docId, existed, before } = snap;

      // find current doc by our stable primary key
      const current = await ctx.db
        .query(table)
        .withIndex("by_docId", (q) => q.eq("docId", docId))
        .first();

      if (existed) {
        // Doc existed before this block — restore its previous image
        const clean = stripMeta(before);
        if (current) {
          await ctx.db.patch(current._id, clean!);
        } else {
          // @ts-ignore
          await ctx.db.insert(table, clean!);
        }
      } else {
        // Doc did not exist before — delete if present
        if (current) {
          await ctx.db.delete(current._id);
        }
      }

      // delete the snapshot (or mark revertedAt if you prefer to keep audit)
      await ctx.db.delete(snap._id);
    }

    await _updateWatchlists(ctx);
    await _updateSyncStatus(ctx, safeBlockNumber);

    console.log(`✅ Reorg rollback complete to block ${safeBlockNumber}`);
  },
});

// Rebuild watchlists against current DB
const _updateWatchlists = async (ctx: MutationCtx) => {
  const watchlists = await ctx.db.query("watchlist").collect();
  if (watchlists.length === 0) return;

  const referenced = new Set<number>();
  for (const wl of watchlists) {
    for (const it of wl.items ?? []) {
      if (it && typeof it.etfId === "number") referenced.add(it.etfId);
    }
  }
  if (referenced.size === 0) return;

  const checks = await Promise.all(
    Array.from(referenced).map(async (etfId) => {
      const row = await ctx.db
        .query("etfs")
        .withIndex("by_etfId", (q) => q.eq("details.etfId", etfId))
        .first();
      return [etfId, !!row] as const;
    })
  );
  const present = new Set(checks.filter(([, ok]) => ok).map(([id]) => id));

  for (const wl of watchlists) {
    const items = wl.items ?? [];
    const filtered = items.filter((it: { etfId: number }) => present.has(it.etfId));
    if (filtered.length !== items.length) {
      const reindexed = filtered.map((it, i) => ({ ...it, index: i }));
      await ctx.db.patch(wl._id, { items: reindexed });
    }
  }
};
