'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useThemeContext } from '@/contexts/ThemeContext';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  address?: string;
  height?: string | number;
  zoom?: number;
  showMarker?: boolean;
  className?: string;
}

// Declare Mappls types
declare global {
  interface Window {
    MapmyIndia: any;
    L: any;
  }
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
  const { theme } = useThemeContext();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const loadMap = async () => {
      if (!mapRef.current || !latitude || !longitude) return;

      try {
        // Check if Mappls is already loaded
        if (typeof window.MapmyIndia === 'undefined') {
          // Load Mappls API if not already loaded
          const script = document.createElement('script');
          script.src = `https://apis.mapmyindia.com/advancedmaps/v1/${process.env.NEXT_PUBLIC_MAPMYINDIA_API_KEY}/map_load?v=1.3`;
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            initializeMap();
          };
          
          script.onerror = () => {
            setMapError('Failed to load MapmyIndia Maps');
          };
          
          document.head.appendChild(script);
        } else {
          initializeMap();
        }
      } catch (error) {
        console.error('Error loading map:', error);
        setMapError('Failed to load map');
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.MapmyIndia) return;

      try {
        // Initialize Mappls map
        const map = new window.MapmyIndia.Map(mapRef.current, {
          center: [longitude, latitude], // Mappls uses [lng, lat] format
          zoom: zoom,
          mapType: isDark ? 'dark' : 'standard', // Use dark theme if available
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'greedy'
        });

        if (showMarker) {
          // Create marker
          const marker = new window.MapmyIndia.Marker({
            position: [longitude, latitude],
            map: map,
            title: address || 'Property Location'
          });

          // Add popup if address is provided
          if (address) {
            const popup = new window.MapmyIndia.Popup({
              content: `
                <div style="padding: 10px; max-width: 200px;">
                  <h3 style="margin: 0 0 5px 0; color: #333; font-size: 14px;">Property Location</h3>
                  <p style="margin: 0; color: #666; font-size: 12px;">${address}</p>
                </div>
              `,
              closeButton: true,
              closeOnClick: false
            });

            marker.bindPopup(popup);
          }
        }

        setMapLoaded(true);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to initialize map');
      }
    };

    loadMap();
  }, [latitude, longitude, address, zoom, isDark, showMarker]);

  if (mapError) {
    return (
      <Box sx={{
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark ? 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderRadius: '12px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
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
          background: isDark ? 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          zIndex: 1
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={40} sx={{ color: '#78CADC', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
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
          border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
        }}
      />
    </Box>
  );
};

export default PropertyMap;
