import React from 'react';
import { Box, Typography } from '@mui/material';
import MapplsMap from './MapplsMap';
import './PropertiesMap.css';

// Styles moved to CSS to avoid inline-style usage

const PropertiesMap = ({ properties, selectedProperty, onMarkerClick }) => {
  console.log('🔧 PropertiesMap rendering...', { propertiesCount: properties?.length, selectedProperty });
  
  React.useEffect(() => {
    console.log('🔧 PropertiesMap mounted on client side!', { propertiesCount: properties?.length });
  }, []);

  return (
    <MapplsMap
      properties={properties}
      selectedProperty={selectedProperty}
      onMarkerClick={onMarkerClick}
      className="map-container map-container--lg"
      height="500px"
    />
  );
};

export default PropertiesMap;