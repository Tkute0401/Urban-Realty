import { Box, Typography, Grid, Divider, Card, IconButton } from '@mui/material';
import { VideoLibrary, PlayArrow } from '@mui/icons-material';
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

      {/* Virtual Tour Section */}
      {property.virtualTour && property.virtualTour.url && (
        <PremiumPaper sx={{ mt: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#78CADC' }}>
            Virtual Tour
          </Typography>
          <Card 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              p: 2,
              cursor: 'pointer',
              backgroundColor: 'rgba(120, 202, 220, 0.1)',
              border: '1px solid rgba(120, 202, 220, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(120, 202, 220, 0.2)',
                transition: 'background-color 0.3s ease'
              }
            }}
            onClick={() => window.open(property.virtualTour.url, '_blank')}
          >
            <VideoLibrary sx={{ color: '#78CADC', mr: 2, fontSize: 40 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#fff' }}>
                {property.virtualTour.type === '3d' ? '360° Virtual Tour' : 'Video Tour'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Click to view in new window
              </Typography>
            </Box>
            <IconButton sx={{ color: '#78CADC' }}>
              <PlayArrow fontSize="large" />
            </IconButton>
          </Card>
        </PremiumPaper>
      )}
    </Box>
  );
};

export default PropertyMoreInfo;