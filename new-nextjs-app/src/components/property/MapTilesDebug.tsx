'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, Card, CardContent } from '@mui/material';

const MapTilesDebug = () => {
  const [debugInfo, setDebugInfo] = useState({
    apiKey: '',
    isLoaded: false,
    error: null,
    windowMappls: false,
    apiTestResult: null,
    loading: false
  });

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY;
    setDebugInfo(prev => ({
      ...prev,
      apiKey: apiKey || 'NOT_FOUND',
      windowMappls: typeof window !== 'undefined' && !!window.mappls
    }));

    // Check if MapTiles is loaded
    if (typeof window !== 'undefined' && window.mappls) {
      setDebugInfo(prev => ({ ...prev, isLoaded: true }));
    }

    // Test the API key
    testApiKey();
  }, []);

  const testApiKey = async () => {
    setDebugInfo(prev => ({ ...prev, loading: true }));
    try {
      const response = await fetch('/api/test-mappls');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setDebugInfo(prev => ({ ...prev, apiTestResult: data, loading: false }));
    } catch (error) {
      console.error('MapTiles API test error:', error);
      setDebugInfo(prev => ({ 
        ...prev, 
        apiTestResult: { success: false, error: error.message },
        loading: false 
      }));
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          MapTiles Debug Information
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" component="div">
            <strong>API Key:</strong> {debugInfo.apiKey ? '✅ Found' : '❌ Missing'}
          </Typography>
          <Typography variant="body2" component="div" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', mt: 1 }}>
            {debugInfo.apiKey}
          </Typography>
        </Box>

        {debugInfo.loading && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="primary">
              🔄 Testing API key...
            </Typography>
          </Box>
        )}
        
        {debugInfo.apiTestResult && (
          <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              <strong>API Test Result:</strong>
            </Typography>
            <Typography variant="body2" color={debugInfo.apiTestResult.success ? 'success.main' : 'error.main'}>
              {debugInfo.apiTestResult.success ? '✅ API Key Working' : '❌ API Key Failed'}
            </Typography>
            {debugInfo.apiTestResult.errorMessage && (
              <Typography variant="body2" color="error" sx={{ fontSize: '0.8rem', mt: 1 }}>
                Error: {debugInfo.apiTestResult.errorMessage}
              </Typography>
            )}
            {debugInfo.apiTestResult.status && (
              <Typography variant="body2" sx={{ fontSize: '0.8rem', mt: 1 }}>
                Status: {debugInfo.apiTestResult.status}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" component="div">
            <strong>MapTiles Loaded:</strong> {debugInfo.isLoaded ? '✅ Yes' : '❌ No'}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" component="div">
            <strong>Window MapTiles Object:</strong> {debugInfo.windowMappls ? '✅ Available' : '❌ Not Available'}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" component="div">
            <strong>Environment:</strong> {process.env.NODE_ENV}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" component="div">
            <strong>Script Status:</strong> {debugInfo.windowMappls ? '✅ Loaded' : '❌ Not Loaded'}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" component="div">
            <strong>API Key Length:</strong> {debugInfo.apiKey.length} characters
          </Typography>
        </Box>

        {!debugInfo.apiKey && (
          <Alert severity="error" sx={{ mt: 2 }}>
            MapTiles API key is not available. Please check your environment variables.
          </Alert>
        )}

        {debugInfo.apiKey && !debugInfo.isLoaded && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            API key is available but MapTiles is not loaded yet. This is normal during initial load.
          </Alert>
        )}

        {debugInfo.apiKey && debugInfo.isLoaded && (
          <Alert severity="success" sx={{ mt: 2 }}>
            MapTiles is properly configured and loaded!
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default MapTilesDebug;
