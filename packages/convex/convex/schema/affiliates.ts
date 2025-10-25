import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { defineTable } from "convex/server";

export const AffiliateSchema = {
  docId: v.string(),
  affiliateCode: v.string(),
  owner: v.string(),
  createdAt: v.number(),
};

export const affiliateTable = defineTable(AffiliateSchema).index("by_docId", ["docId"]).index("by_owner", ["owner", "createdAt"]);

export type C_Affiliate = Doc<"affiliates">;
export type T_Affiliate = Omit<Doc<"affiliates">, "_id" | "_creationTime">;
