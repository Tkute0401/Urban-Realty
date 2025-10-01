'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';

const MapTilesApiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mapplsApiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY || '82f5c384638d8cfc7d13e310780bae89';

  const testApiKey = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test 1: Check if API key is valid format
      if (!mapplsApiKey || mapplsApiKey.length < 10) {
        throw new Error('Invalid API key format');
      }

      // Test 2: Try to load MapTiles script
      const scriptUrl = `https://apis.mappls.com/advancedmaps/api/${mapplsApiKey}/map_sdk?v=3.0&layer=vector`;
      
      const response = await fetch(scriptUrl, { method: 'HEAD' });
      
      if (!response.ok) {
        throw new Error(`MapTiles API returned ${response.status}: ${response.statusText}`);
      }

      // Test 3: Check if script loads successfully
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        
        script.onload = () => {
          console.log('✅ MapTiles script loaded successfully');
          resolve({
            success: true,
            apiKey: mapplsApiKey,
            scriptUrl: scriptUrl,
            status: response.status,
            mapplsAvailable: !!window.mappls
          });
        };
        
        script.onerror = (err) => {
          console.error('❌ MapTiles script failed to load:', err);
          reject(new Error('Failed to load MapTiles script'));
        };
        
        document.head.appendChild(script);
      });

    } catch (err) {
      console.error('❌ API test failed:', err);
      throw err;
    }
  };

  const runTest = async () => {
    try {
      const result = await testApiKey();
      setTestResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1, mb: 2, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h6" gutterBottom>
        MapTiles API Test
      </Typography>
      
      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CircularProgress size={20} />
          <Typography variant="body2">Testing API key...</Typography>
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Error:</strong> {error}
          </Typography>
        </Alert>
      )}
      
      {testResult && (
        <Box sx={{ mb: 2 }}>
          <Alert severity={testResult.success ? 'success' : 'error'}>
            <Typography variant="body2">
              <strong>API Test Result:</strong> {testResult.success ? '✅ Success' : '❌ Failed'}
            </Typography>
            <Typography variant="body2">
              <strong>API Key:</strong> {testResult.apiKey ? `${testResult.apiKey.substring(0, 10)}...` : 'Not found'}
            </Typography>
            <Typography variant="body2">
              <strong>Script URL:</strong> {testResult.scriptUrl}
            </Typography>
            <Typography variant="body2">
              <strong>Status:</strong> {testResult.status}
            </Typography>
            <Typography variant="body2">
              <strong>MapTiles Available:</strong> {testResult.mapplsAvailable ? '✅ Yes' : '❌ No'}
            </Typography>
          </Alert>
        </Box>
      )}
      
      <Button 
        onClick={runTest} 
        disabled={loading}
        variant="contained"
        size="small"
      >
        {loading ? 'Testing...' : 'Test API Key'}
      </Button>
    </Box>
  );
};

export default MapTilesApiTest;
