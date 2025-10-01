import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import './PropertiesMap.css';
// Removed MapTilesContainer import - using direct implementation

// Mappls types are now defined in src/types/mappls.d.ts

// Styles moved to CSS to avoid inline-style usage

const PropertiesMap = ({ properties, selectedProperty, onMarkerClick }) => {
  console.log('🔧 PropertiesMap rendering...', { propertiesCount: properties?.length, selectedProperty });
  
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [mapplsLoaded, setMapplsLoaded] = useState(false);
  
  // Use environment variable from Next.js
  const mapplsApiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY || '82f5c384638d8cfc7d13e310780bae89';
  
  // Debug logging
  console.log('🔧 PropertiesMap Debug Info:', {
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

  // Initialize map function with better container checks
  const initializeMap = () => {
    if (!mapRef.current || !window.mappls) {
      console.log('🔧 Map initialization failed: missing container or mappls');
      return;
    }

    // More robust container readiness check
    const container = mapRef.current;
    const rect = container.getBoundingClientRect();
    
    // Check if container is attached to DOM and visible
    if (!container.offsetParent || rect.width === 0 || rect.height === 0) {
      console.log('🔧 Map container not ready, retrying...', {
        offsetParent: !!container.offsetParent,
        dimensions: { width: rect.width, height: rect.height }
      });
      setTimeout(() => {
        if (mapRef.current) {
          initializeMap();
        }
      }, 300);
      return;
    }

    // Additional check to ensure container is fully rendered
    if (container.offsetWidth === 0 || container.offsetHeight === 0) {
      console.log('🔧 Map container has no offset dimensions, retrying...');
      setTimeout(() => {
        if (mapRef.current) {
          initializeMap();
        }
      }, 300);
      return;
    }

    try {
      console.log('🔧 Initializing MapTiles map...', {
        container: container,
        dimensions: { width: rect.width, height: rect.height },
        offsetDimensions: { width: container.offsetWidth, height: container.offsetHeight },
        mappls: !!window.mappls
      });
      
      // Clear any existing map content
      container.innerHTML = '';

      // Create map with proper configuration
      const map = new window.mappls.Map(container, {
        center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
        zoom: 10,
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

      setMapInstance(map);

      // Add error listener
      map.addListener('error', (error) => {
        console.error('🔧 Map error:', error);
        setError('Map failed to load properly');
      });

      // Wait for map to be ready
      map.addListener('idle', () => {
        console.log('🔧 Map is idle and ready');
      });

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
          map.fitBounds(coordinates);
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

        const marker = new window.mappls.Marker({
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
      setIsLoaded(true);

    } catch (err) {
      console.error('Error creating Mappls map:', err);
      setError('Failed to load map');
    }
  };

  useEffect(() => {
    if (!mapplsLoaded || !mapRef.current || !properties) {
      console.log('🔧 Map initialization skipped:', { mapplsLoaded, mapRef: !!mapRef.current, properties: !!properties });
      return;
    }

    // Cleanup existing markers before re-rendering
    markers.forEach(marker => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });

    // Use a longer timeout to ensure DOM is fully ready
    const timeoutId = setTimeout(() => {
      console.log('🔧 PropertiesMap attempting initialization...');
      initializeMap();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [mapplsLoaded, properties, selectedProperty, onMarkerClick]);

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
          Map unavailable. {error}
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