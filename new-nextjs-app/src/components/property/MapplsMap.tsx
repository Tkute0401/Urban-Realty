import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { getMapplsMapOptions, getMarkerStyles, DEFAULT_MAP_CONFIG } from '../../lib/mappls-styles';

interface MapplsMapProps {
  properties?: Array<{
    _id: string;
    title: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    price?: number;
    location?: {
      coordinates: [number, number]; // [longitude, latitude]
    };
  }>;
  selectedProperty?: {
    _id: string;
  };
  onMarkerClick?: (property: any) => void;
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  className?: string;
  height?: string;
}

const MapplsMap: React.FC<MapplsMapProps> = ({
  properties = [],
  selectedProperty,
  onMarkerClick,
  center,
  zoom = 10,
  className = "map-container",
  height = "400px"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapplsApiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY || 'jlkkhjduceawzjoehvxouwjnhaysrirbdahc';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadMapplsScript = () => {
      return new Promise((resolve, reject) => {
        // Check if Mappls is already loaded
        if (window.Mappls) {
          resolve(window.Mappls);
          return;
        }

        const script = document.createElement('script');
        script.src = `https://apis.mappls.com/advancedmaps/api/${mapplsApiKey}/map_sdk?layer=vector&v=3.0&callback=initMap`;
        script.async = true;
        script.defer = true;

        // Define the callback function
        window.initMap = () => {
          resolve(window.Mappls);
        };

        script.onerror = () => {
          reject(new Error('Failed to load Mappls script'));
        };

        document.head.appendChild(script);
      });
    };

    const initializeMap = async () => {
      try {
        const Mappls = await loadMapplsScript();
        
        if (!mapRef.current) return;

        // Initialize the map
        const mapOptions = {
          ...getMapplsMapOptions(),
          container: mapRef.current,
          center: center ? [center.lng, center.lat] : DEFAULT_MAP_CONFIG.center,
          zoom: zoom || DEFAULT_MAP_CONFIG.zoom
        };

        const map = new (Mappls as any).Map(mapOptions);

        mapInstanceRef.current = map;

        map.on('load', () => {
          setIsLoaded(true);
          console.log('🔧 Mappls map loaded successfully');
        });

        map.on('error', (e: any) => {
          console.error('🔧 Mappls map error:', e);
          setError('Failed to load map');
        });

      } catch (err) {
        console.error('🔧 Error loading Mappls:', err);
        setError('Failed to load Mappls');
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapplsApiKey, center, zoom]);

  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !properties.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each property
    properties.forEach((property, index) => {
      if (!property.location?.coordinates || property.location.coordinates.length !== 2) {
        return;
      }

      const [lng, lat] = property.location.coordinates;
      const isSelected = selectedProperty?._id === property._id;

      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'mappls-marker';
      
      // Apply marker styles
      const styles = getMarkerStyles(isSelected);
      Object.assign(markerElement.style, styles);

      // Add hover effect
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.2)';
      });
      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
      });

      // Add click handler
      markerElement.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onMarkerClick) {
          onMarkerClick(property);
        }
      });

      // Create marker
      const marker = new (window.Mappls as any).Marker({
        element: markerElement,
        position: [lng, lat]
      });

      marker.addTo(mapInstanceRef.current);
      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (properties.length > 1) {
      const bounds = new (window.Mappls as any).LngLatBounds();
      properties.forEach(property => {
        if (property.location?.coordinates?.length === 2) {
          bounds.extend(property.location.coordinates);
        }
      });
      mapInstanceRef.current.fitBounds(bounds, { padding: 50 });
    }

  }, [isLoaded, properties, selectedProperty, onMarkerClick]);

  if (!mapplsApiKey) {
    return (
      <Box className="map-empty" sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Map unavailable. Missing Mappls API key.
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="map-empty" sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="error">
          Map unavailable. {error}
        </Typography>
      </Box>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <Box className="map-empty" sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No properties to display on map.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height, width: '100%' }}>
      <div
        ref={mapRef}
        className={className}
        style={{ height: '100%', width: '100%' }}
      />
      {!isLoaded && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1
          }}
        >
          <Typography variant="body2">Loading Mappls...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default MapplsMap;
