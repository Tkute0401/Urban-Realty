'use client';

import { Box, Typography, Paper, Alert } from '@mui/material';
import SectionHeader from './SectionHeader';

interface Property {
  floorPlanImages?: Array<{
    url: string;
    publicId: string;
  }>;
}

interface PropertyFloorPlanProps {
  property: Property;
}

const PropertyFloorPlan = ({ property }: PropertyFloorPlanProps) => {
  if (!property.floorPlanImages || property.floorPlanImages.length === 0) {
    return (
      <Box>
        <SectionHeader 
          title="Floor Plan" 
          subtitle="Layout and floor plan details"
        />
        
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Alert severity="info">
            Floor plan images are not available for this property. 
            Please contact the agent for more information about the layout.
          </Alert>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <SectionHeader 
        title="Floor Plan" 
        subtitle="Layout and floor plan details"
      />
      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {property.floorPlanImages.map((image, index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <img
                src={image.url}
                alt={`Floor plan ${index + 1}`}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default PropertyFloorPlan;
