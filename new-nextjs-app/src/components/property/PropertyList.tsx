'use client';

import React from 'react';
import { Grid, Box, Typography, CircularProgress, Alert } from '@mui/material';
import PropertyCard from './PropertyCard';
import { Property } from '@/types/property';

interface PropertyListProps {
  properties: Property[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  onPropertyClick?: (property: Property) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  loading = false,
  error = null,
  emptyMessage = 'No properties found',
  columns = { xs: 12, sm: 6, md: 4, lg: 3, xl: 3 },
  onPropertyClick
}) => {
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        width: '100%'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: 'var(--color-primary)', mb: 2 }} />
          <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
            Loading properties...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        width: '100%'
      }}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        width: '100%'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'var(--color-text-muted)',
              mb: 1
            }}
          >
            {emptyMessage}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: 'var(--color-text-muted)' }}
          >
            Try adjusting your search filters
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {properties.map((property) => (
        <Grid item {...columns} key={property._id}>
          <PropertyCard 
            property={property} 
            onClick={onPropertyClick}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default PropertyList;

