import { useCallback, useEffect, useMemo, useState } from "react";
import type { Location } from "../types/location";

const STORAGE_KEY = "geo-insight:saved-location-ids";

function readSavedLocationIds(knownLocationIds: ReadonlySet<string>): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (storedValue === null) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) {
      console.warn("Saved locations data is invalid; ignoring the stored value.");
      return [];
    }

    const stringIds = parsedValue.filter(
      (value: unknown): value is string => typeof value === "string",
    );
    const validIds = stringIds.filter((id) => knownLocationIds.has(id));

    if (validIds.length !== parsedValue.length) {
      console.warn("Invalid saved location IDs were ignored.");
    }

    return Array.from(new Set(validIds));
  } catch (error) {
    console.warn("Unable to read saved locations from localStorage.", error);
    return [];
  }
}

interface UseSavedLocationsResult {
  savedLocations: Location[];
  savedLocationIds: ReadonlySet<string>;
  toggleSavedLocation: (locationId: string) => void;
  removeSavedLocation: (locationId: string) => void;
}

function useSavedLocations(
  locations: readonly Location[],
): UseSavedLocationsResult {
  const knownLocationIds = useMemo(
    () => new Set(locations.map((location) => location.id)),
    [locations],
  );
  const [storedSavedLocationIds, setStoredSavedLocationIds] = useState<
    string[]
  >(() => readSavedLocationIds(knownLocationIds));
  const validSavedLocationIds = useMemo(
    () => storedSavedLocationIds.filter((id) => knownLocationIds.has(id)),
    [knownLocationIds, storedSavedLocationIds],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(validSavedLocationIds),
      );
    } catch (error) {
      console.warn("Unable to save locations to localStorage.", error);
    }
  }, [validSavedLocationIds]);

  const savedLocationIds = useMemo(
    () => new Set(validSavedLocationIds),
    [validSavedLocationIds],
  );
  const savedLocations = useMemo(
    () => locations.filter((location) => savedLocationIds.has(location.id)),
    [locations, savedLocationIds],
  );

  const toggleSavedLocation = useCallback(
    (locationId: string) => {
      if (!knownLocationIds.has(locationId)) {
        console.warn("Cannot save an unknown location.");
        return;
      }

      setStoredSavedLocationIds((currentIds) =>
        currentIds.includes(locationId)
          ? currentIds.filter((id) => id !== locationId)
          : [...currentIds, locationId],
      );
    },
    [knownLocationIds],
  );
  const removeSavedLocation = useCallback((locationId: string) => {
    setStoredSavedLocationIds((currentIds) =>
      currentIds.filter((id) => id !== locationId),
    );
  }, []);

  return {
    savedLocations,
    savedLocationIds,
    toggleSavedLocation,
    removeSavedLocation,
  };
}

export default useSavedLocations;
