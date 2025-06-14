import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '../types/locations';
import arc from 'arc';

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Create custom SVG marker for team locations
const createCustomIcon = (color: string) => {
  // Create a darker shade for the border (20% darker)
  const darkerColor = color.replace(/[0-9a-f]{2}/gi, (hex) => {
    const num = parseInt(hex, 16);
    const darker = Math.max(0, num - 51); // Subtract 20% (51 is roughly 20% of 255)
    return darker.toString(16).padStart(2, '0');
  });

  return new L.DivIcon({
    className: 'custom-marker',
    html: `<svg width="20" height="32" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" stroke="${darkerColor}" stroke-width="1.5" d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41C12.5 41 25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z"/>
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

// Create curved line between two points
const createCurvedLine = (start: [number, number], end: [number, number]) => {
  const generator = new arc.GreatCircle(
    { x: start[1], y: start[0] },
    { x: end[1], y: end[0] }
  );
  
  const line = generator.Arc(100, { offset: 10 });
  return line.geometries[0].coords.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);
};

// Component to handle map bounds
const MapBounds: React.FC<{ bounds: L.LatLngBounds }> = ({ bounds }) => {
  const map = useMap();
  
  useEffect(() => {
    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 4 // Prevent zooming in too close
    });
  }, [map, bounds]);

  return null;
};

interface MapProps {
  locations: Location[];
  selectedLocation: Location | null;
}

const Map: React.FC<MapProps> = ({ locations, selectedLocation }) => {
  const teamLocationIcon = createCustomIcon('#a3a3a3');
  
  // Calculate bounds to include all points
  const bounds = locations.reduce((bounds, location) => {
    if (location.coordinates) {
      bounds.extend(location.coordinates);
    }
    return bounds;
  }, L.latLngBounds([]));

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <MapContainer
        center={NASSAU_COORDINATES}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        bounds={bounds}
        boundsOptions={{ padding: [50, 50] }}
      >
        <MapBounds bounds={bounds} />
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
        {/* Add markers and curved lines for all team locations */}
        {locations.map((location, index) => (
          location.coordinates && (
            <React.Fragment key={index}>
              <Marker 
                position={location.coordinates}
                icon={teamLocationIcon}
              >
                <Popup>
                  <div>
                    <strong>{location.name}</strong>
                    {location.distanceKm && location.distanceMiles && (
                      <div style={{ marginTop: '4px', color: '#666' }}>
                        Distance to Nassau: {location.distanceMiles}mi ({location.distanceKm}km)
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
              <Polyline
                positions={createCurvedLine(location.coordinates, NASSAU_COORDINATES)}
                pathOptions={{
                  color: selectedLocation === location ? '#FF6B6B' : '#a4f8dc',
                  weight: selectedLocation === location ? 4 : 2,
                  opacity: selectedLocation === location ? 1 : 0.8,
                  lineCap: 'round'
                }}
              />
            </React.Fragment>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default Map; 