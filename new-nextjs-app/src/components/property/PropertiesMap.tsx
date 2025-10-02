import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import './PropertiesMap.css';

const PropertiesMap = ({ properties, selectedProperty, onMarkerClick }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
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
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.mappls || isInitializing) {
      console.log('🔧 Map initialization skipped:', {
        hasContainer: !!mapRef.current,
        hasMappls: !!window.mappls,
        isInitializing
      });
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
      
      console.log('🔧 Container readiness check:', {
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
        console.error('🔧 Map container failed to initialize after 5 retries');
        setError('Map container failed to initialize');
        setIsInitializing(false);
        return;
      }
      console.log(`🔧 Container not ready, retrying in 1000ms... (attempt ${retryCountRef.current})`);
      initializationTimeoutRef.current = setTimeout(() => {
        if (mapRef.current && !isInitializing) {
          initializeMap();
        }
      }, 1000);
      return;
    }

    try {
      console.log('🔧 Initializing MapTiles map...');
      
      // Clear any existing map content
      container.innerHTML = '';

      // Wait a bit more to ensure container is fully ready
      setTimeout(() => {
        try {
          // Create map with proper error handling
          const map = new window.mappls.Map(container, {
            center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
            zoom: 10,
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
            console.error('🔧 Map error:', e);
            setError('Map failed to load properly');
          });

          // Add idle listener
          map.addListener('idle', () => {
            console.log('🔧 Map is idle and ready');
            setIsInitializing(false);
          });

          setMapInstance(map);
          retryCountRef.current = 0; // Reset retry counter on success
          console.log('🔧 Map initialized successfully');
        } catch (mapErr) {
          console.error('Error creating Mappls map:', mapErr);
          setError('Failed to load map: ' + mapErr.message);
          setIsInitializing(false);
        }
      }, 100);
    } catch (err) {
      console.error('Error in map initialization:', err);
      setError('Failed to load map: ' + err.message);
      setIsInitializing(false);
    }
  }, [isInitializing]);

  // Initialize map when ready
  useEffect(() => {
    if (!mapplsLoaded || !mapRef.current || !properties || isInitializing) {
      return;
    }

    // Cleanup existing markers
    markers.forEach(marker => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });

    // Use timeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      initializeMap();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
      }
    };
  }, [mapplsLoaded, properties, initializeMap, isInitializing]);

  // Add markers when map is ready
  useEffect(() => {
    if (!mapInstance || !properties || properties.length === 0) return;

    const newMarkers = [];
    const bounds = new window.mappls.LatLngBounds();

    properties.forEach((property, index) => {
      if (property.location && property.location.coordinates && property.location.coordinates.length === 2) {
        const position = {
          lat: property.location.coordinates[1],
          lng: property.location.coordinates[0]
        };

        const marker = new window.mappls.Marker({
          position: position,
          map: mapInstance,
          title: property.title || `Property ${index + 1}`,
          clickable: true
        });

        // Create info window
        const infoWindow = new window.mappls.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 200px;">
              <h4 style="margin: 0 0 5px 0; font-size: 14px;">${property.title || 'Property'}</h4>
              <p style="margin: 0; font-size: 12px; color: #666;">${property.address?.locality || ''}</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; font-weight: bold; color: #2e7d32;">
                ₹${property.price?.toLocaleString() || 'Price not available'}
              </p>
            </div>
          `
        });

        // Add click listener for marker
        marker.addListener('click', () => {
          console.log('🔧 Marker clicked for property:', property);
          console.log('🔧 Property ID:', property._id);
          console.log('🔧 Property title:', property.title);
          
          // Close other info windows
          newMarkers.forEach(m => {
            if (m.infoWindow) {
              m.infoWindow.close();
            }
          });
          
          infoWindow.open(mapInstance, marker);
          marker.infoWindow = infoWindow;
          
          // Call onMarkerClick if provided
          if (onMarkerClick) {
            console.log('🔧 Calling onMarkerClick with property:', property);
            onMarkerClick(property);
          }
        });

        newMarkers.push({ marker, infoWindow });
        bounds.extend(position);
      }
    });

    setMarkers(newMarkers);

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      mapInstance.fitBounds(bounds);
    }

    // Cleanup function
    return () => {
      newMarkers.forEach(({ marker, infoWindow }) => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
        if (infoWindow) {
          infoWindow.close();
        }
      });
    };
  }, [mapInstance, properties, onMarkerClick]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup markers
      markers.forEach(({ marker, infoWindow }) => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
        if (infoWindow) {
          infoWindow.close();
        }
      });
      
      // Cleanup timeouts
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
      }
    };
  }, [markers]);

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

export default PropertiesMap;