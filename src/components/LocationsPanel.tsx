import React, { useState, useEffect } from 'react';
import { Location } from '../types/consumer-locations';
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
    <div className={`locations-panel ${isVisible ? 'visible' : 'hidden'}`} style={{ flex: '0 0 300px', padding: '16px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px', margin: '16px' }}>
      <div className="locations-header">
        <h2>Where we're coming from</h2>
        <button
          onClick={onToggleLocations}
          className="pillar-toggle-button"
          style={{
            marginTop: 8,
            marginBottom: 8,
            padding: '6px 14px',
            borderRadius: '16px',
            border: 'none',
            background: useAllLocations ? '#50F1FA' : '#8686FC',
            color: '#fff',
            fontWeight: 600,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            transition: 'background 0.2s',
            fontSize: '1rem',
          }}
        >
          {useAllLocations ? 'Show Consumer Pillar' : 'Show all Pillars'}
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
  );
};

export default LocationsPanel; 