import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { defineTable } from "convex/server";

export const AffiliateTransfersSchema = {
  docId: v.string(),
  affiliateCode: v.string(),
  owner: v.string(),
  ethAmount: v.number(),
  txHash: v.string(),
  timestamp: v.number(),
};

export const affiliateTransfersTable = defineTable(AffiliateTransfersSchema).index("by_docId", ["docId"]).index("by_owner", ["owner", "timestamp"]);

export type C_AffiliateTransfers = Doc<"affiliate_transfers">;
export type T_AffiliateTransfers = Omit<Doc<"affiliate_transfers">, "_id" | "_creationTime">;

export const getAffiliateTransferId = ({ blockNumber, txHash, logIndex }: { blockNumber: number; txHash: string; logIndex: number }) => {
  return `${blockNumber}-${txHash}-${logIndex}`;
};
