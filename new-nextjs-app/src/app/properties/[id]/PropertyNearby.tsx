'use client';

import { Box, Typography, Grid, Paper, Stack } from '@mui/material';
import { 
  School, 
  LocalHospital, 
  ShoppingCart, 
  Park, 
  DirectionsBus 
} from '@mui/icons-material';
import SectionHeader from './SectionHeader';

interface Property {
  address: {
    city: string;
    locality: string;
  };
}

interface PropertyNearbyProps {
  property: Property;
}

const PropertyNearby = ({ property }: PropertyNearbyProps) => {
  // Mock nearby places data - in a real app, this would come from an API
  const nearbyPlaces = [
    { type: 'School', name: 'Delhi Public School', distance: '0.5 km', icon: <School /> },
    { type: 'Hospital', name: 'Apollo Hospital', distance: '1.2 km', icon: <LocalHospital /> },
    { type: 'Shopping', name: 'Select City Walk', distance: '0.8 km', icon: <ShoppingCart /> },
    { type: 'Park', name: 'Lodi Garden', distance: '1.5 km', icon: <Park /> },
    { type: 'Transport', name: 'Metro Station', distance: '0.3 km', icon: <DirectionsBus /> },
  ];

  return (
    <Box>
      <SectionHeader 
        title="Nearby Places" 
        subtitle="Important locations around this property"
      />
      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          {nearbyPlaces.map((place, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                p: 2,
                borderRadius: 1,
                backgroundColor: 'grey.50',
                '&:hover': {
                  backgroundColor: 'grey.100'
                }
              }}>
                <Box sx={{ color: 'primary.main' }}>
                  {place.icon}
                </Box>
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {place.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {place.distance}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default PropertyNearby;
