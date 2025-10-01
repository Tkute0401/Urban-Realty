import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import './PropertyMap.css';

// Mappls types are now defined in src/types/mappls.d.ts

// Styles moved to CSS to avoid inline-style usage

const PropertyMap = ({ location, address }) => {
  console.log('🔧 PropertyMap rendering...', { location, address });
  
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [mapplsLoaded, setMapplsLoaded] = useState(false);

      // Use environment variable from Next.js
      const mapplsApiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY || '82f5c384638d8cfc7d13e310780bae89';
  
  // Debug logging
  console.log('🔧 PropertyMap Debug Info:', {
    apiKey: mapplsApiKey ? 'Found' : 'Missing',
    apiKeyLength: mapplsApiKey?.length || 0,
    apiKeyPreview: mapplsApiKey ? `${mapplsApiKey.substring(0, 10)}...` : 'N/A',
    nodeEnv: process.env.NODE_ENV,
    isClient: typeof window !== 'undefined',
    location: location,
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

  // Initialize map when Mappls is loaded
  useEffect(() => {
    if (!mapplsLoaded || !mapRef.current || !location || !location.coordinates || location.coordinates.length !== 2) {
      console.log('🔧 PropertyMap initialization skipped:', { mapplsLoaded, mapRef: !!mapRef.current, location });
      return;
    }

    // Use a longer timeout to ensure DOM is fully ready
    const timeoutId = setTimeout(() => {
      console.log('🔧 PropertyMap attempting initialization...');
      initializePropertyMap();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [mapplsLoaded, location, address]);

  const initializePropertyMap = () => {
    if (!mapRef.current || !window.mappls) {
      console.log('🔧 PropertyMap initialization failed: missing container or mappls');
      return;
    }

    // More robust container readiness check
    const container = mapRef.current;
    const rect = container.getBoundingClientRect();
    
    // Check if container is attached to DOM and visible
    if (!container.offsetParent || rect.width === 0 || rect.height === 0) {
      console.log('🔧 PropertyMap container not ready, retrying...', {
        offsetParent: !!container.offsetParent,
        dimensions: { width: rect.width, height: rect.height }
      });
      setTimeout(() => {
        if (mapRef.current) {
          initializePropertyMap();
        }
      }, 300);
      return;
    }

    // Additional check to ensure container is fully rendered
    if (container.offsetWidth === 0 || container.offsetHeight === 0) {
      console.log('🔧 PropertyMap container has no offset dimensions, retrying...');
      setTimeout(() => {
        if (mapRef.current) {
          initializePropertyMap();
        }
      }, 300);
      return;
    }

    try {
      const center = {
        lat: location.coordinates[1],
        lng: location.coordinates[0]
      };

      console.log('🔧 Initializing PropertyMap...', {
        container: container,
        dimensions: { width: rect.width, height: rect.height },
        offsetDimensions: { width: container.offsetWidth, height: container.offsetHeight },
        center: center
      });
      
      // Clear any existing map content
      container.innerHTML = '';

      // Create map using Mappls API with proper configuration
      const map = new window.mappls.Map(container, {
        center: center,
        zoom: 15,
        mapTypeId: 'mappls.vector', // Use vector map type
        gestureHandling: 'greedy',
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
      });

      // Add error listener
      map.addListener('error', (error) => {
        console.error('🔧 PropertyMap error:', error);
        setError('Map failed to load properly');
      });

      // Wait for map to be ready
      map.addListener('idle', () => {
        console.log('🔧 PropertyMap is idle and ready');
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
  };

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