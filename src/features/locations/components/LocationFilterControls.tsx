import { Filter, RotateCcw, Search } from "lucide-react";
import { ALL_REGIONS } from "../utils/filterLocations";

interface LocationFilterControlsProps {
  searchQuery: string;
  region: string;
  minimumActivity: number;
  regions: readonly string[];
  onSearchChange: (searchQuery: string) => void;
  onRegionChange: (region: string) => void;
  onMinimumActivityChange: (minimumActivity: number) => void;
  onClear: () => void;
}

const activityThresholds = [
  { value: 0, label: "Any activity" },
  { value: 300, label: "300+ activities" },
  { value: 500, label: "500+ activities" },
  { value: 800, label: "800+ activities" },
];

function LocationFilterControls({
  searchQuery,
  region,
  minimumActivity,
  regions,
  onSearchChange,
  onRegionChange,
  onMinimumActivityChange,
  onClear,
}: LocationFilterControlsProps) {
  return (
    <section
      aria-label="Location filters"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700">
            <Filter size={17} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900">
              Refine locations
            </h3>
            <p className="mt-0.5 text-xs leading-4 text-slate-500 sm:text-sm">
              Search and filter the map results.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <RotateCcw size={15} aria-hidden="true" />
          <span>Clear filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
        <div className="sm:col-span-2 xl:col-span-1">
          <label
            htmlFor="location-search"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Search locations
          </label>
          <div className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 px-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
            <Search size={16} aria-hidden="true" className="shrink-0 text-slate-400" />
            <input
              id="location-search"
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.currentTarget.value)}
              placeholder="City or country"
              className="min-w-0 w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="location-region"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Region
          </label>
          <select
            id="location-region"
            value={region}
            onChange={(event) => onRegionChange(event.currentTarget.value)}
            className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          >
            <option value={ALL_REGIONS}>All Regions</option>
            {regions.map((availableRegion) => (
              <option key={availableRegion} value={availableRegion}>
                {availableRegion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="location-activity"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Minimum activity
          </label>
          <select
            id="location-activity"
            value={minimumActivity}
            onChange={(event) =>
              onMinimumActivityChange(Number(event.currentTarget.value))
            }
            className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          >
            {activityThresholds.map((threshold) => (
              <option key={threshold.value} value={threshold.value}>
                {threshold.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

export default LocationFilterControls;
