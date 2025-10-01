'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';

// Mappls types are now defined in src/types/mappls.d.ts

const PropertiesMapNew = ({ properties, selectedProperty, onMarkerClick }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapplsLoaded, setMapplsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Use environment variable from Next.js
  const mapplsApiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY || '82f5c384638d8cfc7d13e310780bae89';

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

  // Initialize map when script is loaded
  useEffect(() => {
    if (!mapplsLoaded || !window.mappls || !mapRef.current || map) return;

    const initializeMap = () => {
      try {
        const mapInstance = new window.mappls.Map(mapRef.current, {
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

        mapInstance.addListener('error', (e) => {
          console.error('🔧 Map error:', e);
          setError('Map failed to load properly');
        });

        mapInstance.addListener('idle', () => {
          console.log('🔧 Map is idle and ready');
        });

        setMap(mapInstance);
        console.log('🔧 Map initialized successfully');
      } catch (err) {
        console.error('🔧 Error initializing map:', err);
        setError('Failed to initialize map: ' + err.message);
      }
    };

    // Wait for container to be ready
    const checkContainer = () => {
      if (mapRef.current && mapRef.current.offsetParent) {
        initializeMap();
      } else {
        setTimeout(checkContainer, 100);
      }
    };

    checkContainer();
  }, [mapplsLoaded, map]);

  // Add markers when map and properties are ready
  useEffect(() => {
    if (!map || !properties || properties.length === 0) return;

    console.log('🔧 Adding markers to map...');

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
        
        const isSelected = selectedProperty?._id === property._id;

        const marker = new window.mappls.Marker({
          map: map,
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
          if (onMarkerClick) {
            onMarkerClick(property);
          }
        });

        newMarkers.push(marker);
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
      map.fitBounds(bounds);
    }
  }, [map, properties, selectedProperty, onMarkerClick]);

  if (!properties || properties.length === 0) {
    return (
      <Box sx={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          No properties to display on map
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

export default PropertiesMapNew;
