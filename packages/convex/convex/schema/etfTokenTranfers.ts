import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { defineTable } from "convex/server";

export const EtfTokenTransfersSchema = {
  transferId: v.string(),
  etfTokenAddress: v.string(),
  fromAddress: v.string(),
  toAddress: v.string(),
  transferAmount: v.number(),
  indexEthPrice: v.number(),
  blockNumber: v.number(),
  transactionIndex: v.number(),
  logIndex: v.number(),
  txHash: v.string(),
  syncBlockNumber_: v.number(),
};

export const etfTokenTransfersTable = defineTable(EtfTokenTransfersSchema)
  .index("by_transferId", ["transferId"])
  .index("by_syncBlockNumber", ["syncBlockNumber_"])
  .index("by_fromAddress", ["fromAddress"])
  .index("by_toAddress", ["toAddress"])
  .index("by_etfTokenAddress", ["etfTokenAddress"]);

export type C_EtfTokenTransfer = Doc<"etf_token_transfers">;
export type T_EtfTokenTransfer = Omit<Doc<"etf_token_transfers">, "_id" | "_creationTime">;

export const _getEtfTokenTransferId = ({ txHash, logIndex }: { txHash: string; logIndex: number }) => {
  return `${txHash}-${logIndex}`;
};
