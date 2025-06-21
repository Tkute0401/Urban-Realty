import { Box, Typography, Grid } from '@mui/material';
import PremiumPaper from './PremiumPaper';
import SectionHeader from './SectionHeader';
import {
  LocalParking, Pool, FitnessCenter, Security, Spa,
  Balcony, Wifi, AcUnit, Chair, Pets, Elevator,
  LocalLaundryService, Storage, MeetingRoom, Kitchen
} from '@mui/icons-material';

// Amenities with icons mapping
const amenitiesConfig = [
  { name: 'Parking', icon: <LocalParking /> },
  { name: 'Swimming Pool', icon: <Pool /> },
  { name: 'Gym', icon: <FitnessCenter /> },
  { name: 'Security', icon: <Security /> },
  { name: 'Garden', icon: <Spa /> },
  { name: 'Balcony', icon: <Balcony /> },
  { name: 'WiFi', icon: <Wifi /> },
  { name: 'Air Conditioning', icon: <AcUnit /> },
  { name: 'Furnished', icon: <Chair /> },
  { name: 'Pet Friendly', icon: <Pets /> },
  { name: 'Elevator', icon: <Elevator /> },
  { name: 'Laundry', icon: <LocalLaundryService /> },
  { name: 'Storage', icon: <Storage /> },
  { name: 'Conference Room', icon: <MeetingRoom /> },
  { name: 'Kitchen', icon: <Kitchen /> }
];

const PropertyAmenities = ({ property, amenitiesRef }) => {
  // Find the icon for each amenity
  const getAmenityIcon = (amenityName) => {
    const amenityConfig = amenitiesConfig.find(a => a.name === amenityName);
    return amenityConfig ? amenityConfig.icon : null;
  };

  return (
    <Box ref={amenitiesRef} sx={{ mb: 6 }}>
      <SectionHeader variant="h4">Amenities</SectionHeader>
      <PremiumPaper>
        <Grid container spacing={3}>
          {property.amenities?.map((amenity, index) => {
            const amenityIcon = getAmenityIcon(amenity);
            
            return (
              <Grid item xs={6} sm={4} key={index}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(120, 202, 220, 0.1)',
                  border: '1px solid rgba(120, 202, 220, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(120, 202, 220, 0.2)'
                  }
                }}>
                  <Box sx={{ 
                    color: '#78CADC', 
                    mr: 1.5,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {amenityIcon || null}
                  </Box>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>{amenity}</Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </PremiumPaper>
    </Box>
  );
};

export default PropertyAmenities;