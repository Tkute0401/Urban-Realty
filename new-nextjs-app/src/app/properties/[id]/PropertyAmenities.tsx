'use client';

import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
import { 
  LocalParking, 
  Pool, 
  FitnessCenter, 
  Security, 
  Yard, 
  Balcony, 
  Wifi, 
  AcUnit, 
  Chair, 
  Pets, 
  Elevator, 
  LocalLaundryService, 
  Storage, 
  MeetingRoom, 
  Kitchen,
  CheckCircle
} from '@mui/icons-material';
import SectionHeader from './SectionHeader';

interface Property {
  amenities: string[];
}

interface PropertyAmenitiesProps {
  property: Property;
}

const PropertyAmenities = ({ property }: PropertyAmenitiesProps) => {
  if (!property.amenities || property.amenities.length === 0) {
    return null;
  }

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      'Parking': <LocalParking />,
      'Swimming Pool': <Pool />,
      'Gym': <FitnessCenter />,
      'Security': <Security />,
      'Garden': <Yard />,
      'Balcony': <Balcony />,
      'WiFi': <Wifi />,
      'Air Conditioning': <AcUnit />,
      'Furnished': <Chair />,
      'Pet Friendly': <Pets />,
      'Elevator': <Elevator />,
      'Laundry': <LocalLaundryService />,
      'Storage': <Storage />,
      'Conference Room': <MeetingRoom />,
      'Kitchen': <Kitchen />
    };
    
    return iconMap[amenity] || <CheckCircle />;
  };

  return (
    <Box>
      <SectionHeader 
        title="Amenities" 
        subtitle="Facilities and features available in this property"
      />
      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          {property.amenities.map((amenity, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                p: 1.5,
                borderRadius: 1,
                backgroundColor: 'grey.50',
                '&:hover': {
                  backgroundColor: 'grey.100'
                }
              }}>
                <Box sx={{ color: 'primary.main' }}>
                  {getAmenityIcon(amenity)}
                </Box>
                <Typography variant="body1" fontWeight={500}>
                  {amenity}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default PropertyAmenities;
