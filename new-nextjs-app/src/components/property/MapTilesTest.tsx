'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';

const MapTilesTest = () => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [mapplsLoaded, setMapplsLoaded] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const mapplsApiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY || '82f5c384638d8cfc7d13e310780bae89';

  const addTestResult = (test: string, result: boolean, details?: string) => {
    setTestResults(prev => [...prev, { test, result, details, timestamp: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    addTestResult('Component Mounted', true);
    addTestResult('API Key Available', !!mapplsApiKey, `Length: ${mapplsApiKey.length}`);
    
    if (typeof window !== 'undefined') {
      addTestResult('Window Object Available', true);
    } else {
      addTestResult('Window Object Available', false, 'Server-side rendering');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || mapplsLoaded) return;

    const loadMapplsScript = () => {
      return new Promise((resolve, reject) => {
        if (window.mappls) {
          addTestResult('MapTiles Already Loaded', true);
          setMapplsLoaded(true);
          resolve(undefined);
          return;
        }

        addTestResult('Loading MapTiles Script', true, `URL: https://apis.mappls.com/advancedmaps/api/${mapplsApiKey}/map_sdk?v=3.0&layer=vector`);
        
        const script = document.createElement('script');
        script.src = `https://apis.mappls.com/advancedmaps/api/${mapplsApiKey}/map_sdk?v=3.0&layer=vector`;
        script.async = true;
        script.onload = () => {
          addTestResult('MapTiles Script Loaded', true);
          setMapplsLoaded(true);
          resolve(undefined);
        };
        script.onerror = (e) => {
          addTestResult('MapTiles Script Failed', false, 'Script loading error');
          setError('Failed to load map library');
          reject(new Error('Failed to load MapTiles script'));
        };
        document.head.appendChild(script);
      });
    };

    if (mapplsApiKey) {
      loadMapplsScript().catch(console.error);
    }
  }, [mapplsApiKey, mapplsLoaded]);

  useEffect(() => {
    if (!mapplsLoaded || !mapRef.current) {
      return;
    }

    try {
      addTestResult('Map Container Ready', true, `Container: ${mapRef.current.tagName}`);
      
      if (!window.mappls) {
        addTestResult('MapTiles Object Available', false, 'window.mappls is undefined');
        return;
      }

      addTestResult('MapTiles Object Available', true);
      
      // Test map creation
      const map = new window.mappls.Map(mapRef.current, {
        center: { lat: 28.6139, lng: 77.2090 },
        zoom: 10
      });

      addTestResult('Map Created Successfully', true);
      setIsLoaded(true);

      // Test marker creation
      const marker = new window.mappls.Marker({
        map: map,
        position: { lat: 28.6139, lng: 77.2090 }
      });

      addTestResult('Marker Created Successfully', true);

    } catch (err) {
      addTestResult('Map Creation Failed', false, err.message);
      console.error('Error creating MapTiles map:', err);
      setError('Failed to create map');
    }
  }, [mapplsLoaded]);

  const runTests = () => {
    setTestResults([]);
    addTestResult('Tests Started', true);
    
    // Re-run the initialization
    if (mapplsLoaded && mapRef.current) {
      try {
        const map = new window.mappls.Map(mapRef.current, {
          center: { lat: 28.6139, lng: 77.2090 },
          zoom: 10
        });
        addTestResult('Map Re-created Successfully', true);
      } catch (err) {
        addTestResult('Map Re-creation Failed', false, err.message);
      }
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        MapTiles Test Component
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={runTests} sx={{ mr: 2 }}>
          Run Tests
        </Button>
        <Typography variant="body2" color="text.secondary">
          API Key: {mapplsApiKey ? `${mapplsApiKey.substring(0, 10)}...` : 'Not found'}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Test Results:
        </Typography>
        {testResults.map((result, index) => (
          <Box key={index} sx={{ mb: 1, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" color={result.result ? 'success.main' : 'error.main'}>
              {result.result ? '✅' : '❌'} {result.test} - {result.timestamp}
            </Typography>
            {result.details && (
              <Typography variant="caption" color="text.secondary">
                {result.details}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Map Container:
        </Typography>
        <div 
          ref={mapRef}
          style={{
            width: '100%',
            height: '300px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f0f0f0'
          }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Status: {isLoaded ? '✅ Map Loaded' : '⏳ Loading...'}
        </Typography>
      </Box>
    </Box>
  );
};

export default MapTilesTest;
