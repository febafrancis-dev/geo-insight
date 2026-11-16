import { Router } from "express";
import { createAIController } from "../controllers/ai.controller.js";
import {
  createAIRateLimiter,
  type AIRateLimitOptions,
} from "../middleware/ai-rate-limit.js";
import { ollamaInsightProvider } from "../config/ollama.js";
import type { AIInsightProvider } from "../types/ai.js";

export function createAIRouter(
  provider: AIInsightProvider = ollamaInsightProvider,
  rateLimitOptions?: AIRateLimitOptions,
) {
  const router = Router();

  router.post(
    "/insights",
    createAIRateLimiter(rateLimitOptions),
    createAIController(provider),
  );

  return router;
}
