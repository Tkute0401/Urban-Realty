'use client'

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { Home } from '@mui/icons-material';
import { PropertyCard } from '@/components/ui';
import { api } from '@/lib/services/api';
import { useRouter } from 'next/navigation';

interface PropertySimilarProps {
  property: any;
  sectionRef?: React.RefObject<HTMLDivElement>;
}

const PropertySimilar: React.FC<PropertySimilarProps> = ({ property, sectionRef }) => {
  const [similarProperties, setSimilarProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSimilarProperties = async () => {
      try {
        setLoading(true);

        // Prefer backend-provided similarProperties (geospatial) if present
        if (Array.isArray(property?.similarProperties) && property.similarProperties.length > 0) {
          setSimilarProperties(property.similarProperties.slice(0, 4));
          setLoading(false);
          return;
        }
        
        // Fallback: try to find nearby properties based on location (city/state)
        const nearbySearchParams = {
          'address.city': property.address?.city,
          'address.state': property.address?.state,
          limit: 6
        };

        // Remove undefined values
        const filteredNearbyParams = Object.fromEntries(
          Object.entries(nearbySearchParams).filter(([_, value]) => value !== undefined)
        );

        let nearbyProperties: any[] = [];
        
        // Try to fetch nearby properties first
        if (Object.keys(filteredNearbyParams).length > 0) {
          try {
            const nearbyResponse = await api.properties.list(filteredNearbyParams);
            nearbyProperties = Array.isArray(nearbyResponse.data) ? nearbyResponse.data : [];

            // Filter out the current property
            nearbyProperties = nearbyProperties.filter((p: any) => p._id !== property._id);
          } catch (error) {
            console.error('Error fetching nearby properties:', error);
            nearbyProperties = [];
          }
        }

        // If no nearby properties found, try similar properties based on type and price
        if (nearbyProperties.length === 0) {
          const similarSearchParams = {
            type: property.type,
            minPrice: property.price ? Math.max(0, property.price * 0.8) : undefined,
            maxPrice: property.price ? property.price * 1.2 : undefined,
            bedrooms: property.bedrooms,
            limit: 6
          };

          // Remove undefined values
          const filteredSimilarParams = Object.fromEntries(
            Object.entries(similarSearchParams).filter(([_, value]) => value !== undefined)
          );

          try {
            const similarResponse = await api.properties.list(filteredSimilarParams);
            nearbyProperties = Array.isArray(similarResponse.data) ? similarResponse.data : [];

            // Filter out the current property
            nearbyProperties = nearbyProperties.filter((p: any) => p._id !== property._id);
          } catch (error) {
            console.error('Error fetching similar properties:', error);
            nearbyProperties = [];
          }
        }

        // If still no properties found, fetch featured properties as fallback
        if (nearbyProperties.length === 0) {
          try {
            const featuredResponse = await api.properties.featured();
            nearbyProperties = Array.isArray(featuredResponse.data) ? featuredResponse.data : [];

            // Filter out the current property
            nearbyProperties = nearbyProperties.filter((p: any) => p._id !== property._id);
          } catch (error) {
            console.error('Error fetching featured properties:', error);
            nearbyProperties = [];
          }
        }

        setSimilarProperties(nearbyProperties.slice(0, 4)); // Show max 4 properties
      } catch (error) {
        console.error('Error fetching similar properties:', error);
        setSimilarProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (property) {
      fetchSimilarProperties();
    }
  }, [property]);

  const handlePropertyClick = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  if (loading) {
    return (
      <Paper 
        ref={sectionRef}
        id="section-similar"
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
          <Home sx={{ color: 'var(--color-primary)' }} />
          Similar Properties
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: 'var(--color-primary)' }} />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper 
      ref={sectionRef}
      id="section-similar"
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
        <Home sx={{ color: 'var(--color-primary)' }} />
        Similar Properties
      </Typography>

      {similarProperties.length > 0 ? (
        <>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--color-text-muted)',
              mb: 3
            }}
          >
            Properties nearby or similar to this one. If no nearby properties are found, featured properties are shown instead.
          </Typography>
          
          <Grid container spacing={3}>
            {similarProperties.map((similarProperty, index) => (
              <Grid item xs={12} sm={6} key={similarProperty._id || index}>
                <Box
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}
                  onClick={() => handlePropertyClick(similarProperty._id)}
                >
                  <PropertyCard 
                    property={similarProperty} 
                    index={index}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          
          {similarProperties.length >= 4 && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'var(--color-text-muted)',
                  fontStyle: 'italic'
                }}
              >
                Showing {similarProperties.length} similar properties
              </Typography>
            </Box>
          )}
        </>
      ) : (
        <Box 
          sx={{ 
            textAlign: 'center',
            py: 6,
            px: 2
          }}
        >
          <Home 
            sx={{ 
              fontSize: 48,
              color: 'var(--color-text-muted)',
              mb: 2
            }} 
          />
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'var(--color-text-muted)',
              fontStyle: 'italic',
              mb: 2
            }}
          >
            No similar properties found at this time.
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--color-text-muted)',
              fontSize: '0.875rem'
            }}
          >
            Try browsing our full property listings to find other options.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default PropertySimilar;