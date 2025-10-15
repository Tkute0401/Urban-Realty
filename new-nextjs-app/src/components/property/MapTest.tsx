'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { MAPPLS_CONFIG } from '../../config/maps';

const MapTest: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Mappls script
  useEffect(() => {
    if (typeof window === 'undefined' || scriptLoaded) return;

    const loadMapplsScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.mappls) {
          setScriptLoaded(true);
          resolve();
          return;
        }

        const existingScript = document.querySelector('script[src*="mappls"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => {
            setScriptLoaded(true);
            resolve();
          });
          return;
        }

        if (!MAPPLS_CONFIG.apiKey) {
          reject(new Error('Mappls API key not found'));
          return;
        }

        const script = document.createElement('script');
        script.src = MAPPLS_CONFIG.getScriptUrl();
        script.async = true;
        script.defer = true;

        script.onload = () => {
          setScriptLoaded(true);
          resolve();
        };

        script.onerror = () => {
          reject(new Error('Failed to load Mappls script'));
        };

        document.head.appendChild(script);
      });
    };

    loadMapplsScript()
      .then(() => {
        console.log('Mappls script loaded successfully');
      })
      .catch((error) => {
        console.error('Failed to load Mappls script:', error);
        setMapError(error.message);
      });
  }, [scriptLoaded]);

  // Initialize map when script is loaded
  useEffect(() => {
    if (!scriptLoaded || !mapRef.current) return;

    const initializeMap = () => {
      try {
        if (!window.mappls) {
          setMapError('Mappls SDK not loaded');
          return;
        }

        console.log('Initializing test map...');
        
        // Initialize map with Delhi coordinates
        mapInstanceRef.current = new window.mappls.Map(mapRef.current, {
          center: [77.2090, 28.6139], // Delhi coordinates
          zoom: 12,
          zoomControl: true,
          fullscreenControl: true,
          scrollWheel: true,
        });

        console.log('Map initialized successfully');

        // Add test markers
        const testMarkers = [
          { lat: 28.6139, lng: 77.2090, title: 'Delhi Center' },
          { lat: 28.5355, lng: 77.3910, title: 'Gurgaon' },
          { lat: 28.7041, lng: 77.1025, title: 'Noida' }
        ];

        testMarkers.forEach((markerData, index) => {
          try {
            const marker = new window.mappls.Marker({
              map: mapInstanceRef.current,
              position: { lat: markerData.lat, lng: markerData.lng },
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15" cy="15" r="12" fill="#78CADC" stroke="#0B1011" stroke-width="3"/>
                    <text x="15" y="20" text-anchor="middle" fill="#0B1011" font-size="12" font-weight="bold">${index + 1}</text>
                  </svg>
                `)}`,
                scaledSize: { width: 30, height: 30 }
              }
            });

            marker.addListener('click', () => {
              console.log(`Marker ${index + 1} clicked: ${markerData.title}`);
              alert(`Clicked: ${markerData.title}`);
            });

            console.log(`Test marker ${index + 1} created successfully`);
          } catch (error) {
            console.error(`Failed to create marker ${index + 1}:`, error);
          }
        });

        setMapLoaded(true);
        setMapError(null);
      } catch (error: any) {
        console.error('Error initializing map:', error);
        setMapError(`Map initialization failed: ${error.message}`);
      }
    };

    // Wait a bit for the container to be ready
    setTimeout(initializeMap, 500);
  }, [scriptLoaded]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, color: 'var(--color-primary)' }}>
        Map Test Component
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Script Loaded: {scriptLoaded ? '✅ Yes' : '❌ No'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Map Loaded: {mapLoaded ? '✅ Yes' : '❌ No'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          API Key: {MAPPLS_CONFIG.apiKey ? '✅ Found' : '❌ Missing'}
        </Typography>
        {mapError && (
          <Typography variant="body2" sx={{ color: 'error.main' }}>
            Error: {mapError}
          </Typography>
        )}
      </Box>

      <Box
        ref={mapRef}
        sx={{
          width: '100%',
          height: '400px',
          border: '2px solid var(--color-primary)',
          borderRadius: '8px',
          backgroundColor: 'var(--color-bg)'
        }}
      />
      
      <Typography variant="body2" sx={{ mt: 1, color: 'var(--color-text-muted)' }}>
        Click on the numbered markers to test functionality
      </Typography>
    </Box>
  );
};

export default MapTest;
