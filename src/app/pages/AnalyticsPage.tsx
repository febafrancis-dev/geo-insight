import MonthlyLocationActivityChart from "../../features/analytics/components/MonthlyLocationActivityChart";
import RegionalDistributionChart from "../../features/analytics/components/RegionalDistributionChart";

function AnalyticsPage() {
  return (
    <section
      aria-label="Analytics"
      className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2"
    >
      <MonthlyLocationActivityChart />
      <RegionalDistributionChart />
    </section>
  );
}

export default AnalyticsPage;
