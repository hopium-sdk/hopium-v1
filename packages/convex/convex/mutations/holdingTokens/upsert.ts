import { C_HoldingToken, HoldingTokensSchema } from "../../schema/holdingTokens";
import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { normalizeAddress } from "../../src/utils/normalizeAddress";
import assert from "assert";

export default mutation({
  args: {
    tokens: v.array(v.object(HoldingTokensSchema)),
  },
  handler: async (ctx, args) => {
    const { tokens } = args;

    const normalizedTokens = tokens.map((token) => ({
      ...token,
      address: normalizeAddress(token.address),
    }));

    const found = (
      await Promise.all(
        normalizedTokens.map(async (token) => {
          return await ctx.db
            .query("holding_tokens")
            .withIndex("by_address", (q) => q.eq("address", token.address))
            .first();
        })
      )
    ).filter((token) => token !== null) as C_HoldingToken[];

    const not_found = normalizedTokens.filter((token) => !found.find((c: C_HoldingToken) => c.address === token.address));

    if (not_found.length > 0) {
      for (const token of not_found) {
        await ctx.db.insert("holding_tokens", token);
      }
    }

    if (found.length > 0) {
      for (const token of found) {
        const new_token = normalizedTokens.find((c) => c.address === token.address);

        assert(new_token, `Token ${token.address} not found`);

        await ctx.db.patch(token._id, { ...new_token });
      }
    }
  },
});
