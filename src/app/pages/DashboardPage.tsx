import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import DashboardSummaryCards from "../../features/dashboard/components/DashboardSummaryCards";
import SavedLocationsPage from "./SavedLocationsPage";
import type { Location } from "../../features/locations/types/location";

const AnalyticsPage = lazy(() => import("./AnalyticsPage"));
const ExploreMapPage = lazy(() => import("./ExploreMapPage"));

interface DashboardPageProps {
  searchQuery: string;
  onSearchQueryChange: (searchQuery: string) => void;
  savedLocations: readonly Location[];
  savedLocationIds: ReadonlySet<string>;
  onToggleSavedLocation: (locationId: string) => void;
  onRemoveSavedLocation: (locationId: string) => void;
}

interface DeferredSectionProps {
  id: string;
  className: string;
  fallback: ReactNode;
  children: ReactNode;
}

function DeferredSection({
  id,
  className,
  fallback,
  children,
}: DeferredSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div id={id} ref={sectionRef} className={className}>
      {isNearViewport ? (
        <Suspense fallback={fallback}>{children}</Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

function AnalyticsSectionFallback() {
  return (
    <div
      aria-hidden="true"
      className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2"
    >
      {[0, 1].map((chart) => (
        <div
          key={chart}
          className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="mb-5 space-y-2">
            <div className="h-5 w-2/3 rounded bg-slate-200" />
            <div className="h-4 w-1/2 rounded bg-slate-100" />
          </div>
          <div className="h-72 rounded-lg bg-slate-100 sm:h-80" />
        </div>
      ))}
    </div>
  );
}

function ExploreMapSectionFallback() {
  return (
    <div aria-hidden="true">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-7 w-48 max-w-full rounded bg-slate-200" />
          <div className="h-4 w-64 max-w-full rounded bg-slate-100" />
        </div>
        <div className="h-8 w-28 shrink-0 rounded-full bg-blue-50" />
      </div>

      <div className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex h-[58px] items-center gap-3 border-b border-slate-100 px-4 sm:px-5">
          <div className="h-9 w-9 shrink-0 rounded-lg bg-blue-50" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-3 w-40 rounded bg-slate-100" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
          {[0, 1, 2].map((field) => (
            <div
              key={field}
              className={`space-y-2 ${
                field === 0 ? "sm:col-span-2 xl:col-span-1" : ""
              }`}
            >
              <div className="h-4 w-28 rounded bg-slate-100" />
              <div className="h-11 rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex h-[72px] items-center gap-3 border-b border-slate-100 px-4 sm:px-5">
          <div className="h-9 w-9 shrink-0 rounded-lg bg-blue-50" />
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="h-3 w-48 max-w-full rounded bg-slate-100" />
          </div>
        </div>
        <div className="h-[360px] bg-slate-100 sm:h-[440px] xl:h-[480px]" />
      </div>
    </div>
  );
}

function DashboardPage({
  searchQuery,
  onSearchQueryChange,
  savedLocations,
  savedLocationIds,
  onToggleSavedLocation,
  onRemoveSavedLocation,
}: DashboardPageProps) {
  return (
    <>
      <section id="overview" aria-labelledby="overview-heading">
        <header className="mb-7 sm:mb-8">
          <h1
            id="overview-heading"
            className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
          >
            Location Overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Monitor location activity, explore regional trends, and manage
            saved places.
          </p>
        </header>

        <DashboardSummaryCards savedLocationCount={savedLocations.length} />
      </section>
      <DeferredSection
        id="analytics"
        className="mt-8 min-w-0"
        fallback={<AnalyticsSectionFallback />}
      >
        <AnalyticsPage />
      </DeferredSection>
      <DeferredSection
        id="explore-map"
        className="mt-8 min-w-0"
        fallback={<ExploreMapSectionFallback />}
      >
        <ExploreMapPage
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
          savedLocationIds={savedLocationIds}
          onToggleSavedLocation={onToggleSavedLocation}
        />
      </DeferredSection>
      <SavedLocationsPage
        locations={savedLocations}
        onRemove={onRemoveSavedLocation}
      />
    </>
  );
}

export default DashboardPage;
