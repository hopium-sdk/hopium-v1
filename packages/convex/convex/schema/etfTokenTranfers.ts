import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { defineTable } from "convex/server";
import { C_Etf } from "./etf";

export const EtfTokenTransfersSchema = {
  docId: v.string(),
  etfId: v.number(),
  fromAddress: v.string(),
  toAddress: v.string(),
  transferAmount: v.number(),
  etfPrice: v.object({
    eth: v.number(),
    usd: v.number(),
  }),
  blockNumber: v.number(),
  transactionIndex: v.number(),
  logIndex: v.number(),
  txHash: v.string(),
  timestamp: v.number(),
};

export const etfTokenTransfersTable = defineTable(EtfTokenTransfersSchema)
  .index("by_docId", ["docId"])
  .index("by_etfId", ["etfId"])
  .index("by_etf_from", ["etfId", "fromAddress"])
  .index("by_etf_to", ["etfId", "toAddress"])
  .index("by_from", ["fromAddress"])
  .index("by_to", ["toAddress"]);

export type C_EtfTokenTransfer = Doc<"etf_token_transfers">;
export type T_EtfTokenTransfer = Omit<Doc<"etf_token_transfers">, "_id" | "_creationTime">;

export const getEtfTokenTransferId = ({ blockNumber, txHash, logIndex }: { blockNumber: number; txHash: string; logIndex: number }) => {
  return `${blockNumber}-${txHash}-${logIndex}`;
};
