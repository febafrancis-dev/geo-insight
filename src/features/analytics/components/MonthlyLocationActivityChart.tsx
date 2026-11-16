import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApiResource } from "../../../hooks/useApiResource";
import AnalyticsChartCard from "./AnalyticsChartCard";
import type { MonthlyLocationActivity } from "../types/analytics";

function MonthlyLocationActivityChart() {
  const { data, error, isLoading } = useApiResource<MonthlyLocationActivity[]>(
    "/analytics/monthly-activity",
    [],
  );
  const isEmpty = !isLoading && !error && data.length === 0;

  return (
    <AnalyticsChartCard
      title="Monthly Location Activity"
      description="Monthly locations tracked over the last six months"
      isEmpty={isEmpty}
      isLoading={isLoading}
      error={error}
    >
      {!isEmpty && (
        <div className="h-72 min-w-0 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 12, bottom: 8, left: 8 }}
            >
              <CartesianGrid
                stroke="#e2e8f0"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(value) => Number(value).toLocaleString()}
                width={52}
              />
              <Legend
                align="right"
                verticalAlign="top"
                height={32}
                iconType="circle"
                wrapperStyle={{ color: "#475569", fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.75rem",
                  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
                  padding: "10px 12px",
                }}
                itemStyle={{ color: "#2563eb", fontSize: "13px" }}
                labelStyle={{
                  color: "#0f172a",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
                labelFormatter={(label) => `Month: ${String(label)}`}
                formatter={(value) => [
                  Number(value).toLocaleString(),
                  "Locations",
                ]}
              />
              <Line
                type="monotone"
                dataKey="locations"
                name="Locations"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ fill: "#2563eb", strokeWidth: 0, r: 4 }}
                activeDot={{ fill: "#1d4ed8", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </AnalyticsChartCard>
  );
}

export default MonthlyLocationActivityChart;
