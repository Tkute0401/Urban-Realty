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
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Debug logging
  console.log('🔧 PropertyMap Debug Info:', {
    latitude,
    longitude,
    address,
    height,
    zoom,
    showMarker,
    className,
    apiKey: process.env.NEXT_PUBLIC_MAPPLS_API_KEY ? 'Found' : 'Missing',
    apiKeyLength: process.env.NEXT_PUBLIC_MAPPLS_API_KEY?.length || 0,
    apiKeyPreview: process.env.NEXT_PUBLIC_MAPPLS_API_KEY ? `${process.env.NEXT_PUBLIC_MAPPLS_API_KEY.substring(0, 10)}...` : 'N/A',
    nodeEnv: process.env.NODE_ENV,
    isClient: typeof window !== 'undefined',
    allEnvVars: Object.keys(process.env).filter(key => key.includes('MAPPLS')),
    rawApiKey: process.env.NEXT_PUBLIC_MAPPLS_API_KEY
  });

  useEffect(() => {
    const loadMapScript = () => {
      console.log('🔧 Starting Mappls script loading...');
      
      // Check if already loaded
      if (window.mappls) {
        console.log('🔧 Mappls already loaded');
        setScriptLoaded(true);
        setDebugInfo(prev => ({ ...prev, scriptStatus: 'Already loaded' }));
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src*="mappls"]');
      if (existingScript) {
        console.log('🔧 Existing Mappls script found, waiting for load...');
        existingScript.addEventListener('load', () => {
          console.log('🔧 Existing script loaded');
          setScriptLoaded(true);
          setDebugInfo(prev => ({ ...prev, scriptStatus: 'Existing script loaded' }));
        });
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY;
      if (!apiKey) {
        console.error('🔧 No Mappls API key found');
        setMapError('Mappls API key not found. Please check your environment variables.');
        setDebugInfo(prev => ({ ...prev, scriptStatus: 'No API key' }));
        return;
      }

      console.log('🔧 Creating new Mappls script...');
      
      // Load Mappls script
      const script = document.createElement('script');
      script.src = `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk?layer=vector&v=3.0&callback=initMapplsMap`;
      script.async = true;
      script.defer = true;
      
      // Create global callback
      (window as any).initMapplsMap = () => {
        console.log('🔧 Mappls SDK loaded successfully via callback');
        setScriptLoaded(true);
        setDebugInfo(prev => ({ ...prev, scriptStatus: 'Loaded via callback' }));
      };
      
      script.onload = () => {
        console.log('🔧 Mappls script loaded via onload');
        setScriptLoaded(true);
        setDebugInfo(prev => ({ ...prev, scriptStatus: 'Loaded via onload' }));
      };
      
      script.onerror = (error) => {
        console.error('🔧 Failed to load Mappls script:', error);
        setMapError('Failed to load Mappls Maps. Please check your API key.');
        setDebugInfo(prev => ({ ...prev, scriptStatus: 'Load failed', error }));
      };
      
      console.log('🔧 Appending script to head:', script.src);
      document.head.appendChild(script);
      setDebugInfo(prev => ({ ...prev, scriptStatus: 'Script appended' }));
    };

    loadMapScript();
  }, []);

  useEffect(() => {
    console.log('🔧 Map initialization effect triggered:', {
      scriptLoaded,
      mapRefExists: !!mapRef.current,
      latitude,
      longitude,
      address,
      zoom,
      showMarker
    });

    if (!scriptLoaded || !mapRef.current || !latitude || !longitude) {
      console.log('🔧 Skipping map initialization - missing requirements');
      return;
    }
    
    // Clean up existing map
    if (mapInstanceRef.current) {
      try {
        console.log('🔧 Cleaning up existing map');
        mapInstanceRef.current.remove();
      } catch (e) {
        console.warn('🔧 Error removing map:', e);
      }
    }

    const initializeMap = () => {
      try {
        console.log('🔧 Starting map initialization...');
        
        if (!window.mappls) {
          console.error('🔧 Mappls SDK not available on window');
          setMapError('Mappls SDK not loaded');
          setDebugInfo(prev => ({ ...prev, mapInitStatus: 'SDK not available' }));
          return;
        }

        console.log('🔧 Mappls SDK available, creating map...');

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

        console.log('🔧 Map options:', mapOptions);

        mapInstanceRef.current = new window.mappls.Map(mapRef.current, mapOptions);
        console.log('🔧 Map instance created:', mapInstanceRef.current);

        // Add marker if enabled
        if (showMarker) {
          console.log('🔧 Adding marker...');
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

          console.log('🔧 Marker created:', marker);

          // Add popup with address if provided
          if (address) {
            console.log('🔧 Adding info window...');
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
              console.log('🔧 Marker clicked, opening info window');
              infoWindow.open(mapInstanceRef.current);
            });
          }
        }

        console.log('🔧 Map initialization completed successfully');
        setMapLoaded(true);
        setMapError(null);
        setDebugInfo(prev => ({ ...prev, mapInitStatus: 'Success' }));
      } catch (error) {
        console.error('🔧 Error initializing map:', error);
        setMapError(`Failed to initialize map: ${error.message}`);
        setDebugInfo(prev => ({ ...prev, mapInitStatus: 'Failed', error: error.message }));
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeMap, 100);
    
    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          console.log('🔧 Cleaning up map on unmount');
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('🔧 Error cleaning up map:', e);
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
        
        {/* Debug Panel */}
        <Box sx={{
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '8px',
          p: 2,
          maxWidth: 400,
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
            Debug Info:
          </Typography>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </Box>
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
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <CircularProgress size={40} sx={{ color: 'var(--color-primary)', mb: 2 }} />
            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
              Loading map...
            </Typography>
          </Box>
          
          {/* Debug Panel */}
          <Box sx={{
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '8px',
            p: 2,
            maxWidth: 400,
            fontSize: '12px',
            fontFamily: 'monospace',
            maxHeight: 200,
            overflow: 'auto'
          }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
              Debug Info:
            </Typography>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify({
                scriptLoaded,
                mapLoaded,
                latitude,
                longitude,
                address,
                zoom,
                showMarker,
                ...debugInfo
              }, null, 2)}
            </pre>
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

