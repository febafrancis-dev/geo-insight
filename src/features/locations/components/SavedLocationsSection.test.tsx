import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { sampleLocations } from "../data/locations";
import SavedLocationsSection from "./SavedLocationsSection";

describe("SavedLocationsSection", () => {
  it("displays the empty state when there are no saved locations", () => {
    render(<SavedLocationsSection locations={[]} onRemove={vi.fn()} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Your saved locations will appear here",
    );
  });

  it("displays the saved location's city, country, region, and activity", () => {
    const kochi = sampleLocations.find(({ id }) => id === "kochi");
    if (!kochi) {
      throw new Error("Expected the sample locations to include Kochi.");
    }

    render(<SavedLocationsSection locations={[kochi]} onRemove={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Kochi" })).toBeInTheDocument();
    expect(screen.getByText("India")).toBeInTheDocument();
    expect(screen.getByText("South Asia")).toBeInTheDocument();
    expect(screen.getByText("342")).toBeInTheDocument();
  });

  it("renders a remove action for each saved location", () => {
    const locations = sampleLocations.slice(0, 2);

    render(
      <SavedLocationsSection locations={locations} onRemove={vi.fn()} />,
    );

    expect(
      screen.getByRole("button", {
        name: "Remove Kochi from saved locations",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Remove Bengaluru from saved locations",
      }),
    ).toBeInTheDocument();
  });

  it("calls onRemove with the selected location ID", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const london = sampleLocations.find(({ id }) => id === "london");
    if (!london) {
      throw new Error("Expected the sample locations to include London.");
    }

    render(<SavedLocationsSection locations={[london]} onRemove={onRemove} />);

    await user.click(
      screen.getByRole("button", {
        name: "Remove London from saved locations",
      }),
    );

    expect(onRemove).toHaveBeenCalledExactlyOnceWith("london");
  });

  it("renders multiple saved locations and their details", () => {
    const locations = sampleLocations.filter(({ id }) =>
      ["kochi", "london"].includes(id),
    );

    render(
      <SavedLocationsSection locations={locations} onRemove={vi.fn()} />,
    );

    expect(screen.getByRole("heading", { name: "Kochi" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "London" })).toBeInTheDocument();
    expect(screen.getByText("South Asia")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /^Remove .+ from saved locations$/ }),
    ).toHaveLength(2);
  });
});
