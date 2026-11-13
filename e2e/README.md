# GeoInsight end-to-end tests

End-to-end (E2E) tests run the application in a real browser and exercise
complete user workflows, including interactions between the dashboard, map,
filters, navigation, and saved locations.

## Setup and run

Install the Chromium browser used by the configured Playwright project:

```sh
npx playwright install chromium
```

Run the E2E suite:

```sh
npm run test:e2e
```

Playwright starts the local Vite development server automatically at
`http://127.0.0.1:5173`.

Open Playwright's interactive test runner:

```sh
npm run test:e2e:ui
```

The suite uses Playwright's HTML reporter. After a run, open the report with:

```sh
npx playwright show-report
```

On Windows PowerShell, use the `.cmd` shims if script execution is restricted,
for example `npm.cmd run test:e2e` and `npx.cmd playwright show-report`.

Screenshots and traces are retained for failed tests. The browser tests abort
OpenStreetMap tile requests so they do not depend on third-party map tile
availability.

## E2E vs. Vitest

The existing Vitest tests run quickly in jsdom and focus on isolated utility,
hook, and component behavior. These Playwright tests run the complete Vite app
in Chromium and verify how the features work together from a user's
perspective. Playwright specs live in `e2e/` and are excluded from Vitest
discovery.
