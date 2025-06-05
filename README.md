# Offsite Mapper

An interactive map app for visualizing team locations around the world, centered on Nassau, Bahamas. Built with React and Leaflet, this project displays custom markers for each team member and calculates the distance from each location to Nassau in both miles and kilometers.

## Technologies Used

- **React** (with Vite) — UI framework for building interactive web apps
- **TypeScript** — Type safety for React and scripts
- **Leaflet** & **React-Leaflet** — Interactive mapping and geospatial visualization
- **gh-pages** — For static deployment to GitHub Pages
- **ESLint** — Linting and code quality

## Getting Started (Development)

1. **Clone the repository:**
   ```sh
   git clone https://github.com/henryrose/offsite-mapper.git
   cd offsite-mapper
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

## Publishing to GitHub Pages

1. **Build the app:**
   ```sh
   npm run build
   ```
2. **Deploy to GitHub Pages:**
   ```sh
   npm run deploy
   ```
   This uses the `gh-pages` package to publish the contents of the `dist` folder to the `gh-pages` branch.

Your site will be available at: `https://henryrose.github.io/offsite-mapper/`

## Project Structure

- `src/` — React components, types, and data
- `src/components/Map.tsx` — Main map component
- `src/data/consumer-locations.json` — Team location data
- `scripts/calculate-distances.js` — Script to calculate distances to Nassau

## Customization
- To add or update locations, edit `src/data/consumer-locations.json` and (optionally) run the distance calculation script:
  ```sh
  node scripts/calculate-distances.js
  ```

---

Feel free to open issues or pull requests for improvements or questions!
