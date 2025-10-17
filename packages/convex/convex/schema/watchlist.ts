import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { C_Etf } from "./etf";
import { defineTable } from "convex/server";

const watchlistItemSchema = v.object({
  etfId: v.number(),
  index: v.number(),
});

const WatchlistSchema = {
  userAddress: v.string(),
  items: v.array(watchlistItemSchema),
};

export const watchlistTable = defineTable(WatchlistSchema).index("by_userAddress", ["userAddress"]);

export type C_Watchlist = Doc<"watchlist">;
export type T_Watchlist = Omit<Doc<"watchlist">, "_id" | "_creationTime">;

export type C_WatchlistWithEtf = Omit<C_Watchlist, "items"> & {
  items: (C_Watchlist["items"][number] & { etf: C_Etf })[];
};
