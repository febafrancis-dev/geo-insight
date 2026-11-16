import type { RequestHandler } from "express";
import {
  getMonthlyActivity,
  getRegionalDistribution,
} from "../services/analytics.service.js";

export const getMonthlyActivityData: RequestHandler = (_request, response) => {
  response.json(getMonthlyActivity());
};

export const getRegionalDistributionData: RequestHandler = (
  _request,
  response,
) => {
  response.json(getRegionalDistribution());
};
