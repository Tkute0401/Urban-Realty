import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useThemeContext } from '../../context/ThemeContext';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
  border: '1px solid var(--color-accent)'
};

const PropertyMap = ({ location, address }) => {
  const mapRef = useRef(null);
  const { mode } = useThemeContext();
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

  const mapStylesDark = [
    { elementType: 'geometry', stylers: [{ color: '#1d2c2e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] }
  ];

  const mapOptions = {
    styles: mode === 'dark' ? mapStylesDark : undefined,
    disableDefaultUI: false
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
        options={mapOptions}
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