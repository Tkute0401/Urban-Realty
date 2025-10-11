'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  address?: string;
  height?: string | number;
  zoom?: number;
  showMarker?: boolean;
  className?: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  latitude,
  longitude,
  address,
  height = '400px',
  zoom = 15,
  showMarker = true,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadMapScript = () => {
      // Check if already loaded
      if (window.mappls) {
        setScriptLoaded(true);
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src*="mappls"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => setScriptLoaded(true));
        return;
      }

      // Load Mappls script
      const script = document.createElement('script');
      script.src = `https://apis.mappls.com/advancedmaps/api/${process.env.NEXT_PUBLIC_MAPPLS_API_KEY}/map_sdk?layer=vector&v=3.0&callback=initMapplsMap`;
      script.async = true;
      script.defer = true;
      
      // Create global callback
      (window as any).initMapplsMap = () => {
        console.log('Mappls SDK loaded successfully');
        setScriptLoaded(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load Mappls Maps');
        setMapError('Failed to load Mappls Maps. Please check your API key.');
      };
      
      document.head.appendChild(script);
    };

    loadMapScript();
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !mapRef.current || !latitude || !longitude) return;
    
    // Clean up existing map
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {
        console.warn('Error removing map:', e);
      }
    }

    const initializeMap = () => {
      try {
        if (!window.mappls) {
          setMapError('Mappls SDK not loaded');
          return;
        }

        // Initialize map
        const mapOptions = {
          center: [latitude, longitude],
          zoom: zoom,
          zoomControl: true,
          fullscreenControl: true,
          scrollWheel: true,
          hybridMap: false,
          clickableIcons: true,
        };

        mapInstanceRef.current = new window.mappls.Map(mapRef.current, mapOptions);

        // Add marker if enabled
        if (showMarker) {
          const marker = new window.mappls.Marker({
            map: mapInstanceRef.current,
            position: { lat: latitude, lng: longitude },
            fitbounds: false,
            icon: {
              url: 'https://apis.mapmyindia.com/map_v3/1.png',
              width: 35,
              height: 50
            }
          });

          // Add popup with address if provided
          if (address) {
            const infoWindow = new window.mappls.InfoWindow({
              content: `
                <div style="padding: 10px; max-width: 200px;">
                  <h3 style="margin: 0 0 5px 0; color: var(--color-text-primary); font-size: 14px; font-weight: bold;">Property Location</h3>
                  <p style="margin: 0; color: var(--color-text-muted); font-size: 12px;">${address}</p>
                </div>
              `,
              position: { lat: latitude, lng: longitude }
            });

            marker.addListener('click', () => {
              infoWindow.open(mapInstanceRef.current);
            });
          }
        }

        setMapLoaded(true);
        setMapError(null);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to initialize map');
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeMap, 100);
    
    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Error cleaning up map:', e);
        }
      }
    };
  }, [scriptLoaded, latitude, longitude, address, zoom, showMarker]);

  if (mapError) {
    return (
      <Box sx={{
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)'
      }}>
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {mapError}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', height: height, borderRadius: '12px', overflow: 'hidden' }}>
      {!mapLoaded && (
        <Box sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-surface)',
          zIndex: 1
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={40} sx={{ color: 'var(--color-primary)', mb: 2 }} />
            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
              Loading map...
            </Typography>
          </Box>
        </Box>
      )}
      
      <div
        ref={mapRef}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          border: '1px solid var(--color-border)'
        }}
      />
    </Box>
  );
};

export default PropertyMap;

