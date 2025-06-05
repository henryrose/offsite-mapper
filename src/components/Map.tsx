import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import locationsData from '../data/locations.json';
import { LocationsData } from '../types/locations';

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Create custom SVG marker for team locations
const createCustomIcon = (color: string) => {
  return new L.DivIcon({
    className: 'custom-marker',
    html: `<svg width="20" height="32" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41C12.5 41 25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z"/>
    </svg>`,
    iconSize: [20, 32],
    iconAnchor: [10, 32],
    popupAnchor: [0, -32]
  });
};

// Create custom icon for Nassau
const nassauIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const NASSAU_COORDINATES: [number, number] = [25.0343, -77.3963];

const Map: React.FC = () => {
  const typedLocations = locationsData as LocationsData;
  const teamLocationIcon = createCustomIcon('#8686FC');
  
  // Calculate bounds to include all points with padding
  const bounds = typedLocations.locations.reduce((bounds, location) => {
    if (location.coordinates) {
      bounds.extend(location.coordinates);
    }
    return bounds;
  }, L.latLngBounds([])).pad(0.1); // Add 10% padding around the bounds

  return (
    <MapContainer
      center={NASSAU_COORDINATES}
      zoom={2} // Set a low initial zoom level
      style={{ height: '100vh', width: '100%' }}
      bounds={bounds}
      boundsOptions={{ padding: [50, 50] }} // Add padding in pixels
    >
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
      />
      {/* Add marker for Nassau */}
      <Marker position={NASSAU_COORDINATES} icon={nassauIcon}>
        <Popup>
          Nassau, Bahamas
        </Popup>
      </Marker>
      {/* Add markers for all team locations */}
      {typedLocations.locations.map((location, index) => (
        location.coordinates && (
          <Marker 
            key={index} 
            position={location.coordinates}
            icon={teamLocationIcon}
          >
            <Popup>
              <div>
                <strong>{location.name}</strong>
                {location.distance && (
                  <div style={{ marginTop: '4px', color: '#666' }}>
                    Distance to Nassau: {location.distance}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default Map; 