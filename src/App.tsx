import React from 'react';
import Map from './components/Map';
import LocationsPanel from './components/LocationsPanel';
import './App.css';
import consumerLocationsData from './data/consumer-locations.json';
import allPillarsLocationsData from './data/all-pillars-locations.json';
import { Location } from './types/locations';

const App: React.FC = () => {
  const [useAllLocations, setUseAllLocations] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);

  const locations = (useAllLocations ? allPillarsLocationsData.locations : consumerLocationsData.locations) as Location[];

  return (
    <div className="app-container">
      <LocationsPanel 
        locations={locations}
        selectedLocation={selectedLocation}
        onLocationSelect={setSelectedLocation}
        useAllLocations={useAllLocations}
        onToggleLocations={() => setUseAllLocations((prev) => !prev)}
      />
      <div className="map-container">
        <Map locations={locations} selectedLocation={selectedLocation} />
      </div>
    </div>
  );
};

export default App;
