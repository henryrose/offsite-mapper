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
function formatDistance(distanceKm) {
  const distanceMiles = distanceKm * 0.621371; // Convert km to miles
  
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    const feet = Math.round(distanceMiles * 5280);
    return `${feet}ft (${meters}m)`;
  }
  
  const miles = Math.round(distanceMiles);
  const km = Math.round(distanceKm);
  return `${miles}mi (${km}km)`;
}

// Get input and output filenames from command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Please provide an input filename');
  console.error('Usage: node calculate-distances.js <input-file> [output-file]');
  process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1] || inputFile; // If no output file specified, overwrite input file

// Read and process locations
const inputPath = path.join(__dirname, '..', inputFile);
const outputPath = path.join(__dirname, '..', outputFile);

try {
  const locations = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  // Add distances to each location and remove old distance attribute
  const updatedLocations = locations.locations.map(location => {
    if (location.coordinates) {
      const [lat, lon] = location.coordinates;
      const distanceKm = calculateDistance(
        lat,
        lon,
        NASSAU_COORDINATES[0],
        NASSAU_COORDINATES[1]
      );
      const distanceMiles = distanceKm * 0.621371;
      
      // Create new location object without the old distance attribute
      const { distance, ...locationWithoutDistance } = location;
      
      return {
        ...locationWithoutDistance,
        distanceKm: Math.round(distanceKm),
        distanceMiles: Math.round(distanceMiles)
      };
    }
    return location;
  });

  // Write updated locations back to file
  fs.writeFileSync(
    outputPath,
    JSON.stringify({ locations: updatedLocations }, null, 2),
    'utf8'
  );

  console.log(`Distances calculated and added to ${outputFile}`);
} catch (error) {
  console.error('Error processing file:', error.message);
  process.exit(1);
} 