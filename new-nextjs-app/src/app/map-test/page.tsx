'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import MapTest from '../../components/property/MapTest';
import PropertiesMap from '../../components/property/PropertiesMap';

// Mock properties data for testing
const mockProperties = [
  {
    _id: '1',
    title: 'Test Property 1',
    price: 5000000,
    location: {
      coordinates: [77.2090, 28.6139] as [number, number] // Delhi
    }
  },
  {
    _id: '2', 
    title: 'Test Property 2',
    price: 7500000,
    location: {
      coordinates: [77.1025, 28.7041] as [number, number] // Delhi
    }
  }
];

const MapTestPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Map Testing Page
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Basic Map Test
        </Typography>
        <MapTest />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Properties Map Test
        </Typography>
        <PropertiesMap 
          properties={mockProperties}
          height="500px"
        />
      </Box>
    </Container>
  );
};

export default MapTestPage;