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
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('Fetching properties from API...');
        const response = await fetch('/api/v1/properties?limit=50');
        const data = await response.json();
        
        console.log('Properties fetched:', data);
        console.log('Properties with location data:', data.data?.filter((p: any) => p.location?.coordinates?.length === 2));
        
        setProperties(data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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

  // Initialize map when script is loaded and properties are fetched
  useEffect(() => {
    if (!scriptLoaded || !mapRef.current || loading) return;

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

        // Filter properties with valid coordinates
        const validProperties = properties.filter(p => p.location?.coordinates?.length === 2);
        console.log('Valid properties for map:', validProperties);

        // Set map center based on properties
        let mapCenter = [77.2090, 28.6139]; // Default to Delhi
        let mapZoom = 12;

        if (validProperties.length > 0) {
          // Use first property's coordinates as center
          const firstProperty = validProperties[0];
          mapCenter = [firstProperty.location.coordinates[0], firstProperty.location.coordinates[1]];
          mapZoom = validProperties.length > 1 ? 10 : 12;
          console.log('Map center set to property location:', mapCenter);
        } else {
          console.log('No valid properties found, using default Delhi coordinates');
        }
        
        // Initialize map with calculated coordinates
        mapInstanceRef.current = new window.mappls.Map(container, {
          center: mapCenter,
          zoom: mapZoom,
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
          const testMarker2 = new window.mappls.Marker({
            position: { lat: 28.6139, lng: 77.2090 }
          });
          testMarker2.setMap(mapInstanceRef.current);
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

        // Create markers for real properties
        console.log('Creating markers for properties...', validProperties);

        validProperties.forEach((property, index) => {
          try {
            console.log(`Creating marker ${index + 1} for property:`, property.title);
            
            const position = {
              lat: property.location.coordinates[1],
              lng: property.location.coordinates[0]
            };
            
            // Try with default marker first
            const marker = new window.mappls.Marker({
              map: mapInstanceRef.current,
              position: position
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
              console.log(`Marker ${index + 1} clicked: ${property.title}`);
              alert(`Clicked: ${property.title} - ${property.address?.city || 'Unknown City'}`);
            });

            console.log(`Property marker ${index + 1} created and configured successfully`);
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
  }, [scriptLoaded, properties, loading]);

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
        <Typography variant="body2" sx={{ mb: 1 }}>
          Properties Loaded: {loading ? '⏳ Loading...' : `✅ ${properties.length} properties`}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Properties with Coordinates: {properties.filter(p => p.location?.coordinates?.length === 2).length}
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
        Click on the property markers to see property details
      </Typography>
    </Box>
  );
};

export default MapTest;
