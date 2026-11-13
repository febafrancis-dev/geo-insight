
import type { StatCardProps } from "./types";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBackground,
}: StatCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:border-slate-300 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-medium leading-5 text-slate-600">
          {title}
        </h2>
        <div
          aria-hidden="true"
          className={`shrink-0 rounded-lg p-2.5 ${iconBackground}`}
        >
          <Icon size={20} className={iconColor} />
        </div>
      </div>

      <p className="mt-5 text-3xl font-semibold tabular-nums tracking-tight text-slate-900 sm:text-4xl">
        {value}
      </p>
      <p className="mt-2 text-sm leading-5 text-slate-500">{description}</p>
    </article>
  );
}

export default StatCard;
