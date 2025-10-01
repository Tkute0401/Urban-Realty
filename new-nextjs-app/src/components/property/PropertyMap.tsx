import React from 'react';
import { Box, Typography } from '@mui/material';
import MapplsMap from './MapplsMap';
import './PropertyMap.css';

// Styles moved to CSS to avoid inline-style usage

const PropertyMap = ({ location, address }) => {
  console.log('🔧 PropertyMap rendering...', { location, address });
  
  React.useEffect(() => {
    console.log('🔧 PropertyMap mounted on client side!');
  }, []);

  if (!location || !location.coordinates || location.coordinates.length !== 2) {
    return (
      <Typography variant="body2" color="text.secondary">
        Location information is not available.
      </Typography>
    );
  }

  const center = {
    lat: location.coordinates[1],
    lng: location.coordinates[0]
  };

  // Create a single property object for the map
  const property = {
    _id: 'single-property',
    title: address?.street || 'Property Location',
    address: address,
    location: location
  };

  return (
    <MapplsMap
      properties={[property]}
      center={center}
      zoom={15}
      className="map-container map-container--sm"
      height="300px"
    />
  );
};

export default PropertyMap;