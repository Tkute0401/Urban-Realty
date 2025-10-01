'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';

const MapTilesSimpleTest = () => {
  const mapRef = useRef(null);
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  const [mapplsLoaded, setMapplsLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);

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
      
      // Check if container is visible
      if (!mapRef.current.offsetParent) {
        setStatus('Map container not visible, retrying...');
        setTimeout(() => {
          if (mapRef.current && mapRef.current.offsetParent) {
            initializeMap();
          }
        }, 100);
        return;
      }

      // Create map
      const map = new window.mappls.Map(mapRef.current, {
        center: { lat: 28.6139, lng: 77.2090 },
        zoom: 10
      });

      setMapInstance(map);
      setStatus('Map initialized successfully!');
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

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        MapTiles Simple Test
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>Status:</strong> {status}
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>API Key:</strong> {mapplsApiKey ? `${mapplsApiKey.substring(0, 10)}...` : 'Not found'}
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>MapTiles Loaded:</strong> {mapplsLoaded ? 'Yes' : 'No'}
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>Container Ready:</strong> {mapRef.current ? 'Yes' : 'No'}
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>Container Visible:</strong> {mapRef.current?.offsetParent ? 'Yes' : 'No'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
      
      <Button 
        onClick={initializeMap} 
        disabled={!mapplsLoaded}
        variant="contained"
        sx={{ mt: 1 }}
      >
        Initialize Map
      </Button>
      
      <Box 
        ref={mapRef}
        sx={{
          width: '100%',
          height: '300px',
          border: '1px solid #ddd',
          mt: 2,
          backgroundColor: '#f5f5f5'
        }}
      />
    </Box>
  );
};

export default MapTilesSimpleTest;
