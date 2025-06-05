import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Nassau coordinates
const NASSAU_COORDINATES = [25.0343, -77.3963];

// Convert degrees to radians
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
};

// Format distance for display
const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${Math.round(distance)}km`;
};

// Read the locations file
const locationsPath = path.join(__dirname, '../src/data/all-locations.json');
const locationsData = JSON.parse(fs.readFileSync(locationsPath, 'utf8'));

// Calculate distances for each location
locationsData.locations = locationsData.locations.map(location => {
  if (location.coordinates) {
    const distance = calculateDistance(
      location.coordinates[0],
      location.coordinates[1],
      NASSAU_COORDINATES[0],
      NASSAU_COORDINATES[1]
    );
    const distanceKm = formatDistance(distance);
    const distanceMiles = `${Math.round(distance * 0.621371)}mi`;
    return {
      ...location,
      distanceKm,
      distanceMiles
    };
  }
  return location;
});

// Write the updated locations back to the file
fs.writeFileSync(
  locationsPath,
  JSON.stringify(locationsData, null, 2),
  'utf8'
);

console.log('Distances calculated and added to all-locations.json'); 