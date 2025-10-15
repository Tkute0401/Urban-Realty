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

        // Check if container is properly mounted and visible
        const container = mapRef.current;
        if (!container || !container.offsetParent || container.offsetWidth === 0 || container.offsetHeight === 0) {
          console.warn('Map container not ready, retrying in 500ms...');
          setTimeout(initializeMap, 500);
          return;
        }

        console.log('Initializing test map...');
        console.log('Container dimensions:', {
          width: container.offsetWidth,
          height: container.offsetHeight,
          visible: container.offsetParent !== null
        });
        
        // Initialize map with Delhi coordinates
        mapInstanceRef.current = new window.mappls.Map(container, {
          center: [77.2090, 28.6139], // Delhi coordinates
          zoom: 12,
          zoomControl: true,
          fullscreenControl: true,
          scrollWheel: true,
        });

        console.log('Map initialized successfully');
        console.log('Map instance:', mapInstanceRef.current);
        console.log('Map methods available:', Object.getOwnPropertyNames(Object.getPrototypeOf(mapInstanceRef.current)));
        
        // Check Mappls SDK version and available classes
        console.log('Mappls SDK info:');
        console.log('- window.mappls:', typeof window.mappls);
        console.log('- window.mappls.Marker:', typeof window.mappls.Marker);
        console.log('- window.mappls.Map:', typeof window.mappls.Map);
        console.log('- Available classes:', Object.keys(window.mappls));
        
        // Check if Marker class has expected methods
        if (window.mappls.Marker) {
          console.log('- Marker prototype methods:', Object.getOwnPropertyNames(window.mappls.Marker.prototype));
        }

        // Test basic marker creation
        console.log('Testing basic marker creation...');
        try {
          // Try different marker creation approaches
          console.log('Approach 1: Basic marker');
          const testMarker1 = new window.mappls.Marker({
            map: mapInstanceRef.current,
            position: { lat: 28.6139, lng: 77.2090 }
          });
          console.log('Basic test marker created:', testMarker1);

          // Try with different syntax
          console.log('Approach 2: Alternative syntax');
          const testMarker2 = new window.mappls.Marker();
          testMarker2.setMap(mapInstanceRef.current);
          testMarker2.setPosition({ lat: 28.6139, lng: 77.2090 });
          console.log('Alternative marker created:', testMarker2);

          // Check if markers are visible
          setTimeout(() => {
            console.log('Checking marker visibility after 2 seconds...');
            console.log('Map center:', mapInstanceRef.current.getCenter());
            console.log('Map zoom:', mapInstanceRef.current.getZoom());
          }, 2000);

        } catch (testError) {
          console.error('Basic marker creation failed:', testError);
        }

        // Add test markers
        const testMarkers = [
          { lat: 28.6139, lng: 77.2090, title: 'Delhi Center' },
          { lat: 28.5355, lng: 77.3910, title: 'Gurgaon' },
          { lat: 28.7041, lng: 77.1025, title: 'Noida' }
        ];

        console.log('Creating test markers...', testMarkers);

        testMarkers.forEach((markerData, index) => {
          try {
            console.log(`Creating marker ${index + 1}:`, markerData);
            
            // Try with default marker first
            const marker = new window.mappls.Marker({
              map: mapInstanceRef.current,
              position: { lat: markerData.lat, lng: markerData.lng }
            });

            console.log(`Default marker ${index + 1} created successfully`);

            // Try adding custom icon after marker creation
            try {
              marker.setIcon({
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15" cy="15" r="12" fill="#78CADC" stroke="#0B1011" stroke-width="3"/>
                    <text x="15" y="20" text-anchor="middle" fill="#0B1011" font-size="12" font-weight="bold">${index + 1}</text>
                  </svg>
                `)}`,
                scaledSize: { width: 30, height: 30 }
              });
              console.log(`Custom icon applied to marker ${index + 1}`);
            } catch (iconError) {
              console.warn(`Failed to set custom icon for marker ${index + 1}:`, iconError);
            }

            marker.addListener('click', () => {
              console.log(`Marker ${index + 1} clicked: ${markerData.title}`);
              alert(`Clicked: ${markerData.title}`);
            });

            console.log(`Test marker ${index + 1} created and configured successfully`);
          } catch (error) {
            console.error(`Failed to create marker ${index + 1}:`, error);
          }
        });

        console.log('All test markers creation completed');

        // Add a simple visual test - try to add a marker with a very obvious style
        setTimeout(() => {
          console.log('Adding highly visible test marker...');
          try {
            const visibleMarker = new window.mappls.Marker({
              map: mapInstanceRef.current,
              position: { lat: 28.6139, lng: 77.2090 },
              title: 'HIGHLY VISIBLE TEST MARKER'
            });
            
            // Try to make it very obvious
            if (visibleMarker.setIcon) {
              visibleMarker.setIcon({
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="25" cy="25" r="20" fill="red" stroke="yellow" stroke-width="5"/>
                    <text x="25" y="30" text-anchor="middle" fill="white" font-size="16" font-weight="bold">TEST</text>
                  </svg>
                `),
                scaledSize: { width: 50, height: 50 }
              });
            }
            
            console.log('Highly visible marker created:', visibleMarker);
          } catch (visibleError) {
            console.error('Failed to create visible marker:', visibleError);
          }
        }, 3000);

        setMapLoaded(true);
        setMapError(null);
      } catch (error: any) {
        console.error('Error initializing map:', error);
        setMapError(`Map initialization failed: ${error.message}`);
      }
    };

    // Wait for the container to be ready with retry mechanism
    let retryCount = 0;
    const maxRetries = 10;
    
    const tryInitialize = () => {
      const container = mapRef.current;
      if (!container || !container.offsetParent || container.offsetWidth === 0 || container.offsetHeight === 0) {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Map container not ready, retry ${retryCount}/${maxRetries}...`);
          setTimeout(tryInitialize, 200);
        } else {
          setMapError('Map container failed to initialize after multiple retries');
        }
        return;
      }
      initializeMap();
    };
    
    setTimeout(tryInitialize, 1000);
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
        id={`map-test-container-${Math.random().toString(36).substr(2, 9)}`}
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
