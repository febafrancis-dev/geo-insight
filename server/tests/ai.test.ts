import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import {
  monthlyLocationActivity,
  regionalActivity,
} from "../../shared/data/analytics.js";
import { sampleLocations } from "../../shared/data/locations.js";
import { createOllamaInsightProvider } from "../src/config/ollama.js";
import type { AIInsightProvider } from "../src/types/ai.js";

const question = "Which region has the highest activity?";
const answer = "North America has 680 locations.";

function mockOllamaFetch(
  response = new Response(
    JSON.stringify({ message: { content: answer } }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  ),
): ReturnType<typeof vi.fn<typeof fetch>> {
  return vi.fn<typeof fetch>().mockResolvedValue(response);
}

function createOllamaTestApp(
  fetchRequest: typeof fetch,
  options: { timeoutMs?: number } = {},
) {
  return createApp({
    aiProvider: createOllamaInsightProvider({
      baseUrl: "http://127.0.0.1:11434",
      model: "test-model",
      timeoutMs: options.timeoutMs,
      fetch: fetchRequest,
    }),
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("POST /api/ai/insights", () => {
  it("uses Ollama chat with the question and real dataset context", async () => {
    const fetchRequest = mockOllamaFetch();
    const response = await request(createOllamaTestApp(fetchRequest))
      .post("/api/ai/insights")
      .send({ question });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, answer });
    expect(fetchRequest).toHaveBeenCalledTimes(1);

    const [url, init] = fetchRequest.mock.calls[0];
    expect(url).toBe("http://127.0.0.1:11434/api/chat");
    expect(init?.method).toBe("POST");
    expect(init?.headers).toEqual({ "Content-Type": "application/json" });
    expect(typeof init?.body).toBe("string");
    if (typeof init?.body !== "string") {
      throw new Error("Expected an Ollama request body.");
    }

    const ollamaRequest = JSON.parse(init.body) as {
      model: string;
      stream: boolean;
      messages: Array<{ role: string; content: string }>;
    };
    expect(ollamaRequest.model).toBe("test-model");
    expect(ollamaRequest.stream).toBe(false);
    expect(ollamaRequest.messages).toHaveLength(2);
    expect(ollamaRequest.messages[0].role).toBe("system");
    expect(ollamaRequest.messages[0].content).toContain("untrusted data");
    expect(ollamaRequest.messages[1].role).toBe("user");

    const input = JSON.parse(ollamaRequest.messages[1].content) as {
      question: string;
      geoInsightDataset: {
        totalLocations: number;
        activeRegions: number;
        totalActivity: number;
        locations: Array<Record<string, unknown>>;
        monthlyActivity: Array<{ month: string; locations: number }>;
        regionalDistribution: Array<{ region: string; locations: number }>;
      };
    };

    expect(input.question).toBe(question);
    expect(input.geoInsightDataset).toMatchObject({
      totalLocations: 5,
      activeRegions: 4,
      totalActivity: 3277,
    });
    expect(input.geoInsightDataset.locations).toEqual(
      sampleLocations.map(({ city, country, region, activityCount }) => ({
        city,
        country,
        region,
        activityCount,
      })),
    );
    expect(input.geoInsightDataset.monthlyActivity).toEqual(
      monthlyLocationActivity,
    );
    expect(input.geoInsightDataset.regionalDistribution).toEqual(
      regionalActivity,
    );
    expect(input.geoInsightDataset.locations[0]).not.toHaveProperty(
      "coordinates",
    );
  });

  it("returns a safe error when Ollama is unavailable", async () => {
    const fetchRequest = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new TypeError("connection refused"));
    const response = await request(createOllamaTestApp(fetchRequest))
      .post("/api/ai/insights")
      .send({ question });

    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe("AI_PROVIDER_UNAVAILABLE");
    expect(response.body.error.message).toContain("Make sure Ollama is running");
    expect(JSON.stringify(response.body)).not.toContain("connection refused");
  });

  it("returns a safe error when the configured model is unavailable", async () => {
    const fetchRequest = mockOllamaFetch(
      new Response(JSON.stringify({ error: "private model error" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const response = await request(createOllamaTestApp(fetchRequest))
      .post("/api/ai/insights")
      .send({ question });

    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe("AI_MODEL_UNAVAILABLE");
    expect(JSON.stringify(response.body)).not.toContain("private model error");
  });

  it("rejects invalid Ollama responses without exposing provider details", async () => {
    const fetchRequest = mockOllamaFetch(
      new Response("{invalid json", {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const response = await request(createOllamaTestApp(fetchRequest))
      .post("/api/ai/insights")
      .send({ question });

    expect(response.status).toBe(502);
    expect(response.body.error.code).toBe("AI_INVALID_RESPONSE");
    expect(JSON.stringify(response.body)).not.toContain("invalid json");
  });

  it("maps Ollama request timeouts to a gateway timeout", async () => {
    const fetchRequest = vi.fn<typeof fetch>(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener(
            "abort",
            () => reject(new DOMException("private timeout detail", "TimeoutError")),
            { once: true },
          );
        }),
    );
    const response = await request(
      createOllamaTestApp(fetchRequest, { timeoutMs: 10 }),
    )
      .post("/api/ai/insights")
      .send({ question });

    expect(response.status).toBe(504);
    expect(response.body.error.code).toBe("AI_TIMEOUT");
    expect(JSON.stringify(response.body)).not.toContain("private timeout detail");
  });

  it("maps unexpected provider failures to a safe response", async () => {
    const fetchRequest = mockOllamaFetch(
      new Response(JSON.stringify({ error: "private provider failure" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const response = await request(createOllamaTestApp(fetchRequest))
      .post("/api/ai/insights")
      .send({ question });

    expect(response.status).toBe(502);
    expect(response.body.error.code).toBe("AI_PROVIDER_ERROR");
    expect(JSON.stringify(response.body)).not.toContain("private provider failure");
  });

  it("rejects empty questions", async () => {
    const response = await request(createApp())
      .post("/api/ai/insights")
      .send({ question: "   " });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects invalid request bodies", async () => {
    const response = await request(createApp())
      .post("/api/ai/insights")
      .send({ question: 42 });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects questions longer than 500 characters", async () => {
    const response = await request(createApp())
      .post("/api/ai/insights")
      .send({ question: "a".repeat(501) });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("limits the AI endpoint without limiting the health endpoint", async () => {
    const generate = vi.fn<AIInsightProvider["generate"]>().mockResolvedValue(
      "Dataset summary.",
    );
    const app = createApp({
      aiProvider: { generate },
      aiRateLimit: { windowMs: 60_000, limit: 1 },
    });

    const firstResponse = await request(app)
      .post("/api/ai/insights")
      .send({ question });
    const limitedResponse = await request(app)
      .post("/api/ai/insights")
      .send({ question });
    const healthResponse = await request(app).get("/api/health");

    expect(firstResponse.status).toBe(200);
    expect(limitedResponse.status).toBe(429);
    expect(limitedResponse.body.error.code).toBe("AI_RATE_LIMIT_EXCEEDED");
    expect(healthResponse.status).toBe(200);
    expect(generate).toHaveBeenCalledTimes(1);
  });
});
