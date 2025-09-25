'use client'

import React from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartFilled } from "@heroicons/react/24/solid";
import { LocationOn } from '@mui/icons-material';
import { formatPrice } from '@/lib/utils/format';

interface PropertyHeaderProps {
  property: any;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  property,
  isFavorite,
  onFavoriteToggle
}) => {
  return (
    <Box>
      {/* Property Title and Favorite */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              color: 'var(--color-primary)', 
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}
          >
            {property.title || property.address?.street || property.address?.city}
          </Typography>
          
          <Box display="flex" alignItems="center" mb={2}>
            <LocationOn sx={{ color: 'var(--color-primary)', mr: 1 }} />
            <Typography variant="body1" sx={{ color: 'var(--color-text)' }}>
              {property.address ? 
                `${property.address.street || ''}, ${property.address.city || ''}, ${property.address.state || ''}`.replace(/^,\s*|,\s*$/g, '') 
                : 'Location not specified'
              }
            </Typography>
          </Box>
        </Box>
        
        <IconButton 
          onClick={onFavoriteToggle} 
          sx={{ 
            color: isFavorite ? 'var(--color-error)' : 'var(--color-primary)',
            '&:hover': {
              backgroundColor: 'rgba(247, 107, 28, 0.1)'
            }
          }}
        >
          {isFavorite ? 
            <HeartFilled className="w-6 h-6" /> : 
            <HeartOutline className="w-6 h-6" />
          }
        </IconButton>
      </Box>

      {/* Price and Status */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'var(--color-primary)', 
            fontWeight: 'bold',
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}
        >
          {formatPrice(property.price)}
        </Typography>
        
        <Chip 
          label={property.status || 'For Sale'} 
          sx={{ 
            bgcolor: 'var(--color-primary)', 
            color: 'var(--color-primary-contrast)',
            fontWeight: 600
          }} 
        />
        
        {property.featured && (
          <Chip 
            label="Featured" 
            sx={{ 
              bgcolor: 'var(--color-warning)', 
              color: 'var(--color-bg-dark)',
              fontWeight: 600
            }} 
          />
        )}
      </Box>
    </Box>
  );
};

export default PropertyHeader;