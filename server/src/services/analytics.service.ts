import {
  monthlyLocationActivity,
  regionalActivity,
} from "../../../shared/data/analytics.js";

export function getMonthlyActivity() {
  return monthlyLocationActivity;
}

export function getRegionalDistribution() {
  return regionalActivity;
}
