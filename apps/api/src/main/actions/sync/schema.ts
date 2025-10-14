import { z } from "zod";

export const qnLogSchema = z.object({
  address: z.string(),
  data: z.string(),
  topics: z.array(z.string()),
  timestamp: z.number(),
  transactionHash: z.string(),
  blockNumber: z.string(),
  logIndex: z.string(),
  transactionIndex: z.string(),
});

export const qnPayloadSchema = z.object({
  logs: z.array(qnLogSchema),
});

export type T_QnLog = z.infer<typeof qnLogSchema>;
