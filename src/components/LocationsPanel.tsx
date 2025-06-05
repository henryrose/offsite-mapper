import React, { useState } from 'react';
import { Location } from '../types/locations';

interface LocationsPanelProps {
  locations: Location[];
  selectedLocation: Location | null;
  onLocationSelect: (location: Location | null) => void;
}

const LocationsPanel: React.FC<LocationsPanelProps> = ({ 
  locations, 
  selectedLocation,
  onLocationSelect 
}) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedLocations = [...locations].sort((a, b) => {
    if (!a.distanceKm || !b.distanceKm) return 0;
    return sortOrder === 'asc' 
      ? a.distanceKm - b.distanceKm 
      : b.distanceKm - a.distanceKm;
  });

  const toggleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 1000,
      maxHeight: 'calc(100vh - 40px)',
      overflowY: 'auto',
      minWidth: '250px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.2em' }}>Where we're coming from</h2>
        <button 
          onClick={toggleSort}
          style={{
            background: 'none',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '4px 8px',
            cursor: 'pointer',
            fontSize: '0.9em'
          }}
        >
          Sort by Distance {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sortedLocations.map((location, index) => (
          <div 
            key={index}
            onClick={() => onLocationSelect(selectedLocation === location ? null : location)}
            style={{
              padding: '10px',
              backgroundColor: selectedLocation === location ? '#f0f0f0' : '#f8f8f8',
              borderRadius: '4px',
              border: `1px solid ${selectedLocation === location ? '#50F1FA' : '#eee'}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              transform: selectedLocation === location ? 'scale(1.02)' : 'scale(1)',
              boxShadow: selectedLocation === location ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {location.name}
            </div>
            {location.distanceKm && location.distanceMiles && (
              <div style={{ color: '#666', fontSize: '0.9em' }}>
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