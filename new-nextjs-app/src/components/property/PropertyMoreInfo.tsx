'use client';

import React, { forwardRef } from 'react';
import { Box, Typography, Grid, Divider, Card, IconButton } from '@mui/material';
import { VideoLibrary, PlayArrow } from '@mui/icons-material';
import PremiumPaper from './PremiumPaper';
import SectionHeader from './SectionHeader';

interface Property {
  description?: string;
  projectDetails?: {
    projectArea?: string;
    totalUnits?: string;
    launchDate?: string;
    reraId?: string;
    configurations?: string;
  };
  virtualTour?: {
    url: string;
    type?: string;
  };
}

interface PropertyMoreInfoProps {
  property: Property;
}

const PropertyMoreInfo = forwardRef<HTMLDivElement, PropertyMoreInfoProps>(({ property }, ref) => {
  return (
    <Box ref={ref} sx={{ mb: 6 }}>
      <SectionHeader variant="h4">More About Project</SectionHeader>
      <PremiumPaper>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'var(--color-primary)' }}>
          Project Details
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {property.projectDetails?.projectArea && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={{ color: 'var(--color-primary)' }}>Project Area</Typography>
              <Typography sx={{ color: 'var(--color-text-primary)' }}>
                {property.projectDetails.projectArea} acres
              </Typography>
            </Grid>
          )}
          
          {property.projectDetails?.totalUnits && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={{ color: 'var(--color-primary)' }}>Total Units</Typography>
              <Typography sx={{ color: 'var(--color-text-primary)' }}>
                {property.projectDetails.totalUnits}
              </Typography>
            </Grid>
          )}
          
          {property.projectDetails?.launchDate && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={{ color: 'var(--color-primary)' }}>Launch Date</Typography>
              <Typography sx={{ color: 'var(--color-text-primary)' }}>
                {new Date(property.projectDetails.launchDate).toLocaleDateString()}
              </Typography>
            </Grid>
          )}
          
          {property.projectDetails?.reraId && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={{ color: 'var(--color-primary)' }}>RERA ID</Typography>
              <Typography sx={{ color: 'var(--color-text-primary)' }}>
                {property.projectDetails.reraId}
              </Typography>
            </Grid>
          )}
          
          {property.projectDetails?.configurations && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={{ color: 'var(--color-primary)' }}>Configurations</Typography>
              <Typography sx={{ color: 'var(--color-text-primary)' }}>
                {property.projectDetails.configurations}
              </Typography>
            </Grid>
          )}
        </Grid>
        
        <Divider sx={{ my: 3, borderColor: 'var(--color-border)' }} />
        
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'var(--color-primary)' }}>
          Property Description
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            whiteSpace: 'pre-line',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'var(--color-text-primary)'
          }}
        >
          {property.description}
        </Typography>
      </PremiumPaper>

      {/* Virtual Tour Section */}
      {property.virtualTour && property.virtualTour.url && (
        <PremiumPaper sx={{ mt: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'var(--color-primary)' }}>
            Virtual Tour
          </Typography>
          <Card 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              p: 2,
              cursor: 'pointer',
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              '&:hover': {
                backgroundColor: 'var(--color-primary-20)',
                transition: 'background-color 0.3s ease'
              }
            }}
            onClick={() => window.open(property.virtualTour!.url, '_blank')}
          >
            <VideoLibrary sx={{ color: 'var(--color-primary)', mr: 2, fontSize: 40 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {property.virtualTour.type === '3d' ? '360° Virtual Tour' : 'Video Tour'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                Click to view in new window
              </Typography>
            </Box>
            <IconButton sx={{ color: 'var(--color-primary)' }}>
              <PlayArrow fontSize="large" />
            </IconButton>
          </Card>
        </PremiumPaper>
      )}
    </Box>
  );
});

PropertyMoreInfo.displayName = 'PropertyMoreInfo';

export default PropertyMoreInfo;
