'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import MapTilesDebug from './MapTilesDebug';
import MapTilesContainer from './MapTilesContainer';

// Mappls types are now defined in src/types/mappls.d.ts

const PropertiesMapNew = ({ properties, selectedProperty, onMarkerClick }) => {
  console.log('🔧 PropertiesMapNew rendering...', { propertiesCount: properties?.length, selectedProperty });
  
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapplsLoaded, setMapplsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Use environment variable from Next.js
  const mapplsApiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY || '82f5c384638d8cfc7d13e310780bae89';
  
  // Debug logging
  console.log('🔧 PropertiesMapNew Debug Info:', {
    apiKey: mapplsApiKey ? 'Found' : 'Missing',
    apiKeyLength: mapplsApiKey?.length || 0,
    apiKeyPreview: mapplsApiKey ? `${mapplsApiKey.substring(0, 10)}...` : 'N/A',
    nodeEnv: process.env.NODE_ENV,
    isClient: typeof window !== 'undefined',
    propertiesCount: properties?.length || 0,
    allEnvVars: Object.keys(process.env).filter(key => key.includes('MAPPLS')),
    rawApiKey: process.env.NEXT_PUBLIC_MAPPLS_API_KEY
  });

  // Load Mappls script
  useEffect(() => {
    if (typeof window === 'undefined' || mapplsLoaded) return;

    const loadMapplsScript = () => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        if (window.mappls) {
          setMapplsLoaded(true);
          resolve(undefined);
          return;
        }

        const script = document.createElement('script');
        script.src = `https://apis.mappls.com/advancedmaps/api/${mapplsApiKey}/map_sdk?v=3.0&layer=vector`;
        script.async = true;
        script.onload = () => {
          console.log('🔧 Mappls script loaded');
          setMapplsLoaded(true);
          resolve(undefined);
        };
        script.onerror = () => {
          console.error('🔧 Failed to load Mappls script');
          setError('Failed to load map library');
          reject(new Error('Failed to load Mappls script'));
        };
        document.head.appendChild(script);
      });
    };

    if (mapplsApiKey) {
      loadMapplsScript().catch(console.error);
    }
  }, [mapplsApiKey]);

  // Add markers when map is ready
  const handleMapReady = (mapInstance) => {
    console.log('🔧 Map is ready, adding markers...');
    setMap(mapInstance);
    
    if (!properties || properties.length === 0) {
      console.log('🔧 No properties to display');
      return;
    }

    // Clear existing markers
    markers.forEach(marker => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });

    // Add markers for each property
    const newMarkers = [];
    properties.forEach((property, index) => {
      if (property.location && property.location.coordinates && property.location.coordinates.length === 2) {
        const [lng, lat] = property.location.coordinates;
        
        console.log(`🔧 Adding marker for property ${index}:`, { lat, lng, property: property.title });
        
        const isSelected = selectedProperty?._id === property._id;

        const marker = new window.mappls.Marker({
          map: mapInstance,
          position: { lat, lng },
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
          console.log('🔧 Marker clicked:', property.title);
          if (onMarkerClick) {
            onMarkerClick(property);
          }
        });

        newMarkers.push(marker);
      } else {
        console.warn(`🔧 Property ${index} has invalid coordinates:`, property.location);
      }
    });

    setMarkers(newMarkers);
    console.log(`🔧 Added ${newMarkers.length} markers to map`);

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.mappls.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      mapInstance.fitBounds(bounds);
      console.log('🔧 Map bounds fitted to markers');
    }
  };

  const handleMapError = (errorMessage) => {
    console.error('🔧 Map error:', errorMessage);
    setError(errorMessage);
  };

  if (!properties || properties.length === 0) {
    return (
      <Box className="map-empty">
        <Typography variant="body2" color="text.secondary">
          No properties to display on map
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="map-container-wrapper">
      <MapTilesDebug 
        apiKey={mapplsApiKey}
        isLoaded={mapplsLoaded}
        error={error}
        propertiesCount={properties?.length || 0}
        allEnvVars={Object.keys(process.env).filter(key => key.includes('MAPPLS'))}
        rawApiKey={process.env.NEXT_PUBLIC_MAPPLS_API_KEY}
      />
      
      <MapTilesContainer
        className="map-container--lg"
        onMapReady={handleMapReady}
        onMapError={handleMapError}
        style={{ height: '500px' }}
      />
    </Box>
  );
};

export default PropertiesMapNew;
