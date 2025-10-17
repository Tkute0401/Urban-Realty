import React from 'react';
import { Grid, Box } from '@mui/material';
import PropertyCard from '../property/PropertyCard';

const FavoritesGrid = ({ items, onView }) => (
  <Box sx={{
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(3, 1fr)',
      xl: 'repeat(3, 1fr)'
    },
    gap: { xs: 3, sm: 4, md: 5 },
    justifyItems: 'center',
    alignItems: 'start',
    width: '100%',
    maxWidth: '1400px',
    mx: 'auto',
    px: { xs: 2, md: 3 },
    py: 6
  }}>
    {items.map((property, index) => (
      <PropertyCard
        key={property._id || property.id}
        property={property}
        index={index}
        onClick={() => onView(property._id || property.id)}
      />
    ))}
  </Box>
);

export default FavoritesGrid;

