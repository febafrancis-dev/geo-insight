import { Activity, Bookmark, Globe, MapPin } from "lucide-react";
import type { DashboardStat } from "../types/dashboard";

export const dashboardStats: DashboardStat[] = [
  {
    id: "total-locations",
    title: "Total Locations",
    description: "Locations in the current dataset",
    icon: MapPin,
    iconColor: "text-blue-600",
    iconBackground: "bg-blue-50",
  },
  {
    id: "active-regions",
    title: "Active Regions",
    description: "Unique regions represented in the dataset",
    icon: Globe,
    iconColor: "text-emerald-600",
    iconBackground: "bg-emerald-50",
  },
  {
    id: "saved-locations",
    title: "Saved Locations",
    description: "Locations saved to your workspace",
    icon: Bookmark,
    iconColor: "text-violet-600",
    iconBackground: "bg-violet-50",
  },
  {
    id: "total-activity",
    title: "Total Activity",
    description: "Activity across the current locations",
    icon: Activity,
    iconColor: "text-orange-600",
    iconBackground: "bg-orange-50",
  },
];
