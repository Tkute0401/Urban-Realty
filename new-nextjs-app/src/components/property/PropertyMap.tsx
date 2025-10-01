import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import './PropertyMap.css';

const PropertyMap = ({ location, address }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [error, setError] = useState(null);
  const [mapplsLoaded, setMapplsLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const retryCountRef = useRef(0);
  const initializationTimeoutRef = useRef(null);

  const mapplsApiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY || '82f5c384638d8cfc7d13e310780bae89';

  // Load Mappls script
  useEffect(() => {
    if (typeof window === 'undefined' || mapplsLoaded) return;

    const loadMapplsScript = () => {
      return new Promise((resolve, reject) => {
        if (window.mappls) {
          console.log('🔧 Mappls already loaded');
          setMapplsLoaded(true);
          resolve(undefined);
          return;
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector('script[src*="mappls.com"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => {
            console.log('🔧 Mappls script loaded from existing');
            setMapplsLoaded(true);
            resolve(undefined);
          });
          existingScript.addEventListener('error', () => {
            console.error('🔧 Failed to load existing Mappls script');
            setError('Failed to load map script');
            reject(new Error('Script load failed'));
          });
          return;
        }

        const script = document.createElement('script');
        script.src = `https://apis.mappls.com/advancedmaps/api/${mapplsApiKey}/map_sdk?v=3.0&layer=vector`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log('🔧 Mappls script loaded successfully');
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
  }, [mapplsApiKey, mapplsLoaded]);

  // Initialize map with better error handling
  const initializePropertyMap = useCallback(() => {
    if (!mapRef.current || !window.mappls || isInitializing) {
      console.log('🔧 PropertyMap initialization skipped:', {
        hasContainer: !!mapRef.current,
        hasMappls: !!window.mappls,
        isInitializing
      });
      return;
    }

    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      console.log('🔧 PropertyMap: Invalid location data');
      setError('Invalid location data');
      return;
    }

    setIsInitializing(true);
    const container = mapRef.current;
    
    // Wait for container to be properly rendered
    const checkContainer = () => {
      const rect = container.getBoundingClientRect();
      const isVisible = container.offsetParent !== null;
      const hasDimensions = rect.width > 0 && rect.height > 0 && container.offsetWidth > 0 && container.offsetHeight > 0;
      const isInDOM = document.contains(container);
      
      console.log('🔧 PropertyMap container readiness check:', {
        isVisible,
        hasDimensions,
        isInDOM,
        rect: { width: rect.width, height: rect.height },
        offset: { width: container.offsetWidth, height: container.offsetHeight }
      });
      
      return isVisible && hasDimensions && isInDOM;
    };

    if (!checkContainer()) {
      retryCountRef.current += 1;
      if (retryCountRef.current > 5) {
        console.error('🔧 PropertyMap container failed to initialize after 5 retries');
        setError('Map container failed to initialize');
        setIsInitializing(false);
        return;
      }
      console.log(`🔧 PropertyMap container not ready, retrying in 1000ms... (attempt ${retryCountRef.current})`);
      initializationTimeoutRef.current = setTimeout(() => {
        if (mapRef.current && !isInitializing) {
          initializePropertyMap();
        }
      }, 1000);
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

      // Wait a bit more to ensure container is fully ready
      setTimeout(() => {
        try {
          // Create map with proper error handling
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

          // Verify map object is valid
          if (!map || typeof map.addListener !== 'function') {
            throw new Error('Invalid map object created');
          }

          // Add error listener
          map.addListener('error', (e) => {
            console.error('🔧 PropertyMap error:', e);
            setError('Map failed to load properly');
          });

          // Add idle listener
          map.addListener('idle', () => {
            console.log('🔧 PropertyMap is idle and ready');
            setIsInitializing(false);
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
          retryCountRef.current = 0; // Reset retry counter on success
          console.log('🔧 PropertyMap initialized successfully');
        } catch (mapErr) {
          console.error('Error creating Mappls map in PropertyMap:', mapErr);
          setError('Failed to load map: ' + mapErr.message);
          setIsInitializing(false);
        }
      }, 100);
    } catch (err) {
      console.error('Error in PropertyMap initialization:', err);
      setError('Failed to load map: ' + err.message);
      setIsInitializing(false);
    }
  }, [location, address, isInitializing]);

  // Initialize map when ready
  useEffect(() => {
    if (!mapplsLoaded || !mapRef.current || !location || !location.coordinates || location.coordinates.length !== 2 || isInitializing) {
      return;
    }

    // Use timeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      initializePropertyMap();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
      }
    };
  }, [mapplsLoaded, location, address, initializePropertyMap, isInitializing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup timeouts
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
      }
    };
  }, []);

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