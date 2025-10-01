import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { mappls } from 'mappls-web-maps';
import './PropertiesMap.css';

// Styles moved to CSS to avoid inline-style usage

const PropertiesMap = ({ properties, selectedProperty, onMarkerClick }) => {
  console.log('🔧 PropertiesMap rendering...', { propertiesCount: properties?.length, selectedProperty });
  
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  
  // Use environment variable from Next.js
  const mapplsApiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY;
  
  // Debug logging
  console.log('🔧 PropertiesMap Debug Info:', {
    apiKey: mapplsApiKey ? 'Found' : 'Missing',
    apiKeyLength: mapplsApiKey?.length || 0,
    apiKeyPreview: mapplsApiKey ? `${mapplsApiKey.substring(0, 10)}...` : 'N/A',
    nodeEnv: process.env.NODE_ENV,
    isClient: typeof window !== 'undefined',
    propertiesCount: properties?.length || 0
  });

  useEffect(() => {
    if (!mapplsApiKey) {
      return;
    }

    // Initialize Mappls
    const mapplsInstance = new mappls();
    mapplsInstance.initialize(mapplsApiKey, {
      mapSdkLibraries: ['marker', 'infoWindow']
    }, () => {
      console.log('🔧 Mappls initialized successfully');
      setIsLoaded(true);
    });

    return () => {
      // Cleanup markers
      markers.forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      });
    };
  }, [mapplsApiKey]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !properties || properties.length === 0) {
      return;
    }

    try {
      // Clear existing markers
      markers.forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      });

      // Create map
      const mapplsInstance = new mappls();
      const map = mapplsInstance.Map({
        id: mapRef.current,
        center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
        zoom: 10
      });

      setMapInstance(map);

      // Calculate bounds
      const validProperties = properties.filter(property => 
        property.location?.coordinates?.length === 2
      );

      if (validProperties.length > 0) {
        const coordinates = validProperties.map(property => ({
          lat: property.location.coordinates[1],
          lng: property.location.coordinates[0]
        }));

        // Fit bounds to show all properties
        if (coordinates.length > 1) {
          mapplsInstance.fitBounds({
            map: map,
            bounds: coordinates
          });
        } else if (coordinates.length === 1) {
          map.setCenter(coordinates[0]);
        }
      }

      // Add markers for each property
      const newMarkers = validProperties.map((property, index) => {
        const position = {
          lat: property.location.coordinates[1],
          lng: property.location.coordinates[0]
        };

        const isSelected = selectedProperty?._id === property._id;

        const marker = mapplsInstance.Marker({
          map: map,
          position: position,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="8" fill="${isSelected ? '#FF4081' : '#78CADC'}" stroke="#0B1011" stroke-width="2"/>
              </svg>
            `)}`,
            scaledSize: { width: 20, height: 20 }
          }
        });

        // Add click listener
        marker.addListener('click', () => {
          if (onMarkerClick) {
            onMarkerClick(property);
          }
        });

        return marker;
      });

      setMarkers(newMarkers);

    } catch (err) {
      console.error('Error creating Mappls map:', err);
      setError('Failed to load map');
    }
  }, [isLoaded, properties, selectedProperty, onMarkerClick]);

  if (!properties || properties.length === 0) {
    return (
      <Box className="map-empty">
        <Typography variant="body2" color="text.secondary">
          No properties to display on map.
        </Typography>
      </Box>
    );
  }

  if (!mapplsApiKey) {
    return (
      <Box className="map-empty">
        <Typography variant="body2" color="text.secondary">
          Map unavailable. Missing Mappls API key.
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="map-empty">
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div 
      ref={mapRef}
      className="map-container map-container--lg"
      style={{
        height: '500px',
        width: '100%'
      }}
    />
  );
};

export default PropertiesMap;