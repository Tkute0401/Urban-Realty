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
        minHeight: '50vh',
        background: '#08171A'
      }}>
        <CircularProgress size={60} sx={{ color: '#78CADC' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '50vh',
        background: '#08171A',
        p: 4
      }}>
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '50vh',
        background: '#08171A',
        p: 4,
        textAlign: 'center'
      }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          {emptyMessage}
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
          Try adjusting your search criteria or check back later for new listings.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: '#08171A',
      minHeight: '100vh',
      py: 4
    }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3 } }}>
        {/* Results Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              mb: 1,
              fontSize: { xs: '24px', sm: '32px' }
            }}
          >
            Properties Found
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: { xs: '14px', sm: '16px' }
            }}
          >
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} available
          </Typography>
        </Box>

        {/* Properties Grid */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {properties.map((property, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={property._id}>
              <PropertyCard 
                property={property}
                index={index}
                onClick={onPropertyClick}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default PropertyList;

