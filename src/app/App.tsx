import { useState } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import { sampleLocations } from "../features/locations/data/locations";
import useSavedLocations from "../features/locations/hooks/useSavedLocations";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    savedLocations,
    savedLocationIds,
    toggleSavedLocation,
    removeSavedLocation,
  } = useSavedLocations(sampleLocations);

  return (
    <DashboardLayout
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    >
      <DashboardPage
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        savedLocations={savedLocations}
        savedLocationIds={savedLocationIds}
        onToggleSavedLocation={toggleSavedLocation}
        onRemoveSavedLocation={removeSavedLocation}
      />
    </DashboardLayout>
  );
}

export default App;
