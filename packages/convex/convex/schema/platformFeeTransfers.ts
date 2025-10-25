import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { defineTable } from "convex/server";
import { C_Etf } from "./etf";

export const PlatformFeeTransfersSchema = {
  docId: v.string(),
  etfId: v.number(),
  amount: v.object({
    eth: v.number(),
    usd: v.number(),
  }),
  txHash: v.string(),
  timestamp: v.number(),
};

export const platformFeeTransfersTable = defineTable(PlatformFeeTransfersSchema).index("by_docId", ["docId"]);

export type C_PlatformFeeTransfers = Doc<"platform_fee_transfers">;
export type T_PlatformFeeTransfers = Omit<Doc<"platform_fee_transfers">, "_id" | "_creationTime">;

export type T_PlatformFeeTransferWithEtf = C_PlatformFeeTransfers & {
  etf: C_Etf | null;
};

export const getPlatformFeeTransferId = ({ blockNumber, txHash, logIndex }: { blockNumber: number; txHash: string; logIndex: number }) => {
  return `platform-fee-transfer-${blockNumber}-${txHash}-${logIndex}`;
};
