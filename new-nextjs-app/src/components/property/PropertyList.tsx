'use client';

import React from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import PropertyCard from './PropertyCard';
import { Property } from '@/types/property';

interface PropertyListProps {
  properties: Property[];
  similarProperties?: Property[];
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
  similarProperties = [],
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
        alignItems: 'center',
        minHeight: '50vh',
        background: 'var(--color-bg)',
        p: 4,
        textAlign: 'center'
      }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: 'var(--color-text-primary)', mb: 2 }}>
            {emptyMessage}
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--color-text-muted)', mb: 2 }}>
            Try adjusting your search criteria or check back later for new listings.
          </Typography>
        </Box>
        
        {/* Similar Properties Section */}
        {similarProperties && similarProperties.length > 0 && (
          <Box sx={{ width: '100%', mt: 4 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'var(--color-primary)', 
                mb: 3,
                fontWeight: 600,
                textAlign: 'left',
                maxWidth: '1400px',
                mx: 'auto',
                px: { xs: 2, md: 4 }
              }}
            >
              You might also like:
            </Typography>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: (() => {
                const toCount = (val?: number) => (val ? Math.max(1, Math.floor(12 / val)) : undefined);
                const xs = toCount(columns?.xs) ?? 1;
                const sm = toCount(columns?.sm) ?? 2;
                const md = toCount(columns?.md) ?? 2;
                const lg = toCount(columns?.lg) ?? 3;
                const xl = toCount(columns?.xl) ?? 3;
                return {
                  xs: `repeat(${xs}, 1fr)`,
                  sm: `repeat(${sm}, 1fr)`,
                  md: `repeat(${md}, 1fr)`,
                  lg: `repeat(${lg}, 1fr)`,
                  xl: `repeat(${xl}, 1fr)`
                };
              })(),
              gap: { xs: 2, sm: 3, md: 4, lg: 5 },
              justifyItems: 'center',
              alignItems: 'start',
              width: '100%',
              maxWidth: '1400px',
              mx: 'auto',
              px: { xs: 1, sm: 2, md: 3 }
            }}>
              {similarProperties.map((property, index) => (
                <PropertyCard 
                  key={property._id}
                  property={property}
                  index={index}
                  onClick={onPropertyClick}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      px: { xs: 1, sm: 2, md: 3 },
      py: { xs: 4, sm: 6 },
      minHeight: '400px',
      overflow: 'visible',
      background: 'linear-gradient(135deg, var(--color-bg) 0%, rgba(247, 107, 28, 0.01) 100%)',
      '@media (max-width: 768px)': {
        px: 1,
        py: 3
      }
    }}>
      {/* Properties Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: (() => {
          const toCount = (val?: number) => (val ? Math.max(1, Math.floor(12 / val)) : undefined);
          const xs = toCount(columns?.xs) ?? 1;
          const sm = toCount(columns?.sm) ?? 2;
          const md = toCount(columns?.md) ?? 2;
          const lg = toCount(columns?.lg) ?? 3;
          const xl = toCount(columns?.xl) ?? 3;
          return {
            xs: `repeat(${xs}, 1fr)`,
            sm: `repeat(${sm}, 1fr)`,
            md: `repeat(${md}, 1fr)`,
            lg: `repeat(${lg}, 1fr)`,
            xl: `repeat(${xl}, 1fr)`
          };
        })(),
        gap: { xs: 2, sm: 3, md: 4, lg: 5 },
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

      {/* Similar Properties Section - Show even when there are results */}
      {similarProperties && similarProperties.length > 0 && (
        <Box sx={{ width: '100%', mt: 8 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'var(--color-primary)', 
              mb: 3,
              fontWeight: 600,
              textAlign: 'left',
              maxWidth: '1400px',
              mx: 'auto',
              px: { xs: 1, sm: 2, md: 3 }
            }}
          >
            You might also like:
          </Typography>
          
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: (() => {
              const toCount = (val?: number) => (val ? Math.max(1, Math.floor(12 / val)) : undefined);
              const xs = toCount(columns?.xs) ?? 1;
              const sm = toCount(columns?.sm) ?? 2;
              const md = toCount(columns?.md) ?? 2;
              const lg = toCount(columns?.lg) ?? 3;
              const xl = toCount(columns?.xl) ?? 3;
              return {
                xs: `repeat(${xs}, 1fr)`,
                sm: `repeat(${sm}, 1fr)`,
                md: `repeat(${md}, 1fr)`,
                lg: `repeat(${lg}, 1fr)`,
                xl: `repeat(${xl}, 1fr)`
              };
            })(),
            gap: { xs: 2, sm: 3, md: 4, lg: 5 },
            justifyItems: 'center',
            alignItems: 'start',
            width: '100%',
            maxWidth: '1400px',
            mx: 'auto'
          }}>
            {similarProperties.map((property, index) => (
              <PropertyCard 
                key={property._id}
                property={property}
                index={index}
                onClick={onPropertyClick}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PropertyList;

