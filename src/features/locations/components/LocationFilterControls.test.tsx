import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ALL_REGIONS } from "../utils/filterLocations";
import LocationFilterControls from "./LocationFilterControls";

function createProps() {
  return {
    searchQuery: "",
    region: ALL_REGIONS,
    minimumActivity: 0,
    regions: ["South Asia", "Europe", "Southeast Asia"],
    onSearchChange: vi.fn(),
    onRegionChange: vi.fn(),
    onMinimumActivityChange: vi.fn(),
    onClear: vi.fn(),
  };
}

describe("LocationFilterControls", () => {
  it("renders the search input with an accessible label", () => {
    render(<LocationFilterControls {...createProps()} />);

    expect(
      screen.getByRole("searchbox", { name: "Search locations" }),
    ).toBeInTheDocument();
  });

  it("invokes the search callback when the user types", async () => {
    const user = userEvent.setup();
    const props = createProps();

    function ControlledSearch() {
      const [searchQuery, setSearchQuery] = useState("");

      return (
        <LocationFilterControls
          {...props}
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            props.onSearchChange(value);
            setSearchQuery(value);
          }}
        />
      );
    }

    render(<ControlledSearch />);

    await user.type(
      screen.getByRole("searchbox", { name: "Search locations" }),
      "London",
    );

    expect(props.onSearchChange).toHaveBeenLastCalledWith("London");
  });

  it("invokes the region callback when a region is selected", async () => {
    const user = userEvent.setup();
    const props = createProps();
    render(<LocationFilterControls {...props} />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Region" }),
      "Europe",
    );

    expect(props.onRegionChange).toHaveBeenCalledWith("Europe");
  });

  it("invokes the activity callback with a number when a threshold is selected", async () => {
    const user = userEvent.setup();
    const props = createProps();
    render(<LocationFilterControls {...props} />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Minimum activity" }),
      "500",
    );

    expect(props.onMinimumActivityChange).toHaveBeenCalledWith(500);
  });

  it("delegates clearing all filters through the onClear callback", async () => {
    const user = userEvent.setup();
    const props = createProps();
    render(<LocationFilterControls {...props} />);

    await user.click(screen.getByRole("button", { name: "Clear filters" }));

    expect(props.onClear).toHaveBeenCalledTimes(1);
  });

  it("displays updated values when controlled props change", () => {
    const props = createProps();
    const { rerender } = render(<LocationFilterControls {...props} />);

    rerender(
      <LocationFilterControls
        {...props}
        searchQuery="London"
        region="Europe"
        minimumActivity={500}
      />,
    );

    expect(
      screen.getByRole("searchbox", { name: "Search locations" }),
    ).toHaveValue("London");
    expect(screen.getByRole("combobox", { name: "Region" })).toHaveValue(
      "Europe",
    );
    expect(
      screen.getByRole("combobox", { name: "Minimum activity" }),
    ).toHaveValue("500");
  });
});
