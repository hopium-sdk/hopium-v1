import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import assert from "assert";
import { normalizeAddress } from "../../src/utils/normalizeAddress";
import { EtfTokenTransfersSchema, C_EtfTokenTransfer } from "../../schema/etfTokenTranfers";

export default mutation({
  args: {
    etfTokenTransfers: v.array(v.object(EtfTokenTransfersSchema)),
  },
  handler: async (ctx, args) => {
    const { etfTokenTransfers } = args;

    const normalizedTransfers = etfTokenTransfers.map((etfTokenTransfer) => ({
      ...etfTokenTransfer,
      etfTokenAddress: normalizeAddress(etfTokenTransfer.etfTokenAddress),
      fromAddress: normalizeAddress(etfTokenTransfer.fromAddress),
      toAddress: normalizeAddress(etfTokenTransfer.toAddress),
    }));

    const found = (
      await Promise.all(
        normalizedTransfers.map(async (transfer) => {
          return await ctx.db
            .query("etf_token_transfers")
            .withIndex("by_transferId", (q) => q.eq("transferId", transfer.transferId))
            .first();
        })
      )
    ).filter((etf) => etf !== null) as C_EtfTokenTransfer[];

    const not_found = normalizedTransfers.filter((transfer) => !found.find((c: C_EtfTokenTransfer) => c.transferId === transfer.transferId));

    if (not_found.length > 0) {
      for (const transfer of not_found) {
        await ctx.db.insert("etf_token_transfers", transfer);
      }
    }

    if (found.length > 0) {
      for (const transfer of found) {
        const new_transfer = normalizedTransfers.find((c) => c.transferId === transfer.transferId);

        assert(new_transfer, `EtfTokenTransfer ${transfer.transferId} not found`);

        await ctx.db.patch(transfer._id, { ...new_transfer });
      }
    }
  },
});
