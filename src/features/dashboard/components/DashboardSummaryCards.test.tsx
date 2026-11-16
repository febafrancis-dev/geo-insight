import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { sampleLocations } from "../../locations/data/locations";
import DashboardSummaryCards from "./DashboardSummaryCards";

function getStatValue(title: string, value: string) {
  const card = screen
    .getByRole("heading", { name: title })
    .closest("article");

  if (!card) {
    throw new Error(`Could not find the card for "${title}".`);
  }

  return within(card).getByText(value);
}

describe("DashboardSummaryCards", () => {
  it("displays the total count derived from sample locations", () => {
    render(
      <DashboardSummaryCards
        locations={sampleLocations}
        isLoading={false}
        error={null}
        savedLocationCount={0}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Total Locations" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(sampleLocations.length.toLocaleString()),
    ).toBeInTheDocument();
  });

  it("displays the number of unique regions in sample locations", () => {
    const activeRegionCount = new Set(
      sampleLocations.map(({ region }) => region),
    ).size;

    render(
      <DashboardSummaryCards
        locations={sampleLocations}
        isLoading={false}
        error={null}
        savedLocationCount={0}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Active Regions" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(activeRegionCount.toLocaleString()),
    ).toBeInTheDocument();
  });

  it("displays the sum of activity counts in sample locations", () => {
    const totalActivity = sampleLocations.reduce(
      (total, { activityCount }) => total + activityCount,
      0,
    );

    render(
      <DashboardSummaryCards
        locations={sampleLocations}
        isLoading={false}
        error={null}
        savedLocationCount={0}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Total Activity" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(totalActivity.toLocaleString()),
    ).toBeInTheDocument();
  });

  it("displays the saved location count passed as a prop", () => {
    render(
      <DashboardSummaryCards
        locations={sampleLocations}
        isLoading={false}
        error={null}
        savedLocationCount={3}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Saved Locations" }),
    ).toBeInTheDocument();
    expect(getStatValue("Saved Locations", "3")).toBeInTheDocument();
  });

  it("updates the saved location count when rerendered with a new value", () => {
    const { rerender } = render(
      <DashboardSummaryCards
        locations={sampleLocations}
        isLoading={false}
        error={null}
        savedLocationCount={2}
      />,
    );

    expect(getStatValue("Saved Locations", "2")).toBeInTheDocument();

    rerender(
      <DashboardSummaryCards
        locations={sampleLocations}
        isLoading={false}
        error={null}
        savedLocationCount={5}
      />,
    );

    expect(getStatValue("Saved Locations", "5")).toBeInTheDocument();
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });
});
