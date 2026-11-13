export interface Location {
  id: string;
  city: string;
  country: string;
  region: string;
  activityCount: number;
  coordinates: [latitude: number, longitude: number];
}

export interface LocationFilters {
  searchQuery: string;
  region: string;
  minimumActivity: number;
}
