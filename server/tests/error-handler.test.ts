import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../src/middleware/error-handler.js";

describe("error handler", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not expose unexpected error details to API clients", async () => {
    const failingApp = express();
    failingApp.get("/failure", () => {
      throw new Error("private implementation detail");
    });
    failingApp.use(errorHandler);
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await request(failingApp).get("/failure");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred.",
      },
    });
    expect(JSON.stringify(response.body)).not.toContain(
      "private implementation detail",
    );
  });
});
