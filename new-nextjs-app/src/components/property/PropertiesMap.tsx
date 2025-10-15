'use client';

import React, { useEffect, useRef, useState } from 'react';
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

interface PropertiesMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onMarkerClick?: (property: Property) => void;
  height?: string | number;
}

const PropertiesMap: React.FC<PropertiesMapProps> = ({
  properties,
  selectedProperty,
  onMarkerClick,
  height = '500px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Mappls script
  useEffect(() => {
    if (typeof window === 'undefined' || scriptLoaded) return;

    const loadMapplsScript = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if script already exists
        if (window.mappls) {
          setScriptLoaded(true);
          resolve();
          return;
        }

        // Check if script already exists in DOM
        const existingScript = document.querySelector('script[src*="mappls"]');
        if (existingScript) {
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

        const script = document.createElement('script');
        script.src = MAPPLS_CONFIG.getScriptUrl();
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          setScriptLoaded(true);
          resolve();
        };
        
        script.onerror = () => {
          setMapError('Failed to load Mappls Maps. Please check your API key.');
          reject(new Error('Script load failed'));
        };
        
        document.head.appendChild(script);
      });
    };

    loadMapplsScript().catch(console.error);
  }, [scriptLoaded]);

  // Initialize map and markers
  useEffect(() => {
    if (!scriptLoaded || !properties || properties.length === 0) {
      return;
    }

    // Ensure mapRef.current exists
    if (!mapRef.current) {
      console.warn('Map ref not available');
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

        // Verify the container element is valid and visible
        const container = mapRef.current;
        if (!container || !container.offsetParent) {
          console.warn('Map container not ready, retrying...');
          setTimeout(initializeMap, 200);
          return;
        }

        // Filter properties with valid coordinates
        const validProperties = properties.filter(property => 
          property.location?.coordinates?.length === 2
        );

        if (validProperties.length === 0) {
          setMapError('No properties with valid coordinates');
          return;
        }

        // Calculate center and zoom
        const firstProperty = validProperties[0];
        const [lng, lat] = firstProperty.location!.coordinates;

        // Initialize map
        mapInstanceRef.current = new window.mappls.Map(container, {
          center: [lng, lat],
          zoom: validProperties.length > 1 ? 10 : 12,
          zoomControl: true,
          fullscreenControl: true,
          scrollWheel: true,
        });

        // Calculate bounds for multiple properties
        if (validProperties.length > 1) {
          const coordinates = validProperties.map(property => ({
            lat: property.location!.coordinates[1],
            lng: property.location!.coordinates[0]
          }));

          // Fit bounds to show all properties
          mapInstanceRef.current.fitBounds(coordinates);
        }

        // Add markers for each property
        const newMarkers = validProperties.map((property, index) => {
          const position = {
            lat: property.location!.coordinates[1],
            lng: property.location!.coordinates[0]
          };

          const isSelected = selectedProperty?._id === property._id;

          const marker = new window.mappls.Marker({
            map: mapInstanceRef.current,
            position: position,
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

          return marker;
        });

        markersRef.current = newMarkers;
        setMapLoaded(true);
        setMapError(null);

      } catch (err: any) {
        console.error('Error creating Mappls map:', err);
        setMapError('Failed to load map');
      }
    };

    // Delay to ensure DOM is fully ready
    const timer = setTimeout(initializeMap, 300);
    
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
  }, [scriptLoaded, properties, selectedProperty, onMarkerClick]);

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
        id={`properties-map-container-${Math.random().toString(36).substr(2, 9)}`}
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
