
import {
  Bookmark,
  ChartNoAxesCombined,
  LayoutDashboard,
  Map,
  MapPinned,
  Settings,
  X,
} from "lucide-react";
import type { RefObject } from "react";

export type DashboardSection =
  | "overview"
  | "explore-map"
  | "analytics"
  | "saved-locations";

const navigationItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { id: "explore-map", label: "Explore Map", icon: Map },
  { id: "saved-locations", label: "Saved Locations", icon: Bookmark },
] satisfies {
  id: DashboardSection;
  label: string;
  icon: typeof LayoutDashboard;
}[];

interface SidebarProps {
  activeSection: DashboardSection;
  onNavigate: (section: DashboardSection) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
}

interface SidebarContentProps {
  activeSection: DashboardSection;
  onNavigate: (section: DashboardSection) => void;
  compact?: boolean;
  onSelect?: () => void;
  onClose?: () => void;
  closeButtonRef?: RefObject<HTMLButtonElement | null>;
}

function SidebarContent({
  activeSection,
  onNavigate,
  compact = false,
  onSelect,
  onClose,
  closeButtonRef,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      <div
        className={`flex h-20 shrink-0 items-center gap-3 border-b border-white/10 ${
          compact
            ? "justify-center px-0 lg:justify-start lg:px-6"
            : "justify-between px-6"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-xl bg-blue-600 p-2">
            <MapPinned size={22} aria-hidden="true" />
          </div>
          <div className={compact ? "hidden lg:block" : ""}>
            <h1 className="text-lg font-bold">GeoInsight</h1>
            <p className="whitespace-nowrap text-xs text-slate-400">
              Location Intelligence
            </p>
          </div>
        </div>
        {onClose && (
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            <X size={20} aria-hidden="true" />
          </button>
        )}
      </div>

      <nav aria-label="Primary navigation" className="flex-1 space-y-2 px-4 py-6">
        <p
          className={`mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${
            compact ? "hidden lg:block" : ""
          }`}
        >
          Workspace
        </p>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <a
              key={item.label}
              href={`#${item.id}`}
              title={compact ? item.label : undefined}
              aria-label={compact ? item.label : undefined}
              aria-current={isActive ? "location" : undefined}
              onClick={() => {
                onNavigate(item.id);
                onSelect?.();
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } ${
                compact
                  ? "justify-center px-0 lg:justify-start lg:px-3"
                  : ""
              }`}
            >
              <Icon size={19} aria-hidden="true" />
              <span className={compact ? "hidden lg:inline" : ""}>
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div
          title={compact ? "Settings" : undefined}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-500 ${
            compact ? "justify-center px-0 lg:justify-start lg:px-3" : ""
          }`}
        >
          <Settings size={19} aria-hidden="true" />
          <span className={compact ? "hidden lg:inline" : ""}>Settings</span>
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  activeSection,
  onNavigate,
  isMobileOpen,
  onMobileClose,
  closeButtonRef,
}: SidebarProps) {
  return (
    <>
      <aside
        aria-label="Desktop sidebar"
        className="sticky top-0 hidden h-screen shrink-0 flex-col bg-slate-950 text-white md:flex md:w-20 lg:w-60"
      >
        <SidebarContent
          activeSection={activeSection}
          onNavigate={onNavigate}
          compact
        />
      </aside>
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          isMobileOpen ? "visible" : "invisible"
        }`}
        aria-hidden={!isMobileOpen}
        inert={!isMobileOpen}
      >
        <aside
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={`absolute inset-y-0 left-0 h-full w-64 transform transition-transform duration-200 ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent
            activeSection={activeSection}
            onNavigate={onNavigate}
            onSelect={onMobileClose}
            onClose={onMobileClose}
            closeButtonRef={closeButtonRef}
          />
        </aside>
      </div>
    </>
  );
}

export default Sidebar;
