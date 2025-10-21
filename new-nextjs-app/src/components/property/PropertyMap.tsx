'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { MAPPLS_CONFIG } from '../../config/maps';

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
  console.log('PropertyMap component rendered with props:', { latitude, longitude, address, height, zoom, showMarker });
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
        existingScript.addEventListener('load', () => {
          setScriptLoaded(true);
        });
        return;
      }

      // Use centralized API key configuration
      if (!MAPPLS_CONFIG.apiKey) {
        setMapError('Mappls API key not found. Please check your environment variables.');
        return;
      }

      // Load Mappls script
      const script = document.createElement('script');
      script.src = MAPPLS_CONFIG.getScriptUrl();
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setScriptLoaded(true);
      };
      
      script.onerror = () => {
        setMapError('Failed to load Mappls Maps. Please check your API key.');
      };
      
      document.head.appendChild(script);
    };

    loadMapScript();
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !latitude || !longitude) {
      return;
    }
    
    // Ensure mapRef.current exists and has required properties
    if (!mapRef.current) {
      console.warn('Map ref not available');
      return;
    }
    
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

        // Validate coordinates
        console.log('PropertyMap - Received coordinates:', { 
          latitude, 
          longitude, 
          latitudeType: typeof latitude, 
          longitudeType: typeof longitude 
        });
        if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
          console.error('Invalid coordinates:', { latitude, longitude });
          setMapError('Invalid coordinates provided');
          return;
        }

        // Verify the container element is valid
        const container = mapRef.current;
        if (!container || !container.offsetParent) {
          console.warn('Map container not ready, retrying...');
          setTimeout(initializeMap, 200);
          return;
        }

        // Initialize map
        const mapOptions = {
          center: [longitude, latitude], // Mappls uses [lng, lat] format for map center
          zoom: zoom,
          zoomControl: true,
          fullscreenControl: true,
          scrollWheel: true,
          hybridMap: false,
          clickableIcons: true,
        };

        console.log('PropertyMap initializing with options:', {
          center: [longitude, latitude],
          zoom,
          address,
          latitude,
          longitude,
          markerPosition: [latitude, longitude]
        });

        // Add a delay to ensure Mappls SDK is fully ready
        setTimeout(() => {
          try {
            mapInstanceRef.current = new window.mappls.Map(container, mapOptions);
            console.log('PropertyMap: Map created successfully');

            // Add marker if enabled
            if (showMarker) {
              console.log('Creating marker with position:', [latitude, longitude]);
              
              // Ensure the map is ready before adding marker
              mapInstanceRef.current.addListener('idle', () => {
                try {
                  const marker = new window.mappls.Marker({
                    map: mapInstanceRef.current,
                    position: [latitude, longitude], // Mappls expects [lat, lng] array format
                    fitbounds: true, // This will center the map on the marker
                    icon: {
                      url: 'https://apis.mapmyindia.com/map_v3/1.png',
                      width: 35,
                      height: 50
                    }
                  });
                  console.log('Marker created successfully:', marker);

                  // Add popup with address if provided
                  if (address) {
                    const infoWindow = new window.mappls.InfoWindow({
                      content: `
                        <div style="padding: 10px; max-width: 200px;">
                          <h3 style="margin: 0 0 5px 0; color: var(--color-text-primary); font-size: 14px; font-weight: bold;">Property Location</h3>
                          <p style="margin: 0; color: var(--color-text-muted); font-size: 12px;">${address}</p>
                        </div>
                      `,
                      position: [latitude, longitude] // Use [lat, lng] array format
                    });

                    marker.addListener('click', () => {
                      infoWindow.open(mapInstanceRef.current);
                    });
                  }
                  
                  console.log('PropertyMap: Marker created successfully');
                } catch (markerError) {
                  console.error('Error creating marker:', markerError);
                  // Fallback: just center the map on the coordinates without marker
                  try {
                    mapInstanceRef.current.setCenter([longitude, latitude]);
                    mapInstanceRef.current.setZoom(zoom);
                    console.log('PropertyMap: Map centered as fallback');
                  } catch (centerError) {
                    console.error('Error centering map:', centerError);
                    setMapError(`Failed to create marker and center map: ${markerError?.message || 'Unknown error'}`);
                  }
                }
              });
            } else {
              // If no marker, ensure map is centered on coordinates
              mapInstanceRef.current.setCenter([longitude, latitude]);
              mapInstanceRef.current.setZoom(zoom);
              console.log('PropertyMap: Map centered without marker');
            }

            setMapLoaded(true);
            setMapError(null);
          } catch (mapError) {
            console.error('Error creating map:', mapError);
            setMapError(`Failed to create map: ${mapError?.message || 'Unknown error'}`);
          }
        }, 500);
      } catch (error: any) {
        console.error('Error initializing map:', error);
        setMapError(`Failed to initialize map: ${error?.message || 'Unknown error'}`);
      }
    };

    // Delay to ensure DOM is fully ready
    const timer = setTimeout(initializeMap, 300);
    
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        p: 2
      }}>
        <Alert severity="error" sx={{ maxWidth: 400, mb: 2 }}>
          {mapError}
        </Alert>
        
        <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>
          API Key: {process.env.NEXT_PUBLIC_MAPPLS_API_KEY ? 'Found' : 'Missing'}<br/>
          Coordinates: {latitude}, {longitude}<br/>
          Script Loaded: {scriptLoaded ? 'Yes' : 'No'}
        </Typography>
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-surface)',
          zIndex: 1,
          p: 2
        }}>
          <CircularProgress size={40} sx={{ color: 'var(--color-primary)', mb: 2 }} />
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
            Loading map...
          </Typography>
        </Box>
      )}
      
      <div
        ref={mapRef}
        id={`map-container-${Math.random().toString(36).substr(2, 9)}`}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          minHeight: typeof height === 'string' ? height : `${height}px`,
          position: 'relative'
        }}
      />
    </Box>
  );
};

export default PropertyMap;