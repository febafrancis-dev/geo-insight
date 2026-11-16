import type { RequestHandler } from "express";
import { aiInsightRequestSchema } from "../schemas/ai.schema.js";
import type { AIInsightProvider } from "../types/ai.js";
import { createAIInsightService } from "../services/ai.service.js";

export function createAIController(
  provider: AIInsightProvider,
): RequestHandler {
  const aiService = createAIInsightService(provider);

  return async (request, response) => {
    const { question } = aiInsightRequestSchema.parse(request.body);
    const answer = await aiService.generate(question);

    response.json({ success: true, answer });
  };
}
