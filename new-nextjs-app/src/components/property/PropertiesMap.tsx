import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import './PropertiesMap.css';

const PropertiesMap = ({ properties, selectedProperty, onMarkerClick }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
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
  const initializeMap = () => {
    if (!mapRef.current || !window.mappls) {
      console.log('🔧 Map initialization failed: missing container or mappls');
      return;
    }

    const container = mapRef.current;
    const rect = container.getBoundingClientRect();
    
    // Check if container is ready
    if (!container.offsetParent || rect.width === 0 || rect.height === 0) {
      console.log('🔧 Map container not ready, retrying...');
      setTimeout(() => {
        if (mapRef.current) {
          initializeMap();
        }
      }, 300);
      return;
    }

    try {
      console.log('🔧 Initializing MapTiles map...');
      
      // Clear any existing map content
      container.innerHTML = '';

      // Create map
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

      // Add error listener
      map.addListener('error', (e) => {
        console.error('🔧 Map error:', e);
        setError('Map failed to load properly');
      });

      // Add idle listener
      map.addListener('idle', () => {
        console.log('🔧 Map is idle and ready');
      });

      setMapInstance(map);
      console.log('🔧 Map initialized successfully');
    } catch (err) {
      console.error('Error creating Mappls map:', err);
      setError('Failed to load map');
    }
  };

  // Initialize map when ready
  useEffect(() => {
    if (!mapplsLoaded || !mapRef.current || !properties) {
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
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [mapplsLoaded, properties, selectedProperty, onMarkerClick]);

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

        // Add click listener
        marker.addListener('click', () => {
          if (onMarkerClick) {
            onMarkerClick(property);
          }
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

        // Add info window click listener
        marker.addListener('click', () => {
          // Close other info windows
          newMarkers.forEach(m => {
            if (m.infoWindow) {
              m.infoWindow.close();
            }
          });
          
          infoWindow.open(mapInstance, marker);
          marker.infoWindow = infoWindow;
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