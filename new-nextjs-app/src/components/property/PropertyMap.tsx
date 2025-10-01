import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import './PropertyMap.css';

const PropertyMap = ({ location, address }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [error, setError] = useState(null);
  const [mapplsLoaded, setMapplsLoaded] = useState(false);

  const mapplsApiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY || '82f5c384638d8cfc7d13e310780bae89';

  // Load Mappls script
  useEffect(() => {
    if (typeof window === 'undefined' || mapplsLoaded) return;

    const loadMapplsScript = () => {
      return new Promise((resolve, reject) => {
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
          setError('Failed to load map script');
          reject(new Error('Script load failed'));
        };
        document.head.appendChild(script);
      });
    };

    if (mapplsApiKey) {
      loadMapplsScript().catch(console.error);
    }
  }, [mapplsApiKey]);

  // Initialize map
  const initializePropertyMap = () => {
    if (!mapRef.current || !window.mappls) {
      console.log('🔧 PropertyMap initialization failed: missing container or mappls');
      return;
    }

    const container = mapRef.current;
    const rect = container.getBoundingClientRect();
    
    // Check if container is ready
    if (!container.offsetParent || rect.width === 0 || rect.height === 0) {
      console.log('🔧 PropertyMap container not ready, retrying...');
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

      console.log('🔧 Initializing PropertyMap...', { center });
      
      // Clear any existing map content
      container.innerHTML = '';

      // Create map
      const map = new window.mappls.Map(container, {
        center: center,
        zoom: 15,
        mapTypeId: 'mappls.vector',
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
      map.addListener('error', (e) => {
        console.error('🔧 Map error:', e);
        setError('Map failed to load properly');
      });

      // Add idle listener
      map.addListener('idle', () => {
        console.log('🔧 PropertyMap is idle and ready');
      });

      // Add marker
      const marker = new window.mappls.Marker({
        position: center,
        map: map,
        title: address || 'Property Location'
      });

      // Add info window
      const infoWindow = new window.mappls.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 200px;">
            <h4 style="margin: 0 0 5px 0; font-size: 14px;">Property Location</h4>
            <p style="margin: 0; font-size: 12px; color: #666;">${address || 'Property Location'}</p>
          </div>
        `
      });

      // Open info window
      infoWindow.open(map, marker);

      setMapInstance(map);
      console.log('🔧 PropertyMap initialized successfully');
    } catch (err) {
      console.error('Error creating Mappls map in PropertyMap:', err);
      setError('Failed to load map: ' + err.message);
    }
  };

  // Initialize map when ready
  useEffect(() => {
    if (!mapplsLoaded || !mapRef.current || !location || !location.coordinates || location.coordinates.length !== 2) {
      return;
    }

    // Use timeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      initializePropertyMap();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [mapplsLoaded, location, address]);

  if (!location || !location.coordinates || location.coordinates.length !== 2) {
    return (
      <Box sx={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          No location data available for this property
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc', borderRadius: 1 }}>
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!mapplsLoaded) {
    return (
      <Box sx={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Loading map...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '400px', position: 'relative' }}>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '4px',
          overflow: 'hidden'
        }}
      />
    </Box>
  );
};

export default PropertyMap;