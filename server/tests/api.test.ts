import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import {
  monthlyLocationActivity,
  regionalActivity,
} from "../../shared/data/analytics.js";
import { sampleLocations } from "../../shared/data/locations.js";

describe("GeoInsight API", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reports a healthy server and allows both local frontend hostnames", async () => {
    for (const origin of [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ]) {
      const response = await request(app)
        .get("/api/health")
        .set("Origin", origin);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: "ok" });
      expect(response.headers["access-control-allow-origin"]).toBe(origin);
    }
  });

  it("does not grant CORS access to a non-local origin", async () => {
    const response = await request(app)
      .get("/api/health")
      .set("Origin", "https://example.com");

    expect(response.status).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("returns all locations from the shared dataset", async () => {
    const response = await request(app).get("/api/locations");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(sampleLocations);
  });

  it("returns one location by ID", async () => {
    const response = await request(app).get("/api/locations/london");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      sampleLocations.find(({ id }) => id === "london"),
    );
  });

  it("returns a safe not-found response for an unknown location ID", async () => {
    const response = await request(app).get("/api/locations/unknown");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: { code: "LOCATION_NOT_FOUND", message: "Location not found." },
    });
  });

  it("searches city and country names without case sensitivity", async () => {
    const response = await request(app).get("/api/locations?search=india");

    expect(response.status).toBe(200);
    expect(response.body.map(({ id }: { id: string }) => id)).toEqual([
      "kochi",
      "bengaluru",
    ]);
  });

  it("filters by region", async () => {
    const response = await request(app).get(
      "/api/locations?region=South%20Asia",
    );

    expect(response.status).toBe(200);
    expect(response.body.map(({ id }: { id: string }) => id)).toEqual([
      "kochi",
      "bengaluru",
    ]);
  });

  it("filters by minimum activity", async () => {
    const response = await request(app).get(
      "/api/locations?minActivity=800",
    );

    expect(response.status).toBe(200);
    expect(response.body.map(({ id }: { id: string }) => id)).toEqual([
      "london",
      "new-york",
    ]);
  });

  it("rejects invalid query parameters", async () => {
    const response = await request(app).get(
      "/api/locations?minActivity=not-a-number",
    );

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "minActivity" }),
      ]),
    );
  });

  it("rejects negative minimum activity values", async () => {
    const response = await request(app).get(
      "/api/locations?minActivity=-1",
    );

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns the existing monthly analytics values", async () => {
    const response = await request(app).get(
      "/api/analytics/monthly-activity",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(monthlyLocationActivity);
  });

  it("returns the existing regional distribution values", async () => {
    const response = await request(app).get(
      "/api/analytics/regional-distribution",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(regionalActivity);
  });

  it("returns a safe response for unknown routes", async () => {
    const response = await request(app).get("/api/missing");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });
});
