'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import PropertyMap from '@/components/property/PropertyMap';

const TestMapPage: React.FC = () => {
  // Test coordinates for Delhi
  const testLatitude = 28.6139;
  const testLongitude = 77.2090;
  const testAddress = "Connaught Place, New Delhi, Delhi 110001, India";

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Property Map Test
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Test Map with Marker and Centering
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Coordinates: {testLatitude}, {testLongitude}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Address: {testAddress}
        </Typography>
        
        <PropertyMap
          latitude={testLatitude}
          longitude={testLongitude}
          address={testAddress}
          height="500px"
          zoom={15}
          showMarker={true}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Test Map without Marker (should still center)
        </Typography>
        
        <PropertyMap
          latitude={testLatitude}
          longitude={testLongitude}
          address={testAddress}
          height="400px"
          zoom={12}
          showMarker={false}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Test Map with Different Location (Mumbai)
        </Typography>
        
        <PropertyMap
          latitude={19.0760}
          longitude={72.8777}
          address="Gateway of India, Mumbai, Maharashtra, India"
          height="400px"
          zoom={15}
          showMarker={true}
        />
      </Box>
    </Container>
  );
};

export default TestMapPage;
