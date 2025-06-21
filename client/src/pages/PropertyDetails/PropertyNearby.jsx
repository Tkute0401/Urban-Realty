import { Box, Typography, Grid } from '@mui/material';
import {
  School,
  LocalHospital,
  ShoppingCart,
  Park,
  DirectionsBus
} from '@mui/icons-material';
import PremiumPaper from './PremiumPaper';
import SectionHeader from './SectionHeader';

const PropertyNearby = ({ property, aroundRef }) => {
  if (!property.nearbyLocalities) return null;

  const { hasSchool, school, hasHospital, hospital, hasMall, mall, hasPark, park, hasTransport, transport } = property.nearbyLocalities;

  return (
    <Box ref={aroundRef} sx={{ mb: 6 }}>
      <SectionHeader variant="h4">Nearby Localities</SectionHeader>
      <PremiumPaper>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#78CADC' }}>
          What's Around This Property
        </Typography>
        
        <Grid container spacing={3}>
          {hasSchool && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 2,
                backgroundColor: 'rgba(120, 202, 220, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(120, 202, 220, 0.3)'
              }}>
                <School sx={{ color: '#78CADC', mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
                    School Nearby
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {school || 'School within walking distance'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
          
          {hasHospital && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 2,
                backgroundColor: 'rgba(120, 202, 220, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(120, 202, 220, 0.3)'
              }}>
                <LocalHospital sx={{ color: '#78CADC', mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
                    Hospital Nearby
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {hospital || 'Hospital within 2km'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
          
          {hasMall && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 2,
                backgroundColor: 'rgba(120, 202, 220, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(120, 202, 220, 0.3)'
              }}>
                <ShoppingCart sx={{ color: '#78CADC', mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
                    Shopping Mall
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {mall || 'Shopping mall nearby'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
          
          {hasPark && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 2,
                backgroundColor: 'rgba(120, 202, 220, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(120, 202, 220, 0.3)'
              }}>
                <Park sx={{ color: '#78CADC', mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
                    Park Nearby
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {park || 'Public park in the vicinity'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
          
          {hasTransport && (
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 2,
                backgroundColor: 'rgba(120, 202, 220, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(120, 202, 220, 0.3)'
              }}>
                <DirectionsBus sx={{ color: '#78CADC', mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
                    Public Transport
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {transport || 'Public transport options available nearby'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </PremiumPaper>
    </Box>
  );
};

export default PropertyNearby;