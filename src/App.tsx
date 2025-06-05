import React from 'react';
import Map from './components/Map';
import LocationsPanel from './components/LocationsPanel';
import './App.css';
import locationsData from './data/locations.json';
import { Location } from './types/locations';

const App: React.FC = () => {
  const [useAllLocations, setUseAllLocations] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);

  const allLocationsData = {
    locations: locationsData.locations as Location[],
  };

  const consumerLocationsData = {
    locations: locationsData.locations as Location[],
  };

  return (
    <div className="app-container">
      <LocationsPanel 
        locations={useAllLocations ? (allLocationsData.locations as unknown as Location[]) : (consumerLocationsData.locations as unknown as Location[])} 
        selectedLocation={selectedLocation}
        onLocationSelect={setSelectedLocation}
        useAllLocations={useAllLocations}
        onToggleLocations={() => setUseAllLocations((prev) => !prev)}
      />
      <Map />
    </div>
  );
};

export default App;
