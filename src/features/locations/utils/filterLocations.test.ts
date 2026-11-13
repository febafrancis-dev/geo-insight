import { describe, expect, it } from "vitest";
import { sampleLocations } from "../data/locations";
import type { LocationFilters } from "../types/location";
import { ALL_REGIONS, filterLocations } from "./filterLocations";

function createFilters(
  overrides: Partial<LocationFilters> = {},
): LocationFilters {
  return {
    searchQuery: "",
    region: ALL_REGIONS,
    minimumActivity: 0,
    ...overrides,
  };
}

describe("filterLocations", () => {
  it("searches city and country without case sensitivity", () => {
    const cityResults = filterLocations(
      sampleLocations,
      createFilters({ searchQuery: "kOcHi" }),
    );
    const countryResults = filterLocations(
      sampleLocations,
      createFilters({ searchQuery: "iNdIa" }),
    );

    expect(cityResults.map(({ id }) => id)).toEqual(["kochi"]);
    expect(countryResults.map(({ id }) => id)).toEqual(["kochi", "bengaluru"]);
  });

  it("trims leading and trailing spaces from the search query", () => {
    const results = filterLocations(
      sampleLocations,
      createFilters({ searchQuery: "  United Kingdom  " }),
    );

    expect(results.map(({ id }) => id)).toEqual(["london"]);
  });

  it("filters locations by region", () => {
    const results = filterLocations(
      sampleLocations,
      createFilters({ region: "Europe" }),
    );

    expect(results.map(({ id }) => id)).toEqual(["london"]);
  });

  it("returns locations from every region when all regions is selected", () => {
    const results = filterLocations(
      sampleLocations,
      createFilters({ region: ALL_REGIONS }),
    );

    expect(results).toEqual(sampleLocations);
  });

  it("includes locations at the minimum activity boundary", () => {
    const results = filterLocations(
      sampleLocations,
      createFilters({ minimumActivity: 654 }),
    );

    expect(results.map(({ id }) => id)).toEqual([
      "london",
      "singapore",
      "new-york",
    ]);
  });

  it("combines search, region, and minimum activity filters", () => {
    const results = filterLocations(
      sampleLocations,
      createFilters({
        searchQuery: "india",
        region: "South Asia",
        minimumActivity: 500,
      }),
    );

    expect(results.map(({ id }) => id)).toEqual(["bengaluru"]);
  });

  it("returns an empty array when no locations match", () => {
    const results = filterLocations(
      sampleLocations,
      createFilters({ searchQuery: "Atlantis" }),
    );

    expect(results).toEqual([]);
  });
});
