import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { sampleLocations } from "../data/locations";
import useSavedLocations from "./useSavedLocations";

const STORAGE_KEY = "geo-insight:saved-location-ids";

beforeEach(() => {
  window.localStorage.clear();
});

describe("useSavedLocations", () => {
  it("starts with no saved locations when localStorage is empty", () => {
    const { result } = renderHook(() => useSavedLocations(sampleLocations));

    expect(result.current.savedLocations).toEqual([]);
    expect(result.current.savedLocationIds.size).toBe(0);
  });

  it("restores valid saved location IDs from localStorage", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(["london", "kochi"]),
    );

    const { result } = renderHook(() => useSavedLocations(sampleLocations));

    expect([...result.current.savedLocationIds]).toEqual(["london", "kochi"]);
    expect(result.current.savedLocations.map(({ id }) => id)).toEqual([
      "kochi",
      "london",
    ]);
  });

  it("ignores invalid and unknown saved location IDs", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(["kochi", "unknown-location", 42, null]),
    );

    const { result } = renderHook(() => useSavedLocations(sampleLocations));

    expect([...result.current.savedLocationIds]).toEqual(["kochi"]);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(
      JSON.stringify(["kochi"]),
    );
  });

  it("saves a location when its ID is toggled", () => {
    const { result } = renderHook(() => useSavedLocations(sampleLocations));

    act(() => {
      result.current.toggleSavedLocation("singapore");
    });

    expect([...result.current.savedLocationIds]).toEqual(["singapore"]);
    expect(result.current.savedLocations.map(({ id }) => id)).toEqual([
      "singapore",
    ]);
  });

  it("removes an already saved location", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(["kochi", "london"]),
    );
    const { result } = renderHook(() => useSavedLocations(sampleLocations));

    act(() => {
      result.current.removeSavedLocation("london");
    });

    expect([...result.current.savedLocationIds]).toEqual(["kochi"]);
    expect(result.current.savedLocations.map(({ id }) => id)).toEqual([
      "kochi",
    ]);
  });

  it("persists updated saved IDs in localStorage", () => {
    const { result } = renderHook(() => useSavedLocations(sampleLocations));

    act(() => {
      result.current.toggleSavedLocation("kochi");
      result.current.toggleSavedLocation("bengaluru");
    });

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(
      JSON.stringify(["kochi", "bengaluru"]),
    );
  });

  it("safely starts empty when localStorage contains malformed JSON", () => {
    window.localStorage.setItem(STORAGE_KEY, "{invalid json");

    const { result } = renderHook(() => useSavedLocations(sampleLocations));

    expect(result.current.savedLocations).toEqual([]);
    expect(result.current.savedLocationIds.size).toBe(0);
  });
});
