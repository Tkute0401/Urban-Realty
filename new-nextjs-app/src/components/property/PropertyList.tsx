'use client';

import React from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
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
        background: 'var(--color-bg)'
      }}>
        <CircularProgress size={60} sx={{ color: 'var(--color-primary)' }} />
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
        background: 'var(--color-bg)',
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
        background: 'var(--color-bg)',
        p: 4,
        textAlign: 'center'
      }}>
        <Typography variant="h6" sx={{ color: 'var(--color-text-primary)', mb: 2 }}>
          {emptyMessage}
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--color-text-muted)', mb: 3 }}>
          Try adjusting your search criteria or check back later for new listings.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      px: { xs: 2, md: 3 },
      py: 6,
      minHeight: '400px',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, var(--color-bg) 0%, rgba(247, 107, 28, 0.01) 100%)'
    }}>
      {/* Properties Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(3, 1fr)'
        },
        gap: { xs: 3, sm: 4, md: 5 },
        justifyItems: 'center',
        alignItems: 'start',
        width: '100%',
        maxWidth: '1400px',
        mx: 'auto'
      }}>
        {properties.map((property, index) => (
          <PropertyCard 
            key={property._id}
            property={property}
            index={index}
            onClick={onPropertyClick}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PropertyList;

