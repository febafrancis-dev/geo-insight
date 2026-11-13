import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AnalyticsChartCard from "./AnalyticsChartCard";
import { regionalActivity } from "../data/analyticsData";
import type { RegionalActivity } from "../types/analytics";

interface RegionalDistributionChartProps {
  data?: RegionalActivity[];
}

function RegionalDistributionChart({
  data = regionalActivity,
}: RegionalDistributionChartProps) {
  const isEmpty = data.length === 0;

  return (
    <AnalyticsChartCard
      title="Regional Distribution"
      description="Tracked location activity across regions"
      isEmpty={isEmpty}
    >
      {!isEmpty && (
        <div className="h-72 min-w-0 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 8, right: 12, bottom: 8, left: 4 }}
            >
              <CartesianGrid
                stroke="#e2e8f0"
                strokeDasharray="3 3"
                horizontal={false}
              />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickMargin={8}
                tickFormatter={(value) => Number(value).toLocaleString()}
              />
              <YAxis
                type="category"
                dataKey="region"
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
                tick={{ fill: "#64748b", fontSize: 12 }}
                width={112}
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
                labelFormatter={(label) => `Region: ${String(label)}`}
                formatter={(value) => [
                  Number(value).toLocaleString(),
                  "Locations",
                ]}
              />
              <Bar
                dataKey="locations"
                name="Locations"
                fill="#2563eb"
                radius={[0, 6, 6, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </AnalyticsChartCard>
  );
}

export default RegionalDistributionChart;
