'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';

const MapTilesDirectTest = () => {
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const mapplsApiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY || '82f5c384638d8cfc7d13e310780bae89';

  useEffect(() => {
    const loadMapTiles = async () => {
      try {
        setStatus('Loading MapTiles script...');
        
        // Check if script already exists
        if (window.mappls) {
          setStatus('MapTiles already loaded');
          initializeMap();
          return;
        }

        // Load the script
        const script = document.createElement('script');
        script.src = `https://apis.mappls.com/advancedmaps/api/${mapplsApiKey}/map_sdk?v=3.0&layer=vector`;
        script.async = true;
        
        script.onload = () => {
          console.log('✅ MapTiles script loaded successfully');
          setStatus('MapTiles script loaded, initializing map...');
          initializeMap();
        };
        
        script.onerror = (err) => {
          console.error('❌ Failed to load MapTiles script:', err);
          setError('Failed to load MapTiles script');
          setStatus('Failed to load script');
        };
        
        document.head.appendChild(script);
        
      } catch (err) {
        console.error('❌ Error loading MapTiles:', err);
        setError(err.message);
        setStatus('Error loading MapTiles');
      }
    };

    loadMapTiles();
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.mappls) {
      console.log('❌ Map container or MapTiles not available');
      setError('Map container or MapTiles not available');
      return;
    }

    try {
      console.log('🔧 Initializing MapTiles map...');
      
      // Clear any existing content
      mapRef.current.innerHTML = '';
      
      // Create map
      const map = new window.mappls.Map(mapRef.current, {
        center: { lat: 28.6139, lng: 77.2090 }, // Delhi
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

      mapInstanceRef.current = map;

      // Add event listeners
      map.addListener('idle', () => {
        console.log('✅ Map is ready and idle');
        setMapLoaded(true);
        setStatus('Map loaded successfully!');
      });

      map.addListener('error', (error) => {
        console.error('❌ Map error:', error);
        setError('Map failed to load: ' + error.message);
        setStatus('Map failed to load');
      });

      // Add a marker
      const marker = new window.mappls.Marker({
        map: map,
        position: { lat: 28.6139, lng: 77.2090 },
        title: 'Test Marker'
      });

      console.log('✅ Map and marker created successfully');

    } catch (err) {
      console.error('❌ Error creating map:', err);
      setError('Error creating map: ' + err.message);
      setStatus('Error creating map');
    }
  };

  const resetMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current = null;
    }
    setMapLoaded(false);
    setError(null);
    setStatus('Resetting...');
    
    setTimeout(() => {
      initializeMap();
    }, 100);
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1, mb: 2, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h6" gutterBottom>
        MapTiles Direct Test
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Status:</strong> {status}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>API Key:</strong> {mapplsApiKey ? `${mapplsApiKey.substring(0, 10)}...` : 'Not found'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>MapTiles Available:</strong> {window.mappls ? '✅ Yes' : '❌ No'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Map Loaded:</strong> {mapLoaded ? '✅ Yes' : '❌ No'}
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Error:</strong> {error}
          </Typography>
        </Alert>
      )}
      
      <Box sx={{ mb: 2 }}>
        <Button 
          onClick={resetMap} 
          variant="contained" 
          size="small"
          disabled={!window.mappls}
        >
          Reset Map
        </Button>
      </Box>
      
      <Box 
        ref={mapRef}
        sx={{ 
          width: '100%', 
          height: '400px', 
          border: '2px solid #ccc',
          borderRadius: 1,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {!mapLoaded && (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={40} sx={{ mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Loading map...
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MapTilesDirectTest;
