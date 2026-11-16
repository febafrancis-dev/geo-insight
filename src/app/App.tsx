import { useState } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import { useLocations } from "../features/locations/hooks/useLocations";
import useSavedLocations from "../features/locations/hooks/useSavedLocations";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const locationsRequest = useLocations();
  const {
    savedLocations,
    savedLocationIds,
    toggleSavedLocation,
    removeSavedLocation,
  } = useSavedLocations(
    locationsRequest.data,
    !locationsRequest.isLoading && !locationsRequest.error,
  );

  return (
    <DashboardLayout
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    >
      <DashboardPage
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        locations={locationsRequest.data}
        locationsLoading={locationsRequest.isLoading}
        locationsError={locationsRequest.error}
        savedLocations={savedLocations}
        savedLocationIds={savedLocationIds}
        onToggleSavedLocation={toggleSavedLocation}
        onRemoveSavedLocation={removeSavedLocation}
      />
    </DashboardLayout>
  );
}

export default App;
