import type { Location, LocationFilters } from "../types/location";

export const ALL_REGIONS = "all";

export function filterLocations(
  locations: readonly Location[],
  filters: LocationFilters,
): Location[] {
  const searchQuery = filters.searchQuery.trim().toLowerCase();

  return locations.filter((location) => {
    const matchesSearch =
      searchQuery.length === 0 ||
      location.city.toLowerCase().includes(searchQuery) ||
      location.country.toLowerCase().includes(searchQuery);
    const matchesRegion =
      filters.region === ALL_REGIONS || location.region === filters.region;
    const matchesActivity =
      location.activityCount >= filters.minimumActivity;

    return matchesSearch && matchesRegion && matchesActivity;
  });
}
