import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import './PropertyMap.css';

// Styles moved to CSS to avoid inline-style usage

const PropertyMap = ({ location, address }) => {
  console.log('🔧 PropertyMap rendering...', { location, address });
  
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [mapplsLoaded, setMapplsLoaded] = useState(false);

  // Use environment variable from Vite
  const mapplsApiKey = import.meta.env.VITE_MAPPLS_API_KEY || '82f5c384638d8cfc7d13e310780bae89';
  
  // Debug logging
  console.log('🔧 PropertyMap Debug Info:', {
    apiKey: mapplsApiKey ? 'Found' : 'Missing',
    apiKeyLength: mapplsApiKey?.length || 0,
    apiKeyPreview: mapplsApiKey ? `${mapplsApiKey.substring(0, 10)}...` : 'N/A',
    nodeEnv: import.meta.env.MODE,
    isClient: typeof window !== 'undefined',
    location: location,
    allEnvVars: Object.keys(import.meta.env).filter(key => key.includes('MAPPLS')),
    rawApiKey: import.meta.env.VITE_MAPPLS_API_KEY
  });

  // Load Mappls script
  useEffect(() => {
    if (typeof window === 'undefined' || mapplsLoaded) return;

    const loadMapplsScript = () => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        if (window.mappls) {
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
  }, [mapplsApiKey, mapplsLoaded]);

  // Initialize map when Mappls is loaded
  useEffect(() => {
    if (!mapplsLoaded || !mapRef.current || !location || !location.coordinates || location.coordinates.length !== 2) {
      return;
    }

    try {
      const center = {
        lat: location.coordinates[1],
        lng: location.coordinates[0]
      };

      // Create map using Mappls API
      const map = new window.mappls.Map(mapRef.current, {
        center: center,
        zoom: 15
      });

      // Add marker
      const marker = new window.mappls.Marker({
        map: map,
        position: center
      });

      // Add info window
      const infoWindow = new window.mappls.InfoWindow({
        map: map,
        position: center,
        content: `
          <div style="padding: 10px;">
            <h4>${address?.street || 'Address'}</h4>
            <p>${address?.city || ''}, ${address?.state || ''} ${address?.zipCode || ''}</p>
          </div>
        `
      });

      // Show info window on marker click
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      setIsLoaded(true);

    } catch (err) {
      console.error('Error creating Mappls map:', err);
      setError('Failed to load map');
    }
  }, [mapplsLoaded, location, address]);

  if (!location || !location.coordinates || location.coordinates.length !== 2) {
    return (
      <Typography variant="body2" color="text.secondary">
        Location information is not available.
      </Typography>
    );
  }

  if (!mapplsApiKey) {
    return (
      <Typography variant="body2" color="text.secondary">
        Map unavailable. Missing Mappls API key.
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        Map unavailable. {error}
      </Typography>
    );
  }

  return (
    <div 
      ref={mapRef}
      className="map-container map-container--sm"
      style={{
        height: '300px',
        width: '100%'
      }}
    />
  );
};

export default PropertyMap;