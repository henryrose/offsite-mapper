import React from 'react';
import Map from './components/Map';
import LocationsPanel from './components/LocationsPanel';
import './App.css';
import consumerLocationsData from './data/consumer-locations.json';
import allPillarsLocationsData from './data/all-pillars-locations.json';
import { Location } from './types/locations';
import logo from './assets/mindbody-logomark-spearmint.svg';

const App: React.FC = () => {
  const [useAllLocations, setUseAllLocations] = React.useState(true);
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);

  const locations = (useAllLocations ? allPillarsLocationsData.locations : consumerLocationsData.locations) as Location[];

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <img src={logo} alt="Mindbody" className="header-logo" />
          <h1>PDE Offsite 2025</h1>
        </div>
      </header>
      <div className="main-content">
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
    </div>
  );
};

export default App;
