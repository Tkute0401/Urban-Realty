'use client'

import React from 'react';
import { Box, Typography, Grid, Divider, Paper } from '@mui/material';
import { 
  KingBed, 
  Bathtub, 
  SquareFoot, 
  Apartment, 
  CalendarToday,
  Business,
  LocationOn,
  Home
} from '@mui/icons-material';

interface PropertyOverviewProps {
  property: any;
  sectionRef?: React.RefObject<HTMLDivElement>;
}

const PropertyOverview: React.FC<PropertyOverviewProps> = ({ property, sectionRef }) => {
  const overviewItems = [
    {
      icon: <KingBed sx={{ color: 'var(--color-primary)', fontSize: 32 }} />,
      label: 'Bedrooms',
      value: property.bedrooms || 0
    },
    {
      icon: <Bathtub sx={{ color: 'var(--color-primary)', fontSize: 32 }} />,
      label: 'Bathrooms',
      value: property.bathrooms || 0
    },
    {
      icon: <SquareFoot sx={{ color: 'var(--color-primary)', fontSize: 32 }} />,
      label: 'Area',
      value: `${property.area || 'N/A'} sqft`
    },
    {
      icon: <Apartment sx={{ color: 'var(--color-primary)', fontSize: 32 }} />,
      label: 'Type',
      value: property.type || 'N/A'
    },
    {
      icon: <Home sx={{ color: 'var(--color-primary)', fontSize: 32 }} />,
      label: 'Status',
      value: property.constructionStatus || property.status || 'N/A'
    },
    {
      icon: <CalendarToday sx={{ color: 'var(--color-primary)', fontSize: 32 }} />,
      label: 'Age',
      value: property.ageOfProperty ? `${property.ageOfProperty} years` : 'New'
    }
  ];

  return (
    <Paper 
      ref={sectionRef}
      id="section-overview"
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
          mb: 3
        }}
      >
        Property Overview
      </Typography>

      <Grid container spacing={3}>
        {overviewItems.map((item, index) => (
          <Grid item xs={6} sm={4} md={2} key={index}>
            <Box 
              textAlign="center"
              sx={{
                p: 2,
                borderRadius: 1,
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'var(--color-primary)',
                  backgroundColor: 'var(--color-surface-elevated)'
                }
              }}
            >
              <Box sx={{ mb: 1 }}>
                {item.icon}
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'var(--color-text)', 
                  fontWeight: 600,
                  fontSize: '1rem',
                  mb: 0.5
                }}
              >
                {item.value}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ color: 'var(--color-text-muted)' }}
              >
                {item.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ borderColor: 'var(--color-border)', my: 3 }} />

      {/* Property Description */}
      <Box>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: 'var(--color-primary)', 
            fontWeight: 600,
            mb: 2
          }}
        >
          Description
        </Typography>
        <Typography 
          variant="body1" 
          paragraph 
          sx={{ 
            color: 'var(--color-text)',
            lineHeight: 1.7
          }}
        >
          {property.description || 'No description available for this property.'}
        </Typography>
      </Box>

      {/* Additional Details */}
      {(property.buildingName || property.floorNumber) && (
        <Box sx={{ mt: 3 }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              color: 'var(--color-primary)', 
              fontWeight: 600,
              mb: 2
            }}
          >
            Building Information
          </Typography>
          <Grid container spacing={2}>
            {property.buildingName && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business sx={{ color: 'var(--color-primary)' }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                      Building Name
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--color-text)', fontWeight: 500 }}>
                      {property.buildingName}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
            {property.floorNumber && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Apartment sx={{ color: 'var(--color-primary)' }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                      Floor Number
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--color-text)', fontWeight: 500 }}>
                      {property.floorNumber}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Possession Date */}
      {property.possessionDate && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday sx={{ color: 'var(--color-primary)' }} />
            <Box>
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                Possession Date
              </Typography>
              <Typography variant="body1" sx={{ color: 'var(--color-text)', fontWeight: 500 }}>
                {new Date(property.possessionDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default PropertyOverview;