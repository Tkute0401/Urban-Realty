'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProperties } from '@/contexts/PropertiesContext';
import PropertyImageGallery from '@/components/property/PropertyImageGallery';
import PropertyMap from '@/components/property/PropertyMap';
import { formatPrice } from '@/lib/utils/format';
import axios from '@/lib/services/axios';
import { 
  Box, Typography, Grid, Divider, Chip, Button, Paper, 
  CircularProgress, Alert, IconButton, Stack, Avatar, Container
} from '@mui/material';
import { 
  LocationOn, KingBed, Bathtub, SquareFoot, 
  Phone, Email, WhatsApp, Apartment, Check, Close,
  School, LocalHospital, ShoppingCart, Park, DirectionsBus
} from '@mui/icons-material';
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartFilled } from "@heroicons/react/24/solid";

const PropertyDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { properties, loading, error } = useProperties();
  
  const [property, setProperty] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [errorProperty, setErrorProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoadingProperty(true);
        const response = await axios.get(`/api/properties/${id}`);
        setProperty(response.data.data);
      } catch (err) {
        console.error('Error fetching property:', err);
        setErrorProperty('Failed to load property details');
      } finally {
        setLoadingProperty(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`/api/auth/favorites/${id}`);
      } else {
        await axios.put(`/api/auth/favorites/${id}`);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (loadingProperty) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (errorProperty || !property) {
    return (
      <Box p={4}>
        <Alert severity="error">
          {errorProperty || 'Property not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#0c0d0e', color: 'white', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Property Images */}
            <Paper sx={{ mb: 4, bgcolor: '#1a1a1a', border: '1px solid #78CADC' }}>
              <PropertyImageGallery images={property.images || [property.image]} />
            </Paper>

            {/* Property Header */}
            <Paper sx={{ p: 3, mb: 4, bgcolor: '#1a1a1a', border: '1px solid #78CADC' }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#78CADC' }}>
                    {property.title || property.location}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationOn sx={{ color: '#78CADC', mr: 1 }} />
                    <Typography variant="body1">{property.location}</Typography>
                  </Box>
                </Box>
                <IconButton onClick={handleFavoriteToggle} sx={{ color: isFavorite ? '#ff6b6b' : '#78CADC' }}>
                  {isFavorite ? <HeartFilled /> : <HeartOutline />}
                </IconButton>
              </Box>

              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="h5" sx={{ color: '#78CADC', fontWeight: 'bold' }}>
                  {formatPrice(property.price)}
                </Typography>
                <Chip 
                  label={property.type || 'For Sale'} 
                  sx={{ bgcolor: '#78CADC', color: '#0c0d0e' }} 
                />
              </Box>

              <Divider sx={{ borderColor: '#78CADC', mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <KingBed sx={{ color: '#78CADC', fontSize: 32, mb: 1 }} />
                    <Typography variant="body2">{property.beds || 0} Bed</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Bathtub sx={{ color: '#78CADC', fontSize: 32, mb: 1 }} />
                    <Typography variant="body2">{property.baths || 0} Bath</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <SquareFoot sx={{ color: '#78CADC', fontSize: 32, mb: 1 }} />
                    <Typography variant="body2">{property.sqft || 'N/A'} sqft</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Apartment sx={{ color: '#78CADC', fontSize: 32, mb: 1 }} />
                    <Typography variant="body2">{property.propertyType || 'N/A'}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Property Description */}
            <Paper sx={{ p: 3, mb: 4, bgcolor: '#1a1a1a', border: '1px solid #78CADC' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#78CADC' }}>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {property.description || 'No description available.'}
              </Typography>
            </Paper>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Paper sx={{ p: 3, mb: 4, bgcolor: '#1a1a1a', border: '1px solid #78CADC' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#78CADC' }}>
                  Amenities
                </Typography>
                <Grid container spacing={1}>
                  {property.amenities.map((amenity, index) => (
                    <Grid item key={index}>
                      <Chip 
                        label={amenity} 
                        sx={{ bgcolor: '#78CADC', color: '#0c0d0e' }} 
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}

            {/* Nearby Places */}
            <Paper sx={{ p: 3, mb: 4, bgcolor: '#1a1a1a', border: '1px solid #78CADC' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#78CADC' }}>
                Nearby Places
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <School sx={{ color: '#78CADC', mr: 1 }} />
                    <Typography variant="body2">Schools nearby</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocalHospital sx={{ color: '#78CADC', mr: 1 }} />
                    <Typography variant="body2">Hospitals nearby</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <ShoppingCart sx={{ color: '#78CADC', mr: 1 }} />
                    <Typography variant="body2">Shopping centers</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Park sx={{ color: '#78CADC', mr: 1 }} />
                    <Typography variant="body2">Parks nearby</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Map */}
            <Paper sx={{ p: 3, mb: 4, bgcolor: '#1a1a1a', border: '1px solid #78CADC' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#78CADC' }}>
                Location
              </Typography>
              <PropertyMap 
                location={{ coordinates: [property.longitude || 0, property.latitude || 0] }}
                address={property.location}
              />
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, bgcolor: '#1a1a1a', border: '1px solid #78CADC', position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#78CADC' }}>
                Contact Agent
              </Typography>
              
              {property.agent && (
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: '#78CADC', color: '#0c0d0e', mr: 2 }}>
                    {property.agent.name?.charAt(0) || 'A'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">{property.agent.name || 'Agent'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {property.agent.phone || 'No phone available'}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Phone />}
                  sx={{ bgcolor: '#78CADC', color: '#0c0d0e', '&:hover': { bgcolor: '#6bb6c7' } }}
                >
                  Call Agent
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Email />}
                  sx={{ borderColor: '#78CADC', color: '#78CADC', '&:hover': { borderColor: '#6bb6c7' } }}
                >
                  Email Agent
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<WhatsApp />}
                  sx={{ borderColor: '#78CADC', color: '#78CADC', '&:hover': { borderColor: '#6bb6c7' } }}
                >
                  WhatsApp
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PropertyDetails;