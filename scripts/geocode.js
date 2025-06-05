import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const locationsFile = path.join(__dirname, '../src/data/locations.json');
const locations = JSON.parse(fs.readFileSync(locationsFile, 'utf8'));

// Function to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to geocode a location
async function geocodeLocation(location) {
  return new Promise((resolve, reject) => {
    const encodedLocation = encodeURIComponent(location.name);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&format=json&limit=1`;
    
    const options = {
      headers: {
        'User-Agent': 'OffsiteMapper/1.0'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const results = JSON.parse(data);
          if (results && results.length > 0) {
            resolve({
              ...location,
              coordinates: [parseFloat(results[0].lat), parseFloat(results[0].lon)]
            });
          } else {
            console.warn(`No results found for ${location.name}`);
            resolve(location);
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Main function to process all locations
async function processLocations() {
  const updatedLocations = [];
  
  for (const location of locations.locations) {
    try {
      console.log(`Geocoding: ${location.name}`);
      const updatedLocation = await geocodeLocation(location);
      updatedLocations.push(updatedLocation);
      // Respect Nominatim's usage policy (1 request per second)
      await delay(1000);
    } catch (error) {
      console.error(`Error processing ${location.name}:`, error);
      updatedLocations.push(location);
    }
  }

  // Write updated locations back to file
  fs.writeFileSync(
    locationsFile,
    JSON.stringify({ locations: updatedLocations }, null, 2),
    'utf8'
  );
  
  console.log('Geocoding complete!');
}

processLocations().catch(console.error); 