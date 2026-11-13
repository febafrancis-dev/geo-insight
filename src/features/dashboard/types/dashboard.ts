import type { StatCardProps } from "../../../components/ui/types";

export type DashboardStatId =
  | "total-locations"
  | "active-regions"
  | "saved-locations"
  | "total-activity";

export type DashboardStat = Omit<StatCardProps, "value"> & {
  id: DashboardStatId;
};
