import { postApiData } from "../../../services/api";
import type { AIInsightRequest, AIInsightResponse } from "../types";

export function requestAIInsight(
  body: AIInsightRequest,
  signal: AbortSignal,
): Promise<AIInsightResponse> {
  return postApiData<AIInsightResponse, AIInsightRequest>(
    "/ai/insights",
    body,
    signal,
  );
}
