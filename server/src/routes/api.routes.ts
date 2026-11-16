import { Router } from "express";
import { getHealth } from "../controllers/health.controller.js";
import {
  getMonthlyActivityData,
  getRegionalDistributionData,
} from "../controllers/analytics.controller.js";
import {
  listLocations,
  readLocation,
} from "../controllers/locations.controller.js";
import { createAIRouter } from "./ai.routes.js";
import type { AIRateLimitOptions } from "../middleware/ai-rate-limit.js";
import type { AIInsightProvider } from "../types/ai.js";

interface ApiRouterOptions {
  aiProvider?: AIInsightProvider;
  aiRateLimit?: AIRateLimitOptions;
}

export function createApiRouter(options: ApiRouterOptions = {}) {
  const apiRouter = Router();
  const locationsRouter = Router();
  const analyticsRouter = Router();

  locationsRouter.get("/", listLocations);
  locationsRouter.get("/:id", readLocation);
  analyticsRouter.get("/monthly-activity", getMonthlyActivityData);
  analyticsRouter.get("/regional-distribution", getRegionalDistributionData);

  apiRouter.get("/health", getHealth);
  apiRouter.use("/locations", locationsRouter);
  apiRouter.use("/analytics", analyticsRouter);
  apiRouter.use(
    "/ai",
    createAIRouter(options.aiProvider, options.aiRateLimit),
  );

  return apiRouter;
}
