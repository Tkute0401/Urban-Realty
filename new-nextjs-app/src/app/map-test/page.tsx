'use client'

import React, { useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import PropertiesMap from '@/components/property/PropertiesMap';
import PropertyMap from '@/components/property/PropertyMap';

export default function MapTestPage() {
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Mock properties data
  const mockProperties = [
    {
      _id: '1',
      title: 'Modern Apartment in Bandra',
      price: 5000000,
      address: {
        locality: 'Bandra',
        city: 'Mumbai',
        state: 'Maharashtra'
      },
      location: {
        coordinates: [72.8261, 19.0596] // [lng, lat]
      }
    },
    {
      _id: '2',
      title: 'Luxury Villa in Gurgaon',
      price: 15000000,
      address: {
        locality: 'Gurgaon',
        city: 'Delhi',
        state: 'Haryana'
      },
      location: {
        coordinates: [77.1025, 28.4595] // [lng, lat]
      }
    },
    {
      _id: '3',
      title: 'Cozy Apartment in Bangalore',
      price: 35000,
      address: {
        locality: 'Koramangala',
        city: 'Bangalore',
        state: 'Karnataka'
      },
      location: {
        coordinates: [77.5946, 12.9352] // [lng, lat]
      }
    }
  ];

  const handleMarkerClick = (property) => {
    setSelectedProperty(property);
    console.log('Property clicked:', property);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Map Test Page
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Properties Map (Multiple Properties)
          </Typography>
          <PropertiesMap 
            properties={mockProperties}
            selectedProperty={selectedProperty}
            onMarkerClick={handleMarkerClick}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Single Property Map
          </Typography>
          {selectedProperty ? (
            <PropertyMap 
              location={selectedProperty.location}
              address={selectedProperty.address?.locality}
            />
          ) : (
            <Box sx={{ 
              height: '400px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid #ccc',
              borderRadius: 1
            }}>
              <Typography variant="body2" color="text.secondary">
                Click a property marker to see its map
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Controls
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => setSelectedProperty(null)}
          sx={{ mr: 2 }}
        >
          Clear Selection
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => setSelectedProperty(mockProperties[0])}
        >
          Select First Property
        </Button>
      </Box>

      {selectedProperty && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="h6">Selected Property:</Typography>
          <Typography variant="body1">
            <strong>Title:</strong> {selectedProperty.title}
          </Typography>
          <Typography variant="body1">
            <strong>Price:</strong> ₹{selectedProperty.price?.toLocaleString()}
          </Typography>
          <Typography variant="body1">
            <strong>Location:</strong> {selectedProperty.address?.locality}, {selectedProperty.address?.city}
          </Typography>
        </Box>
      )}
    </Box>
  );
}