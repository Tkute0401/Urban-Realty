'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { LocationOn } from '@mui/icons-material';

interface PropertyNearbyProps {
  property: any;
  sectionRef?: React.RefObject<HTMLDivElement>;
}

const PropertyNearby: React.FC<PropertyNearbyProps> = ({ property, sectionRef }) => {
  return (
    <Paper 
      ref={sectionRef}
      id="section-nearby"
      sx={{ 
        p: 3, 
        mb: 4, 
        bgcolor: 'var(--color-surface)', 
        border: '1px solid var(--color-border)',
        borderRadius: 2
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          color: 'var(--color-primary)', 
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <LocationOn sx={{ color: 'var(--color-primary)' }} />
        Nearby Amenities
      </Typography>
      
      <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
        <LocationOn sx={{ fontSize: 48, color: 'var(--color-text-muted)', mb: 2 }} />
        <Typography variant="body1" sx={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          No nearby amenities information available for this property.
        </Typography>
      </Box>
    </Paper>
  );
};

export default PropertyNearby;