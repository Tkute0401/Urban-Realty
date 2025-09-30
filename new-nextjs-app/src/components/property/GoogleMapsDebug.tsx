'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, Card, CardContent } from '@mui/material';

const GoogleMapsDebug = () => {
  const [debugInfo, setDebugInfo] = useState({
    apiKey: '',
    isLoaded: false,
    error: null,
    windowGoogle: false
  });

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    setDebugInfo(prev => ({
      ...prev,
      apiKey: apiKey || 'NOT_FOUND',
      windowGoogle: typeof window !== 'undefined' && !!window.google
    }));

    // Check if Google Maps is loaded
    if (typeof window !== 'undefined' && window.google) {
      setDebugInfo(prev => ({ ...prev, isLoaded: true }));
    }
  }, []);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Google Maps Debug Information
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" component="div">
            <strong>API Key:</strong> {debugInfo.apiKey ? '✅ Found' : '❌ Missing'}
          </Typography>
          <Typography variant="body2" component="div" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', mt: 1 }}>
            {debugInfo.apiKey}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" component="div">
            <strong>Google Maps Loaded:</strong> {debugInfo.isLoaded ? '✅ Yes' : '❌ No'}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" component="div">
            <strong>Window Google Object:</strong> {debugInfo.windowGoogle ? '✅ Available' : '❌ Not Available'}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" component="div">
            <strong>Environment:</strong> {process.env.NODE_ENV}
          </Typography>
        </Box>

        {!debugInfo.apiKey && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Google Maps API key is not available. Please check your environment variables.
          </Alert>
        )}

        {debugInfo.apiKey && !debugInfo.isLoaded && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            API key is available but Google Maps is not loaded yet. This is normal during initial load.
          </Alert>
        )}

        {debugInfo.apiKey && debugInfo.isLoaded && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Google Maps is properly configured and loaded!
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleMapsDebug;
