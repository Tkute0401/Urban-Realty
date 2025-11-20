'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, CircularProgress } from '@mui/material';
import { Map, Layers } from '@mui/icons-material';

interface Property {
  _id: string;
  price: number;
  area: number;
  location?: {
    coordinates: [number, number];
  };
  views?: number;
  featured?: boolean;
}

interface PropertyHeatMapProps {
  properties: Property[];
  heatMapType?: 'price' | 'demand' | 'availability';
  height?: string | number;
  onHeatMapTypeChange?: (type: 'price' | 'demand' | 'availability') => void;
}

const MAPPLS_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_MAPPLS_API_KEY || '',
  getScriptUrl: () => `https://apis.mappls.com/advancedmaps/api/${MAPPLS_CONFIG.apiKey}/map_sdk?layer=vector&v=3.0&callback=initMap`
};

const PropertyHeatMap: React.FC<PropertyHeatMapProps> = ({
  properties,
  heatMapType = 'price',
  height = '500px',
  onHeatMapTypeChange
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const heatmapLayerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'price' | 'demand' | 'availability'>(heatMapType);
  const [containerId] = useState(() => `heatmap-container-${Math.random().toString(36).substr(2, 9)}`);

  // Load Mappls script
  useEffect(() => {
    if (typeof window === 'undefined' || scriptLoaded) return;

    const loadMapplsScript = () => {
      if (window.mappls) {
        setScriptLoaded(true);
        return;
      }

      const existingScript = document.querySelector('script[src*="mappls"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => setScriptLoaded(true));
        return;
      }

      if (!MAPPLS_CONFIG.apiKey) {
        setMapError('Mappls API key not found');
        return;
      }

      const script = document.createElement('script');
      script.src = MAPPLS_CONFIG.getScriptUrl();
      script.async = true;
      script.defer = true;
      
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => setMapError('Failed to load Mappls Maps');
      
      document.head.appendChild(script);
    };

    loadMapplsScript();
  }, [scriptLoaded]);

  // Calculate heat map data points
  const calculateHeatMapData = () => {
    const validProperties = properties.filter(p => 
      p.location?.coordinates?.length === 2
    );

    if (validProperties.length === 0) return [];

    switch (selectedType) {
      case 'price':
        // Price per sqft heat map
        return validProperties.map(property => {
          const pricePerSqft = property.area > 0 ? property.price / property.area : 0;
          return {
            location: [property.location!.coordinates[1], property.location!.coordinates[0]], // [lat, lng] for Mappls
            weight: Math.min(pricePerSqft / 1000, 10) // Normalize to 0-10 scale
          };
        });

      case 'demand':
        // Demand based on views and favorites
        const maxViews = Math.max(...validProperties.map(p => p.views || 0), 1);
        return validProperties.map(property => {
          const demandScore = ((property.views || 0) / maxViews) * 10;
          return {
            location: [property.location!.coordinates[1], property.location!.coordinates[0]],
            weight: Math.min(demandScore, 10)
          };
        });

      case 'availability':
        // Availability density (more properties = higher intensity)
        // Group by proximity and count
        return validProperties.map(property => ({
          location: [property.location!.coordinates[1], property.location!.coordinates[0]],
          weight: 1 // Each property contributes equally
        }));

      default:
        return [];
    }
  };

  // Initialize map and heat map
  useEffect(() => {
    if (!scriptLoaded || !properties || properties.length === 0) return;

    const container = document.getElementById(containerId) || mapRef.current;
    if (!container) {
      setTimeout(() => {
        if (mapRef.current) {
          initializeMap();
        }
      }, 500);
      return;
    }

    const initializeMap = () => {
      try {
        if (!window.mappls) {
          setMapError('Mappls SDK not loaded');
          return;
        }

        const validProperties = properties.filter(p => 
          p.location?.coordinates?.length === 2
        );

        if (validProperties.length === 0) {
          setMapLoaded(true);
          return;
        }

        // Calculate center from properties
        const lats = validProperties.map(p => p.location!.coordinates[1]);
        const lngs = validProperties.map(p => p.location!.coordinates[0]);
        const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
        const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

        // Clean up existing map
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.remove();
          } catch (e) {
            console.warn('Error removing map:', e);
          }
        }

        // Initialize map
        const mapOptions = {
          center: [centerLng, centerLat],
          zoom: 12,
          zoomControl: true,
          fullscreenControl: true,
          scrollWheel: true,
          hybridMap: false
        };

        setTimeout(() => {
          try {
            const map = new window.mappls.Map(container, mapOptions);
            mapInstanceRef.current = map;

            map.on('load', () => {
              setMapLoaded(true);
              addHeatMapLayer(map);
            });
          } catch (error) {
            console.error('Error initializing map:', error);
            setMapError('Failed to initialize map');
          }
        }, 100);
      } catch (error) {
        console.error('Error in initializeMap:', error);
        setMapError('Failed to initialize map');
      }
    };

    const addHeatMapLayer = (map: any) => {
      try {
        // Remove existing heatmap layer
        if (heatmapLayerRef.current) {
          map.removeLayer(heatmapLayerRef.current);
        }

        const heatMapData = calculateHeatMapData();
        
        if (heatMapData.length === 0) return;

        // Create heat map layer using Mappls heatmap plugin or custom implementation
        // Note: Mappls may not have built-in heatmap, so we'll use marker clustering with color coding
        const heatmapPoints = heatMapData.map((point, index) => {
          const marker = new window.mappls.Marker({
            position: point.location,
            map: map,
            icon: getHeatMapIcon(point.weight, selectedType),
            title: `Weight: ${point.weight.toFixed(2)}`
          });

          return marker;
        });

        heatmapLayerRef.current = heatmapPoints;
      } catch (error) {
        console.error('Error adding heatmap layer:', error);
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Error cleaning up map:', e);
        }
      }
    };
  }, [scriptLoaded, properties, selectedType, containerId]);

  // Get heat map icon based on weight
  const getHeatMapIcon = (weight: number, type: string) => {
    // Color gradient: blue (low) -> green -> yellow -> orange -> red (high)
    const intensity = Math.min(weight / 10, 1);
    let color: string;
    
    if (intensity < 0.2) color = '#0000FF'; // Blue
    else if (intensity < 0.4) color = '#00FF00'; // Green
    else if (intensity < 0.6) color = '#FFFF00'; // Yellow
    else if (intensity < 0.8) color = '#FF8800'; // Orange
    else color = '#FF0000'; // Red

    const size = 10 + (intensity * 20); // 10-30px radius

    // Use type assertion for Size and Point which may not be in type definition
    const mapplsAny = window.mappls as any;

    return {
      url: `data:image/svg+xml;base64,${btoa(`
        <svg width="${size * 2}" height="${size * 2}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${size}" cy="${size}" r="${size}" fill="${color}" opacity="0.6"/>
        </svg>
      `)}`,
      scaledSize: mapplsAny?.Size ? new mapplsAny.Size(size * 2, size * 2) : { width: size * 2, height: size * 2 },
      anchor: mapplsAny?.Point ? new mapplsAny.Point(size, size) : { x: size, y: size }
    };
  };

  const handleTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: 'price' | 'demand' | 'availability' | null
  ) => {
    if (newType !== null) {
      setSelectedType(newType);
      if (onHeatMapTypeChange) {
        onHeatMapTypeChange(newType);
      }
    }
  };

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
          Heat map unavailable. Missing Mappls API key.
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
          {mapError}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', height: height, borderRadius: '12px', overflow: 'hidden' }}>
      {/* Heat Map Type Selector */}
      <Box sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '8px',
        padding: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <ToggleButtonGroup
          value={selectedType}
          exclusive
          onChange={handleTypeChange}
          aria-label="heat map type"
          size="small"
        >
          <ToggleButton value="price" aria-label="price heat map">
            <Typography variant="caption" sx={{ px: 1 }}>Price</Typography>
          </ToggleButton>
          <ToggleButton value="demand" aria-label="demand heat map">
            <Typography variant="caption" sx={{ px: 1 }}>Demand</Typography>
          </ToggleButton>
          <ToggleButton value="availability" aria-label="availability heat map">
            <Typography variant="caption" sx={{ px: 1 }}>Availability</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Legend */}
      <Box sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
          {selectedType === 'price' ? 'Price per sqft' : 
           selectedType === 'demand' ? 'Demand Level' : 
           'Property Density'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#0000FF' }} />
          <Typography variant="caption">Low</Typography>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#00FF00', ml: 1 }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#FFFF00', ml: 1 }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#FF8800', ml: 1 }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#FF0000', ml: 1 }} />
          <Typography variant="caption" sx={{ ml: 1 }}>High</Typography>
        </Box>
      </Box>

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
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mt: 2 }}>
            Loading heat map...
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

export default PropertyHeatMap;

