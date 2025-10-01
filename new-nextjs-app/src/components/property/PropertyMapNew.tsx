'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import MapTilesContainer from './MapTilesContainer';

// Mappls types are now defined in src/types/mappls.d.ts

const PropertyMapNew = ({ location, address }) => {
  console.log('🔧 PropertyMapNew rendering...', { location, address });
  
  const [map, setMap] = useState(null);
  const [mapplsLoaded, setMapplsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Use environment variable from Next.js
  const mapplsApiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY || '82f5c384638d8cfc7d13e310780bae89';
  
  // Debug logging
  console.log('🔧 PropertyMapNew Debug Info:', {
    apiKey: mapplsApiKey ? 'Found' : 'Missing',
    apiKeyLength: mapplsApiKey?.length || 0,
    apiKeyPreview: mapplsApiKey ? `${mapplsApiKey.substring(0, 10)}...` : 'N/A',
    nodeEnv: process.env.NODE_ENV,
    isClient: typeof window !== 'undefined',
    location: location,
    address: address
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

  // Add marker when map is ready
  const handleMapReady = (mapInstance) => {
    console.log('🔧 PropertyMap is ready, adding marker...');
    setMap(mapInstance);
    
    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      console.log('🔧 No valid location to display');
      return;
    }

    const center = {
      lat: location.coordinates[1],
      lng: location.coordinates[0]
    };

    console.log('🔧 Adding marker at:', center);

    // Add marker
    const marker = new window.mappls.Marker({
      map: mapInstance,
      position: center,
      title: address || 'Property Location'
    });

    // Add info window
    const infoWindow = new window.mappls.InfoWindow({
      map: mapInstance,
      position: center,
      content: `
        <div style="padding: 10px; max-width: 200px;">
          <h4 style="margin: 0 0 5px 0; font-size: 14px;">Property Location</h4>
          <p style="margin: 0; font-size: 12px; color: #666;">${address || 'Location not specified'}</p>
        </div>
      `
    });

    // Open info window by default
    infoWindow.open(mapInstance);

    console.log('✅ PropertyMap marker and info window created successfully');
  };

  const handleMapError = (errorMessage) => {
    console.error('🔧 PropertyMap error:', errorMessage);
    setError(errorMessage);
  };

  if (!location || !location.coordinates || location.coordinates.length !== 2) {
    return (
      <Box className="map-empty">
        <Typography variant="body2" color="text.secondary">
          No location data available for this property
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="map-container-wrapper">
      <MapTilesContainer
        className="map-container--sm"
        onMapReady={handleMapReady}
        onMapError={handleMapError}
        style={{ height: '300px' }}
      />
    </Box>
  );
};

export default PropertyMapNew;
