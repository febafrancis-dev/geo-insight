import { z } from "zod";
import type { RequestHandler } from "express";
import { ApiError } from "../types/api-error.js";
import {
  getLocationById,
  getLocations,
} from "../services/location.service.js";

const locationQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  region: z.string().trim().min(1).max(100).optional(),
  minActivity: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().min(0))
    .optional(),
});
const locationParamsSchema = z.object({
  id: z.string().min(1),
});

export const listLocations: RequestHandler = (request, response) => {
  const query = locationQuerySchema.parse(request.query);
  response.json(getLocations(query));
};

export const readLocation: RequestHandler = (request, response) => {
  const { id } = locationParamsSchema.parse(request.params);
  const location = getLocationById(id);
  if (!location) {
    throw new ApiError(404, "LOCATION_NOT_FOUND", "Location not found.");
  }

  response.json(location);
};
