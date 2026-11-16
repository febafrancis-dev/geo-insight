import StatCard from "../../../components/ui/StatCard";
import type { Location } from "../../locations/types/location";
import { dashboardStats } from "../data/dashboardStats";
import type { DashboardStatId } from "../types/dashboard";

interface DashboardSummaryCardsProps {
  locations: readonly Location[];
  isLoading: boolean;
  error: string | null;
  savedLocationCount: number;
}

function DashboardSummaryCards({
  locations,
  isLoading,
  error,
  savedLocationCount,
}: DashboardSummaryCardsProps) {
  const totalLocations = locations.length;
  const activeRegions = new Set(
    locations.map((location) => location.region),
  ).size;
  const totalActivity = locations.reduce(
    (total, location) => total + location.activityCount,
    0,
  );
  const unavailable = isLoading ? "Loading…" : "—";
  const values: Record<DashboardStatId, string> = {
    "total-locations": isLoading || error ? unavailable : totalLocations.toLocaleString(),
    "active-regions": isLoading || error ? unavailable : activeRegions.toLocaleString(),
    "saved-locations": savedLocationCount.toLocaleString(),
    "total-activity": isLoading || error ? unavailable : totalActivity.toLocaleString(),
  };

  return (
    <>
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          Could not load dashboard data: {error}
        </p>
      )}
      <div
        aria-busy={isLoading}
        className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 xl:grid-cols-4"
      >
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
    </>
  );
}

export default DashboardSummaryCards;
