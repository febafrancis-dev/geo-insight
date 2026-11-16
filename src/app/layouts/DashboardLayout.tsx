import { useEffect, useRef, useState, type ReactNode } from "react";
import Header from "./Header";
import Sidebar, { type DashboardSection } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  searchQuery: string;
  onSearchQueryChange: (searchQuery: string) => void;
}

const dashboardSections: readonly DashboardSection[] = [
  "overview",
  "ai-insights",
  "analytics",
  "explore-map",
  "saved-locations",
];

const sectionTitles: Record<DashboardSection, string> = {
  overview: "Overview",
  "ai-insights": "AI Insights",
  analytics: "Analytics",
  "explore-map": "Explore Map",
  "saved-locations": "Saved Locations",
};

function DashboardLayout({
  children,
  searchQuery,
  onSearchQueryChange,
}: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("overview");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observedSections = dashboardSections.flatMap((id) => {
      const element = document.getElementById(id);
      return element ? [{ id, element }] : [];
    });

    if (
      observedSections.length === 0 ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      () => {
        const activationPoint = window.innerHeight * 0.3;
        const currentSection = observedSections.find(({ element }) => {
          const bounds = element.getBoundingClientRect();
          return bounds.top <= activationPoint && bounds.bottom > activationPoint;
        });

        if (currentSection) {
          setActiveSection(currentSection.id);
        }
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
    );

    observedSections.forEach(({ element }) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobileSidebarOpen) {
      return;
    }

    const menuButton = menuButtonRef.current;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileSidebarOpen(false);
        return;
      }

      if (event.key === "Tab") {
        const focusableElements =
          document.querySelectorAll<HTMLElement>(
            "#mobile-navigation button:not(:disabled), #mobile-navigation a[href], #mobile-navigation input:not(:disabled), #mobile-navigation select:not(:disabled), #mobile-navigation [tabindex]:not([tabindex='-1'])",
          );
        const firstElement = focusableElements.item(0);
        const lastElement = focusableElements.item(
          focusableElements.length - 1,
        );

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };
    const handleResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);

      if (!window.matchMedia("(min-width: 768px)").matches) {
        menuButton?.focus();
      }
    };
  }, [isMobileSidebarOpen]);

  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
        closeButtonRef={closeButtonRef}
      />
      {isMobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          tabIndex={-1}
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
        />
      )}
      <div
        className="flex min-w-0 flex-1 flex-col"
        inert={isMobileSidebarOpen}
      >
        <Header
          title={sectionTitles[activeSection]}
          isMobileMenuOpen={isMobileSidebarOpen}
          menuButtonRef={menuButtonRef}
          onOpenMenu={() => setIsMobileSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
        />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
