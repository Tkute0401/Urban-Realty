import { Box, Typography, Grid, Divider } from '@mui/material';
import PremiumPaper from './PremiumPaper';
import SectionHeader from './SectionHeader';

const PropertyMoreInfo = ({ property, moreRef }) => {
  return (
    <Box ref={moreRef} sx={{ mb: 6 }}>
      <SectionHeader variant="h4">More About Project</SectionHeader>
      <PremiumPaper>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#78CADC' }}>
          Project Details
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {property.projectDetails?.projectArea && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={{ color: '#78CADC' }}>Project Area</Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                {property.projectDetails.projectArea} acres
              </Typography>
            </Grid>
          )}
          
          {property.projectDetails?.totalUnits && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={{ color: '#78CADC' }}>Total Units</Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                {property.projectDetails.totalUnits}
              </Typography>
            </Grid>
          )}
          
          {property.projectDetails?.launchDate && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={{ color: '#78CADC' }}>Launch Date</Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                {new Date(property.projectDetails.launchDate).toLocaleDateString()}
              </Typography>
            </Grid>
          )}
          
          {property.projectDetails?.reraId && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={{ color: '#78CADC' }}>RERA ID</Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                {property.projectDetails.reraId}
              </Typography>
            </Grid>
          )}
          
          {property.projectDetails?.configurations && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={{ color: '#78CADC' }}>Configurations</Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                {property.projectDetails.configurations}
              </Typography>
            </Grid>
          )}
        </Grid>
        
        <Divider sx={{ my: 3, borderColor: 'rgba(120, 202, 220, 0.3)' }} />
        
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#78CADC' }}>
          Property Description
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            whiteSpace: 'pre-line',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'rgba(255, 255, 255, 0.85)'
          }}
        >
          {property.description}
        </Typography>
      </PremiumPaper>
    </Box>
  );
};

export default PropertyMoreInfo;