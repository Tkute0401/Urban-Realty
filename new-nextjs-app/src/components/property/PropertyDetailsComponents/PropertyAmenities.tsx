'use client'

import React from 'react';
import { Box, Typography, Paper, Grid, Chip } from '@mui/material';
import { 
  Pool,
  LocalParking,
  FitnessCenter,
  Security,
  Spa,
  Balcony,
  Wifi,
  AcUnit,
  Chair,
  Pets,
  Elevator,
  LocalLaundryService,
  Storage,
  MeetingRoom,
  Kitchen
} from '@mui/icons-material';

interface PropertyAmenitiesProps {
  property: any;
  sectionRef?: React.RefObject<HTMLDivElement>;
}

const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({ property, sectionRef }) => {
  const amenities = Array.isArray(property.amenities) ? property.amenities : [];

  // Amenity icons mapping
  const amenityIconMap: Record<string, React.ReactNode> = {
    'Parking': <LocalParking sx={{ color: 'var(--color-primary)', fontSize: 24 }} />,
    'Swimming Pool': <Pool sx={{ color: 'var(--color-primary)', fontSize: 24 }} />,
    'Gym': <FitnessCenter sx={{ color: 'var(--color-primary)', fontSize: 24 }} />,
    'Security': <Security sx={{ color: 'var(--color-primary)', fontSize: 24 }} />,
    'Garden': <Spa sx={{ color: 'var(--color-primary)', fontSize: 24 }} />,
    'Balcony': <Balcony sx={{ color: 'var(--color-primary)', fontSize: 24 }} />,
    'WiFi': <Wifi sx={{ color: 'var(--color-primary)', fontSize: 24 }} />,
    'Air Conditioning': <AcUnit sx={{ color: 'var(--color-primary)', fontSize: 24 }} />,
    'Furnished': <Chair sx={{ color: 'var(--color-primary)', fontSize: 24 }} />,
    'Pet Friendly': <Pets sx={{ color: 'var(--color-primary)', fontSize: 24 }} />,
    'Elevator': <Elevator sx={{ color: 'var(--color-primary)', fontSize: 24 }} />,
    'Laundry': <LocalLaundryService sx={{ color: 'var(--color-primary)', fontSize: 24 }} />,
    'Storage': <Storage sx={{ color: 'var(--color-primary)', fontSize: 24 }} />,
    'Conference Room': <MeetingRoom sx={{ color: 'var(--color-primary)', fontSize: 24 }} />,
    'Kitchen': <Kitchen sx={{ color: 'var(--color-primary)', fontSize: 24 }} />
  };

  // Get default icon for unknown amenities
  const getAmenityIcon = (amenity: string) => {
    return amenityIconMap[amenity] || <Pool sx={{ color: 'var(--color-primary)', fontSize: 24 }} />;
  };

  // Get color based on amenity type
  const getAmenityColor = (amenity: string) => {
    const colorMap: Record<string, string> = {
      'Swimming Pool': '#2196F3',
      'Gym': '#4CAF50',
      'Security': '#FF5722',
      'Parking': '#9C27B0',
      'WiFi': '#00BCD4',
      'Air Conditioning': '#03DAC6',
      'Garden': '#8BC34A',
      'Balcony': '#FFC107',
      'Furnished': '#FF9800',
      'Pet Friendly': '#E91E63',
      'Elevator': '#607D8B',
      'Laundry': '#3F51B5',
      'Storage': '#795548',
      'Conference Room': '#009688',
      'Kitchen': '#F44336'
    };
    return colorMap[amenity] || 'var(--color-primary)';
  };

  return (
    <Paper 
      ref={sectionRef}
      id="section-amenities"
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
        <Pool sx={{ color: 'var(--color-primary)' }} />
        Amenities
      </Typography>

      {amenities.length > 0 ? (
        <Grid container spacing={2}>
          {amenities.map((amenity: string, index: number) => {
            const amenityColor = getAmenityColor(amenity);
            
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Box 
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    '&:hover': {
                      borderColor: amenityColor,
                      backgroundColor: 'var(--color-surface-elevated)',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${amenityColor}20`
                    }
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: `${amenityColor}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 40,
                      height: 40
                    }}
                  >
                    {getAmenityIcon(amenity)}
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'var(--color-text)',
                      fontWeight: 500,
                      flex: 1
                    }}
                  >
                    {amenity}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box 
          sx={{ 
            textAlign: 'center',
            py: 6,
            px: 2
          }}
        >
          <Pool 
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
            No amenities information available for this property.
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--color-text-muted)',
              fontSize: '0.875rem'
            }}
          >
            Contact the agent for detailed amenity information.
          </Typography>
        </Box>
      )}

      {/* Summary if many amenities */}
      {amenities.length > 0 && (
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid var(--color-border)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography 
              variant="body2" 
              sx={{ color: 'var(--color-text-muted)' }}
            >
              This property offers
            </Typography>
            <Chip 
              label={`${amenities.length} amenities`}
              size="small"
              sx={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-contrast)',
                fontWeight: 600
              }} 
            />
            <Typography 
              variant="body2" 
              sx={{ color: 'var(--color-text-muted)' }}
            >
              for your comfort and convenience.
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default PropertyAmenities;