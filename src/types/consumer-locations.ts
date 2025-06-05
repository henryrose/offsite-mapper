export interface Location {
  name: string;
  coordinates: [number, number] | null;
  distanceKm?: number;
  distanceMiles?: number;
}

export interface LocationsData {
  locations: Location[];
} 