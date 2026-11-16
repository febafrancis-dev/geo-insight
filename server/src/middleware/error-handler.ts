import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { ApiError } from "../types/api-error.js";

export const notFoundHandler: RequestHandler = (request, _response, next) => {
  next(new ApiError(404, "NOT_FOUND", `Route ${request.path} not found.`));
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  next,
) => {
  void next;

  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed.",
        details: error.issues.map(({ path, message }) => ({
          path: path.join("."),
          message,
        })),
      },
    });
    return;
  }

  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      error: { code: error.code, message: error.message },
    });
    return;
  }

  console.error("Unhandled API error:", error);
  response.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    },
  });
};
