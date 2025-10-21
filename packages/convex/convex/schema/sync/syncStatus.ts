import { v } from "convex/values";
import { Doc } from "../../_generated/dataModel";
import { defineTable } from "convex/server";

export const SyncStatusSchema = {
  docId: v.string(),
  lastBlockNumber: v.number(),
};

export const syncStatusTable = defineTable(SyncStatusSchema).index("by_docId", ["docId"]);

export type C_SyncStatus = Doc<"sync_status">;
export type T_SyncStatus = Omit<Doc<"sync_status">, "_id" | "_creationTime">;
