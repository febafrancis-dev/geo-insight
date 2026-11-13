import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

function summaryCard(page: Page, title: string) {
  return page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: title, exact: true }) });
}

async function openExploreMap(page: Page) {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "Explore Map" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Explore Locations" }),
  ).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });
  await page.route(
    /https?:\/\/[abc]\.tile\.openstreetmap\.org\/.*/,
    (route) => route.abort(),
  );
});

test("loads the dashboard and displays dataset summary metrics", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Location Overview" }),
  ).toBeVisible();
  await expect(summaryCard(page, "Total Locations").getByText("5")).toBeVisible();
  await expect(summaryCard(page, "Active Regions").getByText("4")).toBeVisible();
  await expect(summaryCard(page, "Saved Locations").getByText("0")).toBeVisible();
  await expect(
    summaryCard(page, "Total Activity").getByText("3,277"),
  ).toBeVisible();
});

test("navigates between Analytics, Explore Map, and Saved Locations", async ({
  page,
}) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation", {
    name: "Primary navigation",
  });

  await navigation.getByRole("link", { name: "Analytics" }).click();
  await expect(page).toHaveURL(/#analytics$/);
  await expect(page.getByRole("region", { name: "Analytics" })).toBeVisible();
  await expect(
    navigation.getByRole("link", { name: "Analytics" }),
  ).toHaveAttribute("aria-current", "location");

  await navigation.getByRole("link", { name: "Explore Map" }).click();
  await expect(page).toHaveURL(/#explore-map$/);
  await expect(
    page.getByRole("heading", { name: "Explore Locations" }),
  ).toBeVisible();

  await navigation.getByRole("link", { name: "Saved Locations" }).click();
  await expect(page).toHaveURL(/#saved-locations$/);
  await expect(
    page.getByRole("heading", {
      name: "Your saved locations will appear here",
    }),
  ).toBeVisible();
});

test("searches locations, filters by region, and clears filters", async ({
  page,
}) => {
  await openExploreMap(page);

  const search = page.getByRole("searchbox", { name: "Search locations" }).last();
  const resultCount = page
    .getByRole("status")
    .filter({ hasText: /locations? found/ });

  await search.fill("Kochi");
  await expect(resultCount).toHaveText("1 location found");
  await expect(page.getByTitle("Kochi")).toHaveCount(1);
  await expect(page.getByTitle("London")).toHaveCount(0);

  await search.fill("");
  await page
    .getByRole("combobox", { name: "Region" })
    .selectOption({ label: "Europe" });
  await expect(resultCount).toHaveText("1 location found");
  await expect(page.getByTitle("London")).toHaveCount(1);
  await expect(page.getByTitle("Kochi")).toHaveCount(0);

  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(resultCount).toHaveText("5 locations found");
  await expect(page.getByTitle("Kochi")).toHaveCount(1);
  await expect(page.getByTitle("London")).toHaveCount(1);
});

test("saves a map location, displays it, and removes it", async ({ page }) => {
  await openExploreMap(page);

  await page
    .getByRole("searchbox", { name: "Search locations" })
    .last()
    .fill("London");
  await expect(
    page.getByRole("status").filter({ hasText: /locations? found/ }),
  ).toHaveText("1 location found");

  await page.getByTitle("London").click();
  await page
    .getByRole("button", { name: "Save London to saved locations" })
    .click();
  await expect(summaryCard(page, "Saved Locations").getByText("1")).toBeVisible();

  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "Saved Locations" })
    .click();

  const savedLocations = page.getByRole("region", {
    name: "Saved Locations",
  });
  await expect(
    savedLocations.getByRole("heading", { name: "London", exact: true }),
  ).toBeVisible();
  await savedLocations
    .getByRole("button", { name: "Remove London from saved locations" })
    .click();

  await expect(
    savedLocations.getByRole("heading", { name: "London", exact: true }),
  ).toHaveCount(0);
  await expect(summaryCard(page, "Saved Locations").getByText("0")).toBeVisible();
});

test("closes the mobile navigation drawer after selecting a section", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const mobileNavigation = page.getByRole("dialog", {
    name: "Mobile navigation",
  });
  await expect(mobileNavigation).toBeVisible();

  await mobileNavigation.getByRole("link", { name: "Analytics" }).click();

  await expect(mobileNavigation).toBeHidden();
  await expect(page).toHaveURL(/#analytics$/);
  await expect(page.getByRole("region", { name: "Analytics" })).toBeVisible();
});
