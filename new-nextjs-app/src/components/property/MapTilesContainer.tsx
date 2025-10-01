'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

interface MapTilesContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMapReady?: (map: any) => void;
  onMapError?: (error: string) => void;
}

const MapTilesContainer = ({ 
  children, 
  className = '', 
  style = {},
  onMapReady,
  onMapError 
}: MapTilesContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;

  const checkContainerReadiness = useCallback(() => {
    if (!containerRef.current) {
      console.log('🔧 Container ref not available');
      return false;
    }

    // Check if container is in DOM
    if (!containerRef.current.offsetParent) {
      console.log('🔧 Container not in DOM or not visible');
      return false;
    }

    // Check if container has dimensions
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      console.log('🔧 Container has no dimensions:', { width: rect.width, height: rect.height });
      return false;
    }

    // Check if MapTiles is available
    if (!window.mappls) {
      console.log('🔧 MapTiles not available');
      return false;
    }

    console.log('✅ Container is ready:', {
      width: rect.width,
      height: rect.height,
      mappls: !!window.mappls
    });

    return true;
  }, []);

  const initializeMap = useCallback(() => {
    if (!checkContainerReadiness()) {
      if (retryCount < maxRetries) {
        console.log(`🔧 Container not ready, retrying... (${retryCount + 1}/${maxRetries})`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          initializeMap();
        }, 200 * (retryCount + 1)); // Exponential backoff
      } else {
        console.error('❌ Max retries reached, container not ready');
        setError('Map container failed to initialize after multiple attempts');
        onMapError?.('Map container failed to initialize');
      }
      return;
    }

    try {
      console.log('🔧 Initializing MapTiles map...');
      
      // Clear any existing content
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      // Create map with proper configuration
      const map = new window.mappls.Map(containerRef.current, {
        center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
        zoom: 10,
        mapTypeId: 'mappls.vector',
        gestureHandling: 'greedy',
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
      });

      // Add event listeners
      map.addListener('idle', () => {
        console.log('✅ Map is ready and idle');
        setIsReady(true);
        onMapReady?.(map);
      });

      map.addListener('error', (error) => {
        console.error('❌ Map error:', error);
        setError('Map failed to load: ' + error.message);
        onMapError?.(error.message);
      });

      console.log('✅ Map created successfully');

    } catch (err) {
      console.error('❌ Error creating map:', err);
      setError('Error creating map: ' + err.message);
      onMapError?.(err.message);
    }
  }, [checkContainerReadiness, retryCount, maxRetries, onMapReady, onMapError]);

  useEffect(() => {
    // Wait for MapTiles to be available
    const checkMapTiles = () => {
      if (window.mappls) {
        console.log('✅ MapTiles available, initializing map...');
        initializeMap();
      } else {
        console.log('🔧 MapTiles not available yet, waiting...');
        setTimeout(checkMapTiles, 100);
      }
    };

    // Start checking after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(checkMapTiles, 100);

    return () => clearTimeout(timeoutId);
  }, [initializeMap]);

  return (
    <Box
      ref={containerRef}
      className={`map-container ${className}`}
      style={{
        width: '100%',
        height: '400px',
        position: 'relative',
        ...style
      }}
    >
      {!isReady && !error && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            zIndex: 1
          }}
        >
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Loading map...
          </Typography>
          {retryCount > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Retrying... ({retryCount}/{maxRetries})
            </Typography>
          )}
        </Box>
      )}

      {error && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffebee',
            zIndex: 1
          }}
        >
          <Alert severity="error" sx={{ maxWidth: '80%' }}>
            <Typography variant="body2">
              <strong>Map Error:</strong> {error}
            </Typography>
          </Alert>
        </Box>
      )}

      {isReady && children}
    </Box>
  );
};

export default MapTilesContainer;
