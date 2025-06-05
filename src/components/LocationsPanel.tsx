import React, { useState, useEffect } from 'react';
import { Location } from '../types/locations';
import './LocationsPanel.css';

interface LocationsPanelProps {
  locations: Location[];
  selectedLocation: Location | null;
  onLocationSelect: (location: Location | null) => void;
  useAllLocations: boolean;
  onToggleLocations: () => void;
}

const LocationsPanel: React.FC<LocationsPanelProps> = ({ 
  locations, 
  selectedLocation,
  onLocationSelect,
  useAllLocations,
  onToggleLocations
}) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isVisible, setIsVisible] = useState(true);

  // Set initial visibility based on screen size
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    setIsVisible(!isMobile);
  }, []);

  const toggleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const togglePanel = () => {
    setIsVisible(!isVisible);
  };

  const sortedLocations = [...locations].sort((a, b) => {
    const distanceA = parseFloat(a.distanceMiles?.toString().replace(/[^0-9.]/g, '') || '0');
    const distanceB = parseFloat(b.distanceMiles?.toString().replace(/[^0-9.]/g, '') || '0');
    return sortOrder === 'asc' ? distanceA - distanceB : distanceB - distanceA;
  });

  return (
    <>
      <button 
        className="toggle-panel-button"
        onClick={togglePanel}
        aria-label={isVisible ? 'Hide locations' : 'Show locations'}
      >
        {isVisible ? 'Hide Locations' : 'Show All Locations'}
      </button>
      <div className={`locations-panel ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="locations-header">
          <div className="view-selector">
            <label htmlFor="view-select">View:</label>
            <select
              id="view-select"
              value={useAllLocations ? 'all' : 'consumer'}
              onChange={onToggleLocations}
              className="view-select"
            >
              <option value="all">All Pillars</option>
              <option value="consumer">Consumer Pillar</option>
            </select>
          </div>
          <h2>Where we're traveling from</h2>
          <button 
            onClick={toggleSort}
            className="sort-button"
            title={sortOrder === 'asc' ? 'Sort by longest distance' : 'Sort by shortest distance'}
          >
            {sortOrder === 'asc' ? 'sort by distance ↑' : 'sort by distance ↓'}
          </button>
        </div>
        <div className="locations-list">
          {sortedLocations.map((location, index) => (
            <div
              key={index}
              className={`location-card ${selectedLocation === location ? 'selected' : ''}`}
              onClick={() => onLocationSelect(selectedLocation === location ? null : location)}
            >
              <div className="location-name">{location.name}</div>
              {location.distanceMiles && location.distanceKm && (
                <div className="location-distance">
                  {location.distanceMiles}mi ({location.distanceKm}km)
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LocationsPanel; 