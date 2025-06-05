export interface Location {
  name: string;
  coordinates: [number, number] | null;
  distance?: string;
}

export interface LocationsData {
  locations: Location[];
} 