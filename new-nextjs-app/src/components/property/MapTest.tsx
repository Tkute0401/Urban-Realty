'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { MAPPLS_CONFIG } from '../../config/maps';

const MapTest: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [containerId] = useState(() => `map-test-container-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (typeof window === 'undefined' || mapInitialized) return;

    const loadMapplsScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.mappls) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = MAPPLS_CONFIG.getScriptUrl();
        script.async = true;
        script.defer = true;
        
        script.onload = () => resolve();
        script.onerror = (error) => {
          console.error('Failed to load Mappls script with primary URL:', error);
          console.log('Trying alternative script URL...');
          
          // Try alternative URL
          const altScript = document.createElement('script');
          altScript.src = MAPPLS_CONFIG.getAlternativeScriptUrl();
          altScript.async = true;
          altScript.defer = true;
          
          altScript.onload = () => {
            console.log('Mappls script loaded successfully with alternative URL');
            resolve();
          };
          
          altScript.onerror = (altError) => {
            console.error('Failed to load Mappls script with alternative URL:', altError);
            reject(new Error('Script load failed'));
          };
          
          document.head.appendChild(altScript);
        };
        
        document.head.appendChild(script);
      });
    };

    const initializeMap = async () => {
      try {
        await loadMapplsScript();
        
        const container = document.getElementById(containerId) || mapRef.current;
        if (!container) {
          setMapError('Map container not found');
          return;
        }
        if (!container.offsetParent || container.offsetWidth === 0 || container.offsetHeight === 0) {
          setMapError('Map container not ready');
          return;
        }

        // Create map
        mapInstanceRef.current = new window.mappls.Map(container, {
          center: [77.2090, 28.6139], // Delhi
          zoom: 10,
          zoomControl: true,
          fullscreenControl: true,
          scrollWheel: true,
        });

        // Add test marker
        const marker = new window.mappls.Marker({
          map: mapInstanceRef.current,
          position: { lat: 28.6139, lng: 77.2090 },
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="12" fill="#FF4081" stroke="#0B1011" stroke-width="3"/>
                <text x="15" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">TEST</text>
              </svg>
            `)}`,
            scaledSize: { width: 30, height: 30 }
          }
        });

        setMapLoaded(true);
        setMapInitialized(true);
        console.log('MapTest: Map and marker created successfully');
      } catch (err) {
        console.error('MapTest: Error creating map:', err);
        setMapError('Failed to load map');
      }
    };

    const timer = setTimeout(initializeMap, 1000);
    return () => clearTimeout(timer);
  }, [mapInitialized]);

  if (mapError) {
    return (
      <Box sx={{
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        p: 2
      }}>
        <Typography variant="body2" color="error">
          Map Test Error: {mapError}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
      {!mapLoaded && (
        <Box sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-surface)',
          zIndex: 1,
          p: 2
        }}>
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
            Loading test map...
          </Typography>
        </Box>
      )}
      
      <div
        ref={mapRef}
        id={containerId}
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

export default MapTest;