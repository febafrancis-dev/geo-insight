import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { createApiRouter } from "./routes/api.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import type { AIRateLimitOptions } from "./middleware/ai-rate-limit.js";
import type { AIInsightProvider } from "./types/ai.js";

const configuredFrontendUrl = new URL(env.FRONTEND_ORIGIN);
const frontendOrigins = new Set([configuredFrontendUrl.origin]);

if (configuredFrontendUrl.hostname === "localhost") {
  configuredFrontendUrl.hostname = "127.0.0.1";
  frontendOrigins.add(configuredFrontendUrl.origin);
} else if (configuredFrontendUrl.hostname === "127.0.0.1") {
  configuredFrontendUrl.hostname = "localhost";
  frontendOrigins.add(configuredFrontendUrl.origin);
}

export interface AppOptions {
  aiProvider?: AIInsightProvider;
  aiRateLimit?: AIRateLimitOptions;
}

export function createApp(options: AppOptions = {}) {
  const app = express();

  app.use(cors({ origin: [...frontendOrigins] }));
  app.use(express.json({ limit: "100kb" }));
  app.use("/api", createApiRouter(options));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

const app = createApp();

export default app;
