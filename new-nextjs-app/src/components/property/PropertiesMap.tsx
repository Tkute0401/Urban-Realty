import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { getMapStyles } from '../../lib/map-styles';
import './PropertiesMap.css';

// Styles moved to CSS to avoid inline-style usage

const PropertiesMap = ({ properties, selectedProperty, onMarkerClick }) => {
  console.log('🔧 PropertiesMap rendering...', { propertiesCount: properties?.length, selectedProperty });
  
  React.useEffect(() => {
    console.log('🔧 PropertiesMap mounted on client side!', { propertiesCount: properties?.length });
  }, []);
  const mapRef = useRef(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Use environment variable from Next.js
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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
      <Box className="map-empty">
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

  if (!googleMapsApiKey) {
    return (
      <Box className="map-empty">
        <Typography variant="body2" color="text.secondary">
          Map unavailable. Missing Google Maps API key.
        </Typography>
      </Box>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={googleMapsApiKey}
      onLoad={() => {
        setTimeout(() => setIsLoaded(true), 100);
      }}
    >
      <GoogleMap
        mapContainerClassName="map-container map-container--lg"
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: getMapStyles()
        }}
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
          const markerColor = isSelected ? 'var(--color-primary-orange)' : 'var(--color-primary-blue)';
          
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
                strokeColor: 'var(--color-bg-dark)',
                strokeWeight: 1,
                scale: isSelected ? 10 : 8
              }}
            >
              {activeMarker === index && (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div className="text-dark maxw-200">
                    <h3 className="my-1 fs-16">{property.title}</h3>
                    <p className="my-1 fs-14">
                      {property.address?.street}, {property.address?.city}
                    </p>
                    <p className="my-1 fs-14 fw-700">
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