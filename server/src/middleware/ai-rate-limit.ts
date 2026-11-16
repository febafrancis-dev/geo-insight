import { rateLimit } from "express-rate-limit";
import type { RequestHandler } from "express";
import { env } from "../config/env.js";

export interface AIRateLimitOptions {
  windowMs?: number;
  limit?: number;
}

export function createAIRateLimiter(
  options: AIRateLimitOptions = {},
): RequestHandler {
  return rateLimit({
    windowMs: options.windowMs ?? env.AI_RATE_LIMIT_WINDOW_MS,
    limit: options.limit ?? env.AI_RATE_LIMIT_MAX,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (_request, response) => {
      response.status(429).json({
        error: {
          code: "AI_RATE_LIMIT_EXCEEDED",
          message: "Too many AI insight requests. Please try again later.",
        },
      });
    },
  });
}
