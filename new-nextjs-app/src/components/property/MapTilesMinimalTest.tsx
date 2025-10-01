'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';

const MapTilesMinimalTest = () => {
  const mapRef = useRef(null);
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  const [mapplsLoaded, setMapplsLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const mapplsApiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY || '82f5c384638d8cfc7d13e310780bae89';

  useEffect(() => {
    setStatus('Loading MapTiles script...');
    
    // Check if MapTiles is already loaded
    if (window.mappls) {
      setStatus('MapTiles already loaded');
      setMapplsLoaded(true);
      return;
    }

    // Load MapTiles script
    const script = document.createElement('script');
    script.src = `https://apis.mappls.com/advancedmaps/api/${mapplsApiKey}/map_sdk?v=3.0&layer=vector`;
    script.async = true;
    
    script.onload = () => {
      setStatus('MapTiles script loaded successfully');
      setMapplsLoaded(true);
    };
    
    script.onerror = (err) => {
      setStatus('Failed to load MapTiles script');
      setError('Script loading failed');
      console.error('Script loading error:', err);
    };
    
    document.head.appendChild(script);
  }, []);

  const initializeMap = () => {
    if (!mapplsLoaded || !mapRef.current) {
      setStatus('MapTiles not loaded or container not ready');
      return;
    }

    try {
      setStatus('Initializing map...');
      
      // Check if container is visible and has dimensions
      if (!mapRef.current.offsetParent) {
        setStatus('Map container not visible, retrying...');
        if (retryCount < 5) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            if (mapRef.current) {
              initializeMap();
            }
          }, 500);
        } else {
          setError('Map container not visible after 5 retries');
        }
        return;
      }

      const rect = mapRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        setStatus('Map container has no dimensions, retrying...');
        if (retryCount < 5) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            if (mapRef.current) {
              initializeMap();
            }
          }, 500);
        } else {
          setError('Map container has no dimensions after 5 retries');
        }
        return;
      }

      console.log('🔧 MapTiles Minimal Test - Initializing map...', {
        container: mapRef.current,
        dimensions: { width: rect.width, height: rect.height },
        mappls: !!window.mappls,
        apiKey: mapplsApiKey
      });

      // Create map
      const map = new window.mappls.Map(mapRef.current, {
        center: { lat: 28.6139, lng: 77.2090 },
        zoom: 10
      });

      setMapInstance(map);
      setStatus('Map initialized successfully!');
      setError(null);
    } catch (err) {
      setStatus('Map initialization failed');
      setError(err.message);
      console.error('Map initialization error:', err);
    }
  };

  useEffect(() => {
    if (mapplsLoaded && mapRef.current) {
      initializeMap();
    }
  }, [mapplsLoaded]);

  const resetTest = () => {
    setStatus('Resetting...');
    setError(null);
    setRetryCount(0);
    setMapInstance(null);
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
    }
    setTimeout(() => {
      initializeMap();
    }, 100);
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1, mb: 2, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h6" gutterBottom>
        MapTiles Minimal Test
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2">
          <strong>Status:</strong> {status}
        </Typography>
        <Typography variant="body2">
          <strong>API Key:</strong> {mapplsApiKey ? `${mapplsApiKey.substring(0, 10)}...` : 'Not found'}
        </Typography>
        <Typography variant="body2">
          <strong>MapTiles Loaded:</strong> {mapplsLoaded ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body2">
          <strong>Container Ready:</strong> {mapRef.current ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body2">
          <strong>Container Visible:</strong> {mapRef.current?.offsetParent ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body2">
          <strong>Retry Count:</strong> {retryCount}
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button 
          onClick={initializeMap} 
          disabled={!mapplsLoaded}
          variant="contained"
          size="small"
        >
          Initialize Map
        </Button>
        <Button 
          onClick={resetTest} 
          variant="outlined"
          size="small"
        >
          Reset Test
        </Button>
      </Box>
      
      <Box 
        ref={mapRef}
        sx={{
          width: '100%',
          height: '400px',
          border: '2px solid #ddd',
          backgroundColor: '#f0f0f0',
          position: 'relative'
        }}
      >
        {!mapInstance && (
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#666'
          }}>
            <CircularProgress size={40} sx={{ mb: 1 }} />
            <Typography variant="body2">
              {status}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MapTilesMinimalTest;
