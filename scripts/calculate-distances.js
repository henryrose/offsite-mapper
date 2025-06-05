import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NASSAU_COORDINATES = [25.0343, -77.3963];

// Haversine formula to calculate distance between two points on Earth
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

function toRad(degrees) {
  return degrees * (Math.PI/180);
}

// Format distance for display
function formatDistance(distance) {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${Math.round(distance)}km`;
}

// Read and process locations
const locationsFile = path.join(__dirname, '../src/data/locations.json');
const locations = JSON.parse(fs.readFileSync(locationsFile, 'utf8'));

// Add distances to each location
const updatedLocations = locations.locations.map(location => {
  if (location.coordinates) {
    const [lat, lon] = location.coordinates;
    const distance = calculateDistance(
      lat,
      lon,
      NASSAU_COORDINATES[0],
      NASSAU_COORDINATES[1]
    );
    return {
      ...location,
      distance: formatDistance(distance)
    };
  }
  return location;
});

// Write updated locations back to file
fs.writeFileSync(
  locationsFile,
  JSON.stringify({ locations: updatedLocations }, null, 2),
  'utf8'
);

console.log('Distances calculated and added to locations.json'); 