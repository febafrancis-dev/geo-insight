import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import LocationFilterControls from "../../features/locations/components/LocationFilterControls";
import LocationMap from "../../features/locations/components/LocationMap";
import { sampleLocations } from "../../features/locations/data/locations";
import type { LocationFilters } from "../../features/locations/types/location";
import {
  ALL_REGIONS,
  filterLocations,
} from "../../features/locations/utils/filterLocations";

interface ExploreMapPageProps {
  searchQuery: string;
  onSearchQueryChange: (searchQuery: string) => void;
  savedLocationIds: ReadonlySet<string>;
  onToggleSavedLocation: (locationId: string) => void;
}

const initialFilters: Pick<LocationFilters, "region" | "minimumActivity"> = {
  region: ALL_REGIONS,
  minimumActivity: 0,
};

function ExploreMapPage({
  searchQuery,
  onSearchQueryChange,
  savedLocationIds,
  onToggleSavedLocation,
}: ExploreMapPageProps) {
  const [filters, setFilters] =
    useState<typeof initialFilters>(initialFilters);
  const regions = useMemo(
    () =>
      Array.from(
        new Set(sampleLocations.map((location) => location.region)),
      ).sort((first, second) => first.localeCompare(second)),
    [],
  );
  const matchingLocations = useMemo(
    () => filterLocations(sampleLocations, { ...filters, searchQuery }),
    [filters, searchQuery],
  );

  return (
    <section
      aria-labelledby="explore-locations-heading"
      className="min-w-0"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="explore-locations-heading"
            className="text-xl font-semibold tracking-tight text-slate-900"
          >
            Explore Locations
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            Explore tracked locations and their regional activity.
          </p>
        </div>
        <p
          className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-800"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <MapPin size={16} aria-hidden="true" className="text-blue-600" />
          {matchingLocations.length}{" "}
          {matchingLocations.length === 1 ? "location" : "locations"} found
        </p>
      </div>
      <div className="space-y-4">
        <LocationFilterControls
          searchQuery={searchQuery}
          region={filters.region}
          minimumActivity={filters.minimumActivity}
          regions={regions}
          onSearchChange={onSearchQueryChange}
          onRegionChange={(region) =>
            setFilters((current) => ({ ...current, region }))
          }
          onMinimumActivityChange={(minimumActivity) =>
            setFilters((current) => ({ ...current, minimumActivity }))
          }
          onClear={() => {
            setFilters(initialFilters);
            onSearchQueryChange("");
          }}
        />
        <LocationMap
          locations={matchingLocations}
          savedLocationIds={savedLocationIds}
          onToggleSavedLocation={onToggleSavedLocation}
        />
      </div>
    </section>
  );
}

export default ExploreMapPage;
