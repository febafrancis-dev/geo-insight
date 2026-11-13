import StatCard from "../../../components/ui/StatCard";
import { sampleLocations } from "../../locations/data/locations";
import { dashboardStats } from "../data/dashboardStats";
import type { DashboardStatId } from "../types/dashboard";

interface DashboardSummaryCardsProps {
  savedLocationCount: number;
}

function DashboardSummaryCards({
  savedLocationCount,
}: DashboardSummaryCardsProps) {
  const totalLocations = sampleLocations.length;
  const activeRegions = new Set(
    sampleLocations.map((location) => location.region),
  ).size;
  const totalActivity = sampleLocations.reduce(
    (total, location) => total + location.activityCount,
    0,
  );
  const values: Record<DashboardStatId, string> = {
    "total-locations": totalLocations.toLocaleString(),
    "active-regions": activeRegions.toLocaleString(),
    "saved-locations": savedLocationCount.toLocaleString(),
    "total-activity": totalActivity.toLocaleString(),
  };

  return (
    <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 xl:grid-cols-4">
      {dashboardStats.map(({ id, ...stat }) => (
        <StatCard
          key={id}
          {...stat}
          iconColor="text-blue-600"
          iconBackground="bg-blue-50"
          value={values[id]}
        />
      ))}
    </div>
  );
}

export default DashboardSummaryCards;
