import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px'
};

const PropertyMap = ({ location, address }) => {
  const mapRef = useRef(null);
  const [activeMarker, setActiveMarker] = useState(null);

  // Use environment variable from Vite
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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

  return (
    <LoadScript 
      googleMapsApiKey={googleMapsApiKey}
      onLoad={() => {
        setTimeout(() => {(map) => (mapRef.current = map)}, 100);
      }}
      >
      <GoogleMap
        mapContainerStyle={containerStyle}
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