'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { MAPPLS_CONFIG } from '../../config/maps';

interface Property {
  _id: string;
  title: string;
  price: number;
  location?: {
    coordinates: [number, number];
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface PropertiesMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  userLocation?: UserLocation | null;
  onMarkerClick?: (property: Property) => void;
  height?: string | number;
}

const PropertiesMap: React.FC<PropertiesMapProps> = ({
  properties,
  selectedProperty,
  userLocation,
  onMarkerClick,
  height = '500px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [containerId] = useState(() => `properties-map-container-${Math.random().toString(36).substr(2, 9)}`);

  console.log('🚀 PropertiesMap component rendering with:', {
    propertiesCount: properties?.length,
    userLocation,
    selectedProperty: selectedProperty?._id,
    containerId
  });

  // Debug: Log when component mounts
  useEffect(() => {
    console.log('🔍 PropertiesMap component mounted, containerId:', containerId);
  }, [containerId]);

  // Load Mappls script
  useEffect(() => {
    if (typeof window === 'undefined' || scriptLoaded) return;

    const loadMapplsScript = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if script already exists
        if (window.mappls) {
          console.log('Mappls SDK already loaded');
          setScriptLoaded(true);
          resolve();
          return;
        }

        // Check if script already exists in DOM
        const existingScript = document.querySelector('script[src*="mappls"]');
        if (existingScript) {
          console.log('Mappls script already in DOM, waiting for load');
          existingScript.addEventListener('load', () => {
            setScriptLoaded(true);
            resolve();
          });
          return;
        }

        // Use centralized API key configuration
        if (!MAPPLS_CONFIG.apiKey) {
          setMapError('Mappls API key not found. Please check your environment variables.');
          reject(new Error('API key not found'));
          return;
        }

        console.log('Loading Mappls script with API key:', MAPPLS_CONFIG.apiKey);
        console.log('Script URL:', MAPPLS_CONFIG.getScriptUrl());

        const script = document.createElement('script');
        script.src = MAPPLS_CONFIG.getScriptUrl();
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log('Mappls script loaded successfully');
          setScriptLoaded(true);
          resolve();
        };
        
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
            setScriptLoaded(true);
            resolve();
          };
          
          altScript.onerror = (altError) => {
            console.error('Failed to load Mappls script with alternative URL:', altError);
            setMapError('Failed to load Mappls Maps. Please check your API key.');
            reject(new Error('Script load failed'));
          };
          
          document.head.appendChild(altScript);
        };
        
        document.head.appendChild(script);
      });
    };

    loadMapplsScript().catch(console.error);
  }, [scriptLoaded]);

  // Function to add markers to the map
  const addMarkersToMap = useCallback(() => {
    if (!mapInstanceRef.current) {
      console.warn('Map instance not available for marker creation');
      return;
    }

    // Clean up existing markers
    markersRef.current.forEach(marker => {
      try {
        if (marker && marker.remove) {
          marker.remove();
        }
      } catch (e) {
        console.warn('Error removing marker:', e);
      }
    });
    markersRef.current = [];

    // Filter properties with valid coordinates
    const validProperties = properties.filter(property => 
      property.location?.coordinates?.length === 2
    );

    console.log('PropertiesMap Debug:', {
      totalProperties: properties.length,
      validProperties: validProperties.length,
      properties: properties.map(p => ({
        id: p._id,
        title: p.title,
        hasLocation: !!p.location,
        coordinates: p.location?.coordinates
      }))
    });

    if (validProperties.length === 0) {
      console.log('No valid properties found, creating test marker');
      // Create a test marker to verify map is working
      try {
        const testMarker = new window.mappls.Marker({
          map: mapInstanceRef.current,
          position: [77.2090, 28.6139], // Delhi coordinates
          title: 'Test Marker'
        });
        markersRef.current = [testMarker];
        console.log('Test marker created successfully');
      } catch (error) {
        console.error('Failed to create test marker:', error);
      }
      setMapLoaded(true);
      setMapError(null);
      return;
    }

    // Calculate bounds for multiple properties (only if no user location)
    if (validProperties.length > 1 && !userLocation) {
      const coordinates = validProperties.map(property => ({
        lat: property.location!.coordinates[1],
        lng: property.location!.coordinates[0]
      }));

      console.log('Fitting bounds to show all properties:', coordinates);
      // Mappls fitBounds expects an array of [lng, lat] coordinates
      const mapplsCoordinates = coordinates.map(coord => [coord.lng, coord.lat]);
      try {
        mapInstanceRef.current.fitBounds(mapplsCoordinates);
        console.log('Map bounds fitted successfully');
      } catch (error) {
        console.warn('Failed to fit bounds, centering on first property:', error);
        const firstProperty = validProperties[0];
        mapInstanceRef.current.setCenter([firstProperty.location!.coordinates[0], firstProperty.location!.coordinates[1]]);
        mapInstanceRef.current.setZoom(12);
      }
    } else if (validProperties.length === 1 && !userLocation) {
      // For single property, ensure it's visible
      const property = validProperties[0];
      const position = {
        lat: property.location!.coordinates[1],
        lng: property.location!.coordinates[0]
      };
      console.log('Centering map on single property:', position);
      try {
        mapInstanceRef.current.setCenter([position.lng, position.lat]); // Already in [lng, lat] format
        mapInstanceRef.current.setZoom(15);
        console.log('Map centered on single property successfully');
      } catch (error) {
        console.warn('Failed to center map on single property:', error);
      }
    }

    // Add markers for each property
    console.log('Creating markers for', validProperties.length, 'properties');
    const newMarkers = [];
    
    for (let i = 0; i < validProperties.length; i++) {
      const property = validProperties[i];
      const position = {
        lat: property.location!.coordinates[1],
        lng: property.location!.coordinates[0]
      };

      const isSelected = selectedProperty?._id === property._id;

      console.log(`Creating marker for property ${property.title}:`, {
        position,
        isSelected,
        propertyId: property._id
      });

      // Create marker using proper Mappls SDK format
      let marker;
      try {
        // Mappls markers use [lng, lat] format for position
        marker = new window.mappls.Marker({
          map: mapInstanceRef.current,
          position: [position.lng, position.lat], // Mappls expects [lng, lat]
          title: property.title
        });
        
        // Try to add custom icon after marker creation
        try {
          marker.setIcon({
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="8" fill="${isSelected ? '#FF4081' : '#78CADC'}" stroke="#0B1011" stroke-width="2"/>
              </svg>
            `)}`,
            scaledSize: { width: 20, height: 20 }
          });
          console.log('Custom icon marker created successfully for:', property.title);
        } catch (iconError) {
          console.warn('Failed to set custom icon, using default marker:', iconError);
        }
      } catch (error) {
        console.error('Failed to create marker for property:', property.title, error);
        continue; // Skip this marker and continue with others
      }

      // Add click listener
      try {
        marker.addListener('click', () => {
          console.log('Marker clicked:', property.title);
          if (onMarkerClick) {
            onMarkerClick(property);
          }
        });
      } catch (listenerError) {
        console.warn('Failed to add click listener to marker:', listenerError);
      }

      newMarkers.push(marker);
    }

    // Add user location marker if available
    if (userLocation) {
      try {
        const userMarker = new window.mappls.Marker({
          map: mapInstanceRef.current,
          position: [userLocation.longitude, userLocation.latitude], // Mappls expects [lng, lat]
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#4CAF50" stroke="#2E7D32" stroke-width="2"/>
                <circle cx="12" cy="12" r="4" fill="#FFFFFF"/>
              </svg>
            `)}`,
            scaledSize: { width: 24, height: 24 }
          }
        });
        console.log('User location marker created successfully');
      } catch (error) {
        console.warn('Failed to create user location marker:', error);
      }
    }

    markersRef.current = newMarkers;
    setMapLoaded(true);
    setMapError(null);
  }, [properties, selectedProperty, userLocation, onMarkerClick]);

  // Initialize map and markers
  useEffect(() => {
    console.log('🔍 PropertiesMap useEffect triggered:', {
      scriptLoaded,
      mapInitialized,
      propertiesLength: properties?.length,
      userLocation,
      properties: properties?.map(p => ({ 
        id: p._id, 
        title: p.title, 
        hasLocation: !!p.location?.coordinates,
        coordinates: p.location?.coordinates
      }))
    });
    
    if (!scriptLoaded || !properties || properties.length === 0 || mapInitialized) {
      console.log('Skipping map initialization:', { 
        scriptLoaded, 
        propertiesLength: properties?.length, 
        mapInitialized 
      });
      return;
    }

    // Check if Mappls SDK is available
    if (!window.mappls || !window.mappls.Map) {
      console.warn('Mappls SDK not available, retrying in 1 second');
      console.log('window.mappls:', window.mappls);
      console.log('window.mappls.Map:', window.mappls?.Map);
      setTimeout(() => {
        if (window.mappls && window.mappls.Map) {
          console.log('Mappls SDK now available, retrying map initialization');
          // Trigger re-initialization by updating a state or calling the effect again
        }
      }, 1000);
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

        console.log('Initializing map with properties:', properties.length);

        // Get the container element by ID instead of ref
        const container = document.getElementById(containerId) || mapRef.current;
        
        if (!container) {
          console.warn('Map container not found, retrying...');
          setTimeout(initializeMap, 500);
          return;
        }

        // Verify the container element is valid and visible
        if (!container.offsetParent || container.offsetWidth === 0 || container.offsetHeight === 0) {
          console.warn('Map container not ready, retrying...', {
            container: !!container,
            offsetParent: !!container?.offsetParent,
            width: container?.offsetWidth,
            height: container?.offsetHeight
          });
          setTimeout(initializeMap, 500);
          return;
        }

        console.log('Container ready:', {
          width: container.offsetWidth,
          height: container.offsetHeight,
          visible: container.offsetParent !== null,
          containerId
        });

        // Filter properties with valid coordinates
        const validProperties = properties.filter(property => 
          property.location?.coordinates?.length === 2
        );

        if (validProperties.length === 0) {
          console.log('No valid properties found, creating test marker');
          // Create a test marker with default coordinates (Delhi)
          const testMarker = new window.mappls.Marker({
            map: mapInstanceRef.current,
            position: { lat: 28.6139, lng: 77.2090 }
          });
          markersRef.current = [testMarker];
          setMapLoaded(true);
          setMapError(null);
          return;
        }

        // Calculate center and zoom
        let mapCenter: [number, number];
        let mapZoom: number;

        if (userLocation) {
          // Center on user location
          mapCenter = [userLocation.longitude, userLocation.latitude];
          mapZoom = 12;
          console.log('Initializing map centered on user location:', mapCenter);
        } else if (validProperties.length > 0) {
          // Center on first property
          const firstProperty = validProperties[0];
          mapCenter = firstProperty.location!.coordinates;
          mapZoom = validProperties.length > 1 ? 10 : 12;
          console.log('Initializing map centered on first property:', mapCenter, 'from property:', firstProperty.title);
        } else {
          // Default to Delhi
          mapCenter = [77.2090, 28.6139];
          mapZoom = 10;
          console.log('Initializing map with default center (Delhi):', mapCenter);
        }

        console.log('Final map center and zoom:', { mapCenter, mapZoom });

        // Add a delay to ensure Mappls SDK is fully ready
        setTimeout(() => {
          try {
            console.log('Creating Mappls map with:', { mapCenter, mapZoom, container });
            
            // Initialize map with proper Mappls SDK configuration
            mapInstanceRef.current = new window.mappls.Map(container, {
              center: mapCenter, // mapCenter is already in [lng, lat] format
              zoom: mapZoom,
              zoomControl: true,
              fullscreenControl: true,
              scrollWheel: true
            });

            console.log('Map initialized successfully with center:', mapCenter, 'zoom:', mapZoom);
            setMapInitialized(true);

            // Wait for map to be ready before adding markers
            mapInstanceRef.current.addListener('idle', () => {
              console.log('Map is idle, ready to add markers');
              addMarkersToMap();
            });

            // Also add markers after a short delay as fallback
            setTimeout(() => {
              console.log('Adding markers as fallback');
              addMarkersToMap();
            }, 1000);

          } catch (mapError) {
            console.error('Error creating Mappls map:', mapError);
            setMapError('Failed to create map: ' + mapError.message);
          }
        }, 1000);

      } catch (err: any) {
        console.error('Error creating Mappls map:', err);
        setMapError('Failed to load map');
      }
    };

    // Wait for the container to be ready with retry mechanism
    let retryCount = 0;
    const maxRetries = 20;
    
    const tryInitialize = () => {
      const container = document.getElementById(containerId) || mapRef.current;
      if (!container || !container.offsetParent || container.offsetWidth === 0 || container.offsetHeight === 0) {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Map container not ready, retry ${retryCount}/${maxRetries}...`, {
            container: !!container,
            offsetParent: !!container?.offsetParent,
            width: container?.offsetWidth,
            height: container?.offsetHeight,
            containerId
          });
          setTimeout(tryInitialize, 300);
        } else {
          setMapError('Map container failed to initialize after multiple retries');
        }
        return;
      }
      console.log('Container is ready, initializing map...');
      initializeMap();
    };
    
    const timer = setTimeout(tryInitialize, 500);
    
    return () => {
      clearTimeout(timer);
      // Cleanup markers
      markersRef.current.forEach(marker => {
        try {
          if (marker && marker.remove) {
            marker.remove();
          }
        } catch (e) {
          console.warn('Error removing marker:', e);
        }
      });
    };
  }, [scriptLoaded, properties, selectedProperty, userLocation, addMarkersToMap, mapInitialized]);

  // Update markers when properties change (only if map is already initialized)
  useEffect(() => {
    if (mapInitialized && mapInstanceRef.current && properties && properties.length > 0) {
      console.log('Updating markers for existing map');
      addMarkersToMap();
    }
  }, [properties, selectedProperty, userLocation, addMarkersToMap, mapInitialized]);

  if (!properties || properties.length === 0) {
    return (
      <Box sx={{
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        p: 2
      }}>
        <Typography variant="body2" color="text.secondary">
          No properties to display on map.
        </Typography>
      </Box>
    );
  }

  if (!MAPPLS_CONFIG.apiKey) {
    return (
      <Box sx={{
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        p: 2
      }}>
        <Typography variant="body2" color="text.secondary">
          Map unavailable. Missing Mappls API key.
        </Typography>
      </Box>
    );
  }

  if (mapError) {
    return (
      <Box sx={{
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        p: 2
      }}>
        <Typography variant="body2" color="error">
          Map unavailable. {mapError}
        </Typography>
      </Box>
    );
  }

  console.log('🔍 PropertiesMap render - mapLoaded:', mapLoaded, 'mapError:', mapError, 'scriptLoaded:', scriptLoaded);

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
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
            Loading map...
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
          border: '1px solid var(--color-border)',
          minHeight: typeof height === 'string' ? height : `${height}px`,
          position: 'relative'
        }}
      />
    </Box>
  );
};

export default PropertiesMap;
