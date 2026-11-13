
import type { RefObject } from "react";
import { Menu, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  isMobileMenuOpen: boolean;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  onOpenMenu: () => void;
  searchQuery: string;
  onSearchQueryChange: (searchQuery: string) => void;
}

function Header({
  title,
  isMobileMenuOpen,
  menuButtonRef,
  onOpenMenu,
  searchQuery,
  onSearchQueryChange,
}: HeaderProps) {
  return (
    <header className="flex h-16 min-w-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 md:h-20 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          ref={menuButtonRef}
          type="button"
          aria-label="Open navigation menu"
          aria-controls="mobile-navigation"
          aria-expanded={isMobileMenuOpen}
          onClick={onOpenMenu}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:hidden"
        >
          <Menu size={21} aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-slate-900 md:text-xl">
            {title}
          </h2>
          <p className="hidden text-sm text-slate-500 xl:block">
            Welcome back! Here's what's happening with your locations.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 lg:gap-5">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 sm:flex sm:w-40 md:w-44 lg:w-56">
          <Search size={18} aria-hidden="true" className="shrink-0 text-slate-400" />
          <label htmlFor="header-location-search" className="sr-only">
            Search locations
          </label>
          <input
            id="header-location-search"
            type="search"
            value={searchQuery}
            onChange={(event) =>
              onSearchQueryChange(event.currentTarget.value)
            }
            placeholder="Search locations..."
            className="min-w-0 w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        <div
          role="group"
          aria-label="Signed-in profile: Feba Francis, Administrator"
          className="flex shrink-0 items-center gap-2 rounded-lg p-1"
        >
          <div
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700"
          >
            FF
          </div>
          <div className="hidden text-left xl:block">
            <p className="text-sm font-semibold text-slate-800">
              Feba Francis
            </p>
            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
