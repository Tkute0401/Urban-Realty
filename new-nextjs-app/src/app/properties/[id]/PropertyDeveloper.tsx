'use client';

import { Box, Typography, Paper, Avatar, Stack, Button, Chip } from '@mui/material';
import { Business, Star, LocationOn } from '@mui/icons-material';
import SectionHeader from './SectionHeader';

interface Property {
  developer?: {
    _id: string;
    name: string;
    logo: string;
    description?: string;
    rating?: number;
    projectsCompleted?: number;
    establishedYear?: number;
    address?: string;
  };
}

interface PropertyDeveloperProps {
  property: Property;
}

const PropertyDeveloper = ({ property }: PropertyDeveloperProps) => {
  if (!property.developer) {
    return (
      <Box>
        <SectionHeader 
          title="Developer Information" 
          subtitle="About the property developer"
        />
        
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Developer information is not available for this property.
          </Typography>
        </Paper>
      </Box>
    );
  }

  const { developer } = property;

  return (
    <Box>
      <SectionHeader 
        title="Developer Information" 
        subtitle="About the property developer"
      />
      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
          <Avatar
            src={developer.logo}
            alt={developer.name}
            sx={{ 
              width: 80, 
              height: 80,
              backgroundColor: 'primary.main'
            }}
          >
            <Business sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {developer.name}
            </Typography>
            
            {developer.description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {developer.description}
              </Typography>
            )}
            
            <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
              {developer.rating && (
                <Chip
                  icon={<Star />}
                  label={`${developer.rating}/5 Rating`}
                  color="warning"
                  variant="outlined"
                />
              )}
              
              {developer.projectsCompleted && (
                <Chip
                  label={`${developer.projectsCompleted} Projects`}
                  color="primary"
                  variant="outlined"
                />
              )}
              
              {developer.establishedYear && (
                <Chip
                  label={`Est. ${developer.establishedYear}`}
                  color="info"
                  variant="outlined"
                />
              )}
            </Stack>
            
            {developer.address && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {developer.address}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Button
            variant="outlined"
            color="primary"
            sx={{ alignSelf: 'flex-start' }}
          >
            View All Projects
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default PropertyDeveloper;
