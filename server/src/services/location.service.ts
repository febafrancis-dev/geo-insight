import { sampleLocations } from "../../../shared/data/locations.js";
import type { Location } from "../../../shared/types/location.js";

export interface LocationQuery {
  search?: string;
  region?: string;
  minActivity?: number;
}

export function getLocations(query: LocationQuery = {}): Location[] {
  const search = query.search?.trim().toLocaleLowerCase();

  return sampleLocations.filter((location) => {
    const matchesSearch =
      !search ||
      location.city.toLocaleLowerCase().includes(search) ||
      location.country.toLocaleLowerCase().includes(search);
    const matchesRegion = !query.region || location.region === query.region;
    const matchesActivity =
      query.minActivity === undefined ||
      location.activityCount >= query.minActivity;

    return matchesSearch && matchesRegion && matchesActivity;
  });
}

export function getLocationById(id: string): Location | undefined {
  return sampleLocations.find((location) => location.id === id);
}
