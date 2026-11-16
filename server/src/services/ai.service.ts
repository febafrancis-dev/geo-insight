import {
  getMonthlyActivity,
  getRegionalDistribution,
} from "./analytics.service.js";
import { getLocations } from "./location.service.js";
import { ollamaInsightProvider } from "../config/ollama.js";
import type { AIInsightProvider, GeoInsightContext } from "../types/ai.js";

export function buildGeoInsightContext(): GeoInsightContext {
  const locations = getLocations();

  return {
    totalLocations: locations.length,
    activeRegions: new Set(locations.map(({ region }) => region)).size,
    totalActivity: locations.reduce(
      (total, { activityCount }) => total + activityCount,
      0,
    ),
    locations: locations.map(
      ({ city, country, region, activityCount }) => ({
        city,
        country,
        region,
        activityCount,
      }),
    ),
    monthlyActivity: getMonthlyActivity(),
    regionalDistribution: getRegionalDistribution(),
  };
}

export function createAIInsightService(
  provider: AIInsightProvider = ollamaInsightProvider,
) {
  return {
    generate(question: string) {
      return provider.generate(question, buildGeoInsightContext());
    },
  };
}
