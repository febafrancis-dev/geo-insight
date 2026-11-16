import type {
  MonthlyLocationActivity,
  RegionalActivity,
} from "../../../shared/types/analytics.js";

export interface InsightLocation {
  city: string;
  country: string;
  region: string;
  activityCount: number;
}

export interface GeoInsightContext {
  totalLocations: number;
  activeRegions: number;
  totalActivity: number;
  locations: InsightLocation[];
  monthlyActivity: MonthlyLocationActivity[];
  regionalDistribution: RegionalActivity[];
}

export interface AIInsightProvider {
  generate(question: string, context: GeoInsightContext): Promise<string>;
}
