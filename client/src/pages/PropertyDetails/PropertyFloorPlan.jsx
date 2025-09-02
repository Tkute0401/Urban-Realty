import { Box, Typography } from '@mui/material';
import PremiumPaper from './PremiumPaper';
import SectionHeader from './SectionHeader';

const PropertyFloorPlan = ({ property, floorplanRef }) => {
  return (
    <Box ref={floorplanRef} sx={{ mb: 6 }}>
      <SectionHeader variant="h4">Floor Plan</SectionHeader>
      <PremiumPaper>
        {property.floorPlan ? (
          <Box sx={{ textAlign: 'center' }}>
            <img 
              src={property.floorPlan} 
              alt="Floor Plan" 
              className="w-100 h-auto"
            />
          </Box>
        ) : (
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Floor plan images will be displayed here when available.
          </Typography>
        )}
      </PremiumPaper>
    </Box>
  );
};

export default PropertyFloorPlan;