import { useId } from "react";
import type { ReactNode } from "react";

interface AnalyticsChartCardProps {
  title: string;
  description: string;
  isEmpty: boolean;
  isLoading: boolean;
  error: string | null;
  children: ReactNode;
}

function AnalyticsChartCard({
  title,
  description,
  isEmpty,
  isLoading,
  error,
  children,
}: AnalyticsChartCardProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="h-full min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="mb-5">
        <h2
          id={titleId}
          className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg"
        >
          {title}
        </h2>
        <p
          id={descriptionId}
          className="mt-1 text-sm leading-5 text-slate-500"
        >
          {description}
        </p>
      </div>

      {isLoading ? (
        <div
          role="status"
          className="flex min-h-72 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500"
        >
          Loading chart data…
        </div>
      ) : error ? (
        <div
          role="alert"
          className="flex min-h-72 items-center justify-center rounded-lg bg-red-50 px-4 text-center text-sm text-red-700"
        >
          Could not load chart data: {error}
        </div>
      ) : isEmpty ? (
        <div
          role="status"
          className="flex min-h-72 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500"
        >
          No chart data available.
        </div>
      ) : (
        children
      )}
    </section>
  );
}

export default AnalyticsChartCard;
