import { z } from "zod";

export const aiInsightRequestSchema = z
  .object({
    question: z.string().max(500).trim().min(1).max(500),
  })
  .strict();

export type AIInsightRequest = z.infer<typeof aiInsightRequestSchema>;
