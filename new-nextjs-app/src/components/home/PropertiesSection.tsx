'use client';

import React, { useEffect } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useProperties } from '@/contexts/PropertiesContext';
import PropertyList from '../property/PropertyList';

const PropertiesSection: React.FC = () => {
  const router = useRouter();
  const { featuredProperties, loading, error, getFeaturedProperties } = useProperties();

  useEffect(() => {
    getFeaturedProperties();
  }, [getFeaturedProperties]);

  return (
    <Box
      component="section"
      sx={{
        py: 8,
        pt: { xs: 12, sm: 10, md: 8 }, // Extra top padding on mobile to account for search bar
        background: 'var(--color-bg)',
        borderTop: '1px solid var(--color-border)'
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 'bold',
                color: 'var(--color-text-primary)',
                mb: 1,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Featured Properties
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'var(--color-text-muted)',
                maxWidth: 600
              }}
            >
              Explore our handpicked selection of premium properties
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => router.push('/properties')}
            sx={{
              background: 'var(--color-primary)',
              color: 'var(--color-primary-contrast)',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              '&:hover': {
                background: 'var(--color-primary-hover)',
              }
            }}
          >
            View All Properties
          </Button>
        </Box>

        <PropertyList
          properties={featuredProperties}
          loading={loading}
          error={error}
          emptyMessage="No featured properties available at the moment"
          columns={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          onPropertyClick={(property) => router.push(`/properties/${property._id}`)}
        />
      </Container>
    </Box>
  );
};

export default PropertiesSection;

