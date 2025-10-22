// ../../lib/snapshotHelpers.ts
import { MutationCtx } from "../../../_generated/server";
import { T_TableName } from "../../../schema/sync/snapshot";

export async function snapshot(
  ctx: MutationCtx,
  opts: {
    blockNumber: number;
    table: T_TableName;
    docId: string;
    existed: boolean;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    before: any | null;
  }
) {
  const { blockNumber, table, docId } = opts;
  const already = await ctx.db
    .query("snapshots")
    .withIndex("by_block_table_docId", (q) => q.eq("blockNumber", blockNumber).eq("table", table).eq("docId", docId))
    .first();
  if (!already) await ctx.db.insert("snapshots", opts);
}
