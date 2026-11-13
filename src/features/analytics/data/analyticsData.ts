import type {
  MonthlyLocationActivity,
  RegionalActivity,
} from "../types/analytics";

export const monthlyLocationActivity: MonthlyLocationActivity[] = [
  { month: "Jan", locations: 820 },
  { month: "Feb", locations: 940 },
  { month: "Mar", locations: 890 },
  { month: "Apr", locations: 1120 },
  { month: "May", locations: 1280 },
  { month: "Jun", locations: 1450 },
];

export const regionalActivity: RegionalActivity[] = [
  { region: "North America", locations: 680 },
  { region: "Europe", locations: 540 },
  { region: "Asia Pacific", locations: 470 },
  { region: "Latin America", locations: 310 },
  { region: "Middle East", locations: 220 },
  { region: "Africa", locations: 160 },
];
