'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';

interface TestResult {
  status: number | string;
  success: boolean;
  data: any;
  error: string | null;
}

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [loading, setLoading] = useState(false);

  const testApiEndpoint = async (endpoint: string, name: string) => {
    try {
      console.log(`Testing ${name}: ${endpoint}`);
      const response = await fetch(endpoint);
      const data = await response.json();
      
      setTestResults(prev => ({
        ...prev,
        [name]: {
          status: response.status,
          success: response.ok,
          data: data,
          error: null
        }
      }));
    } catch (error) {
      console.error(`Error testing ${name}:`, error);
      setTestResults(prev => ({
        ...prev,
        [name]: {
          status: 'ERROR',
          success: false,
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults({});
    
    await testApiEndpoint('/api/properties/featured', 'Featured Properties');
    await testApiEndpoint('/api/properties?page=1&limit=5', 'Properties List');
    await testApiEndpoint('/api/properties/1', 'Single Property');
    
    setLoading(false);
  };

  useEffect(() => {
    // Auto-run tests on mount
    runAllTests();
  }, []);

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        API Endpoints Test
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={runAllTests} 
        disabled={loading}
        sx={{ mb: 3 }}
      >
        {loading ? <CircularProgress size={20} /> : 'Run Tests'}
      </Button>

      {Object.entries(testResults).map(([name, result]) => (
        <Box key={name} sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {name}
          </Typography>
          
          <Alert 
            severity={result.success ? 'success' : 'error'}
            sx={{ mb: 1 }}
          >
            Status: {result.status} - {result.success ? 'Success' : 'Failed'}
          </Alert>
          
          {result.error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              Error: {result.error}
            </Alert>
          )}
          
          {result.data && (
            <Box sx={{ 
              p: 2, 
              bgcolor: 'grey.100', 
              borderRadius: 1,
              maxHeight: 200,
              overflow: 'auto'
            }}>
              <Typography variant="body2" component="pre">
                {JSON.stringify(result.data, null, 2)}
              </Typography>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}
