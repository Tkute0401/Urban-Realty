import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Collapse,
  Rating,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Restaurant as RestaurantIcon,
  School as SchoolIcon,
  LocalHospital as HospitalIcon,
  ShoppingCart as ShoppingIcon,
  Park as ParkIcon,
  DirectionsTransit as TransitIcon,
  FitnessCenter as GymIcon,
  AccountBalance as BankIcon,
  LocalGasStation as GasIcon,
  LocalPharmacy as PharmacyIcon,
} from '@mui/icons-material';
import { mockLocationServicesAPI } from '../../lib/mock-data/location-services';

// Icon mapping for amenity types
const amenityIcons = {
  restaurant: RestaurantIcon,
  school: SchoolIcon,
  hospital: HospitalIcon,
  shopping: ShoppingIcon,
  park: ParkIcon,
  transit: TransitIcon,
  gym: GymIcon,
  bank: BankIcon,
  gas_station: GasIcon,
  pharmacy: PharmacyIcon,
};

// Color mapping for amenity types
const amenityColors = {
  restaurant: 'var(--color-primary-orange)',
  school: 'var(--color-primary-blue)',
  hospital: 'var(--color-error)',
  shopping: 'var(--color-primary-orange)',
  park: 'var(--color-success)',
  transit: 'var(--color-primary-blue)',
  gym: 'var(--color-warning)',
  bank: 'var(--color-info)',
  gas_station: 'var(--color-text-secondary)',
  pharmacy: 'var(--color-success)',
};

const NearbyAmenities = ({ coordinates, radius = 2000 }) => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);

  useEffect(() => {
    if (coordinates && coordinates.lat && coordinates.lng) {
      loadAmenities();
    }
  }, [coordinates, radius]);

  const loadAmenities = async () => {
    try {
      setLoading(true);
      
      // Get nearby amenities
      const amenitiesResponse = await mockLocationServicesAPI.getNearbyAmenities(coordinates, radius);
      if (amenitiesResponse.success) {
        setAmenities(amenitiesResponse.amenities);
      }
      
      // Get location info with walkability scores
      const locationResponse = await mockLocationServicesAPI.getLocationInfo(coordinates);
      if (locationResponse.success) {
        setLocationInfo(locationResponse.locationInfo);
      }
    } catch (error) {
      console.error('Error loading amenities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${distance}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const getAmenityIcon = (type) => {
    const IconComponent = amenityIcons[type] || ShoppingIcon;
    return <IconComponent sx={{ fontSize: 20 }} />;
  };

  const getAmenityColor = (type) => {
    return amenityColors[type] || 'var(--color-text-secondary)';
  };

  if (loading) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Nearby Amenities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Loading nearby amenities...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!amenities || amenities.length === 0) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Nearby Amenities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No nearby amenities found within {formatDistance(radius)}.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Group amenities by type
  const groupedAmenities = amenities.reduce((acc, amenity) => {
    if (!acc[amenity.type]) {
      acc[amenity.type] = [];
    }
    acc[amenity.type].push(amenity);
    return acc;
  }, {});

  // Sort amenities by distance within each group
  Object.keys(groupedAmenities).forEach(type => {
    groupedAmenities[type].sort((a, b) => a.distance - b.distance);
  });

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Nearby Amenities
          </Typography>
          <IconButton onClick={handleExpandClick}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        {/* Walkability Scores */}
        {locationInfo && (
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h6" color="var(--color-primary-blue)">
                    {locationInfo.walkScore}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Walk Score
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h6" color="var(--color-primary-orange)">
                    {locationInfo.transitScore}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Transit Score
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h6" color="var(--color-success)">
                    {locationInfo.bikeScore}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Bike Score
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Amenity Types Summary */}
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Amenity Types ({Object.keys(groupedAmenities).length})
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {Object.keys(groupedAmenities).map(type => (
              <Chip
                key={type}
                icon={getAmenityIcon(type)}
                label={`${type} (${groupedAmenities[type].length})`}
                size="small"
                sx={{
                  backgroundColor: getAmenityColor(type),
                  color: 'white',
                  '& .MuiChip-icon': {
                    color: 'white',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        <Collapse in={expanded}>
          <Divider sx={{ mb: 2 }} />
          
          {/* Detailed Amenities List */}
          {Object.entries(groupedAmenities).map(([type, typeAmenities]) => (
            <Box key={type} mb={3}>
              <Typography variant="subtitle1" gutterBottom sx={{ 
                color: getAmenityColor(type),
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                {getAmenityIcon(type)}
                {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')} ({typeAmenities.length})
              </Typography>
              
              <Grid container spacing={2}>
                {typeAmenities.map(amenity => (
                  <Grid item xs={12} sm={6} md={4} key={amenity.id}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {amenity.name}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {amenity.address}
                        </Typography>
                        
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistance(amenity.distance)}
                          </Typography>
                          {amenity.rating && (
                            <Rating 
                              value={amenity.rating} 
                              readOnly 
                              size="small"
                              precision={0.1}
                            />
                          )}
                        </Box>
                        
                        {amenity.description && (
                          <Typography variant="caption" color="text.secondary">
                            {amenity.description}
                          </Typography>
                        )}
                        
                        {amenity.phone && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            📞 {amenity.phone}
                          </Typography>
                        )}
                        
                        {amenity.hours && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            🕒 {amenity.hours}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default NearbyAmenities;