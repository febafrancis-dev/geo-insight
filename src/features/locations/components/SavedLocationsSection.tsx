import { Activity, Bookmark, MapPin, Trash2 } from "lucide-react";
import type { Location } from "../types/location";

interface SavedLocationsSectionProps {
  locations: readonly Location[];
  onRemove: (locationId: string) => void;
}

function SavedLocationsSection({
  locations,
  onRemove,
}: SavedLocationsSectionProps) {
  return (
    <section aria-labelledby="saved-locations-heading" className="mt-8">
      <div className="mb-5">
        <h2
          id="saved-locations-heading"
          className="text-xl font-semibold tracking-tight text-slate-900"
        >
          Saved Locations
        </h2>
        <p className="mt-1 text-sm leading-5 text-slate-500">
          Keep your bookmarked places and regional activity close at hand.
        </p>
      </div>

      {locations.length === 0 ? (
        <div
          role="status"
          className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm"
        >
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <Bookmark aria-hidden="true" size={23} />
          </span>
          <h3 className="mt-4 text-base font-semibold text-slate-900">
            Your saved locations will appear here
          </h3>
          <p className="mx-auto mt-1.5 max-w-md text-sm leading-5 text-slate-500">
            Save a place from its map popup to keep its region and activity
            details easy to find.
          </p>
        </div>
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {locations.map((location) => (
            <li key={location.id}>
              <article className="flex h-full min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:border-slate-300 hover:shadow-md sm:p-5">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700">
                      <MapPin aria-hidden="true" size={19} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-900">
                        {location.city}
                      </h3>
                      <p className="truncate text-sm text-slate-500">
                        {location.country}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${location.city} from saved locations`}
                    title={`Remove ${location.city}`}
                    onClick={() => onRemove(location.id)}
                    className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    <span>Remove</span>
                  </button>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                  <div className="min-w-0">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Region
                    </dt>
                    <dd className="mt-1 truncate text-sm font-medium text-slate-800">
                      {location.region}
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                      <Activity size={13} aria-hidden="true" />
                      Activity
                    </dt>
                    <dd className="mt-1 text-sm font-semibold tabular-nums text-slate-900">
                      {location.activityCount.toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default SavedLocationsSection;
