import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import assert from "assert";
import { normalizeAddress } from "../../src/utils/normalizeAddress";
import { C_DefaultToken, DefaultTokenSchema } from "../../schema/defaultTokensList";

export default mutation({
  args: {
    tokens: v.array(v.object(DefaultTokenSchema)),
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
            .query("default_tokens")
            .withIndex("by_address", (q) => q.eq("address", token.address))
            .first();
        })
      )
    ).filter((token) => token !== null) as C_DefaultToken[];

    const not_found = normalizedTokens.filter((token) => !found.find((c: C_DefaultToken) => c.address === token.address));

    if (not_found.length > 0) {
      for (const token of not_found) {
        await ctx.db.insert("default_tokens", token);
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
