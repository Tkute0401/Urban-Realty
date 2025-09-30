import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import './PropertyMap.css';

// Styles moved to CSS to avoid inline-style usage

const PropertyMap = ({ location, address }) => {
  console.log('🔧 PropertyMap rendering...', { location, address });
  
  React.useEffect(() => {
    console.log('🔧 PropertyMap mounted on client side!');
  }, []);
  const mapRef = useRef(null);
  const [activeMarker, setActiveMarker] = useState(null);

  // Use environment variable from Next.js
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!location || !location.coordinates || location.coordinates.length !== 2) {
    return (
      <Typography variant="body2" color="text.secondary">
        Location information is not available.
      </Typography>
    );
  }

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const center = {
    lat: location.coordinates[1],
    lng: location.coordinates[0]
  };

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  if (!googleMapsApiKey) {
    return (
      <Typography variant="body2" color="text.secondary">
        Map unavailable. Missing Google Maps API key.
      </Typography>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={googleMapsApiKey}
      loadingElement={<div>Loading Google Maps...</div>}
      >
      <GoogleMap
        mapContainerClassName="map-container map-container--sm"
        center={center}
        zoom={15}
        onLoad={onLoad}
      >
        <Marker
          position={center}
          onClick={() => handleActiveMarker(1)}
        >
          {activeMarker === 1 && (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div>
                <Typography variant="subtitle2">{address.street}</Typography>
                <Typography variant="body2">
                  {address.city}, {address.state} {address.zipCode}
                </Typography>
              </div>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>
    </LoadScript>
  );
};

export default PropertyMap;