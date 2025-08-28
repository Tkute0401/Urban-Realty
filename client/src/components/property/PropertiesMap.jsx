import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useThemeContext } from '../../context/ThemeContext';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '8px',
  border: '1px solid var(--color-accent)'
};

const PropertiesMap = ({ properties, selectedProperty, onMarkerClick }) => {
  const mapRef = useRef(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { mode } = useThemeContext();
  
  // Use environment variable from Vite
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (isLoaded && properties?.length > 0 && mapRef.current) {
      // Calculate bounds to fit all markers
      const newBounds = new window.google.maps.LatLngBounds();
      properties.forEach(property => {
        if (property.location?.coordinates?.length === 2) {
          newBounds.extend({
            lat: property.location.coordinates[1],
            lng: property.location.coordinates[0]
          });
        }
      });
      setBounds(newBounds);
      mapRef.current.fitBounds(newBounds);
    }
  }, [properties, isLoaded]);

  if (!properties || properties.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '500px',
        backgroundColor: '#0B1011',
        borderRadius: '8px',
        border: '1px solid #78CADC'
      }}>
        <Typography variant="body2" color="text.secondary">
          No properties to display on map.
        </Typography>
      </Box>
    );
  }

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const onLoad = (map) => {
    mapRef.current = map;
    setIsLoaded(true);
  };

  const onUnmount = () => {
    mapRef.current = null;
    setIsLoaded(false);
  };

  const darkStyles = [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#1d2c2e" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#8ec3b9" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#1a3646" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#0e1626" }]
    }
  ];

  const options = {
    styles: mode === 'dark' ? darkStyles : undefined
  };

  return (
    <LoadScript 
      googleMapsApiKey={googleMapsApiKey}
      onLoad={() => {
        setTimeout(() => setIsLoaded(true), 100);
      }}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={options}
      >
        {isLoaded && properties.map((property, index) => {
          if (!property.location?.coordinates || property.location.coordinates.length !== 2) {
            return null;
          }
          
          const position = {
            lat: property.location.coordinates[1],
            lng: property.location.coordinates[0]
          };
          
          const isSelected = selectedProperty?._id === property._id;
          const markerColor = isSelected ? '#FF4081' : '#78CADC';
          
          return (
            <Marker
              key={property._id}
              position={position}
              onClick={() => {
                handleActiveMarker(index);
                if (onMarkerClick) {
                  onMarkerClick(property);
                }
              }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: markerColor,
                fillOpacity: 1,
                strokeColor: '#0B1011',
                strokeWeight: 1,
                scale: isSelected ? 10 : 8
              }}
            >
              {activeMarker === index && (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div style={{ color: '#0B1011', maxWidth: '200px' }}>
                    <h3 style={{ margin: '4px 0', fontSize: '16px' }}>{property.title}</h3>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      {property.address?.street}, {property.address?.city}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: 'bold' }}>
                      {property.price ? `$${property.price.toLocaleString()}` : 'Price not available'}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default PropertiesMap;