import { useMemo } from "react";
import type { Location } from "../types/location";
import { useApiResource } from "../../../hooks/useApiResource";

interface LocationApiFilters {
  searchQuery?: string;
  region?: string;
  minimumActivity?: number;
}

export function useLocations(filters: LocationApiFilters = {}) {
  const path = useMemo(() => {
    const query = new URLSearchParams();
    const search = filters.searchQuery?.trim();

    if (search) {
      query.set("search", search);
    }
    if (filters.region) {
      query.set("region", filters.region);
    }
    if (filters.minimumActivity && filters.minimumActivity > 0) {
      query.set("minActivity", String(filters.minimumActivity));
    }

    const queryString = query.toString();
    return `/locations${queryString ? `?${queryString}` : ""}`;
  }, [filters.minimumActivity, filters.region, filters.searchQuery]);

  return useApiResource<Location[]>(path, []);
}
