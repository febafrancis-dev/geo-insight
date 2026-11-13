import SavedLocationsSection from "../../features/locations/components/SavedLocationsSection";
import type { Location } from "../../features/locations/types/location";

interface SavedLocationsPageProps {
  locations: readonly Location[];
  onRemove: (locationId: string) => void;
}

function SavedLocationsPage({
  locations,
  onRemove,
}: SavedLocationsPageProps) {
  return (
    <div id="saved-locations">
      <SavedLocationsSection locations={locations} onRemove={onRemove} />
    </div>
  );
}

export default SavedLocationsPage;
