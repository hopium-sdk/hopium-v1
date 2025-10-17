import { normalizeAddress } from "../../../../src/utils/normalizeAddress";
import { MutationCtx } from "../../../_generated/server";
import { C_EtfTokenTransfer, T_EtfTokenTransfer } from "../../../schema/etfTokenTranfers";
import assert from "assert";

export const _upsertTokenTransfers = async (ctx: MutationCtx, etfTokenTransfers: T_EtfTokenTransfer[]) => {
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
};
