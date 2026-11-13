import { Bookmark, MapPin } from "lucide-react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import type { Location } from "../types/location";

interface LocationMapProps {
  locations: readonly Location[];
  savedLocationIds: ReadonlySet<string>;
  onToggleSavedLocation: (locationId: string) => void;
}

const locationMarkerIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function LocationMap({
  locations,
  savedLocationIds,
  onToggleSavedLocation,
}: LocationMapProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700">
            <MapPin size={17} aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Location map
            </h3>
            <p className="mt-0.5 text-xs leading-4 text-slate-500 sm:text-sm">
              Pan and zoom to explore matching locations.
            </p>
          </div>
        </div>
        <span className="ml-12 w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 sm:ml-0">
          OpenStreetMap
        </span>
      </div>
      <div
        role="region"
        aria-label="Interactive location map"
        className="relative h-[360px] w-full sm:h-[440px] xl:h-[480px]"
      >
        <MapContainer
          center={[20, 10]}
          zoom={2}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((location) => {
            const isSaved = savedLocationIds.has(location.id);

            return (
              <Marker
                key={location.id}
                position={location.coordinates}
                icon={locationMarkerIcon}
                title={location.city}
              >
                <Popup>
                  <div className="min-w-40">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {location.city}, {location.country}
                    </h3>
                    <dl className="mt-3 space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Region</dt>
                        <dd className="text-right font-medium text-slate-700">
                          {location.region}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Activity</dt>
                        <dd className="font-medium tabular-nums text-slate-700">
                          {location.activityCount.toLocaleString()}
                        </dd>
                      </div>
                    </dl>
                    <button
                      type="button"
                      aria-label={
                        isSaved
                          ? `Remove ${location.city} from saved locations`
                          : `Save ${location.city} to saved locations`
                      }
                      onClick={() => onToggleSavedLocation(location.id)}
                      className={`mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                        isSaved
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      <Bookmark
                        size={16}
                        aria-hidden="true"
                        fill={isSaved ? "currentColor" : "none"}
                      />
                      {isSaved ? "Remove saved location" : "Save location"}
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
        {locations.length === 0 && (
          <div
            role="status"
            className="pointer-events-none absolute inset-0 z-[1000] flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-[2px]"
          >
            <div className="flex max-w-sm flex-col items-center rounded-xl border border-white/80 bg-white/95 px-6 py-5 text-center shadow-lg">
              <MapPin
                size={22}
                aria-hidden="true"
                className="mb-2 text-slate-400"
              />
              <p className="text-sm font-semibold text-slate-800">
                No matching locations
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                Try changing or clearing your filters to see more results.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationMap;
