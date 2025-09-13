'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProperties } from '@/contexts/PropertiesContext';
import PropertyImageGallery from '@/components/property/PropertyImageGallery';
import PropertyMap from '@/components/property/PropertyMap';
import { formatPrice } from '@/lib/utils/format';
import { mockApiService } from '@/lib/services/mockApi';
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
        const response = await mockApiService.getProperty(id);
        setProperty(response.data);
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
        // Mock API doesn't have favorites endpoint yet, just toggle state
        console.log('Remove from favorites:', id);
      } else {
        // Mock API doesn't have favorites endpoint yet, just toggle state
        console.log('Add to favorites:', id);
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
    <Box sx={{ bgcolor: 'var(--color-bg-dark)', color: 'var(--color-text-inverse)', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Property Images */}
            <Paper sx={{ mb: 4, bgcolor: 'var(--color-bg-secondary)', border: '1px solid var(--color-primary)' }}>
              <PropertyImageGallery images={property.images || [property.image]} />
            </Paper>

            {/* Property Header */}
            <Paper sx={{ p: 3, mb: 4, bgcolor: 'var(--color-bg-secondary)', border: '1px solid var(--color-primary)' }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'var(--color-primary)' }}>
                    {property.title || property.location}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationOn sx={{ color: 'var(--color-primary)', mr: 1 }} />
                    <Typography variant="body1">{property.location}</Typography>
                  </Box>
                </Box>
                <IconButton onClick={handleFavoriteToggle} sx={{ color: isFavorite ? 'var(--color-error)' : 'var(--color-primary)' }}>
                  {isFavorite ? <HeartFilled /> : <HeartOutline />}
                </IconButton>
              </Box>

              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="h5" sx={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                  {formatPrice(property.price)}
                </Typography>
                <Chip 
                  label={property.type || 'For Sale'} 
                  sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-bg-dark)' }} 
                />
              </Box>

              <Divider sx={{ borderColor: 'var(--color-primary)', mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <KingBed sx={{ color: 'var(--color-primary)', fontSize: 32, mb: 1 }} />
                    <Typography variant="body2">{property.beds || 0} Bed</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Bathtub sx={{ color: 'var(--color-primary)', fontSize: 32, mb: 1 }} />
                    <Typography variant="body2">{property.baths || 0} Bath</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <SquareFoot sx={{ color: 'var(--color-primary)', fontSize: 32, mb: 1 }} />
                    <Typography variant="body2">{property.sqft || 'N/A'} sqft</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Apartment sx={{ color: 'var(--color-primary)', fontSize: 32, mb: 1 }} />
                    <Typography variant="body2">{property.propertyType || 'N/A'}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Property Description */}
            <Paper sx={{ p: 3, mb: 4, bgcolor: 'var(--color-bg-secondary)', border: '1px solid var(--color-primary)' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)' }}>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {property.description || 'No description available.'}
              </Typography>
            </Paper>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Paper sx={{ p: 3, mb: 4, bgcolor: 'var(--color-bg-secondary)', border: '1px solid var(--color-primary)' }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)' }}>
                  Amenities
                </Typography>
                <Grid container spacing={1}>
                  {property.amenities.map((amenity, index) => (
                    <Grid item key={index}>
                      <Chip 
                        label={amenity} 
                        sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-bg-dark)' }} 
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}

            {/* Nearby Places */}
            <Paper sx={{ p: 3, mb: 4, bgcolor: 'var(--color-bg-secondary)', border: '1px solid var(--color-primary)' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)' }}>
                Nearby Places
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <School sx={{ color: 'var(--color-primary)', mr: 1 }} />
                    <Typography variant="body2">Schools nearby</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocalHospital sx={{ color: 'var(--color-primary)', mr: 1 }} />
                    <Typography variant="body2">Hospitals nearby</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <ShoppingCart sx={{ color: 'var(--color-primary)', mr: 1 }} />
                    <Typography variant="body2">Shopping centers</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Park sx={{ color: 'var(--color-primary)', mr: 1 }} />
                    <Typography variant="body2">Parks nearby</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Map */}
            <Paper sx={{ p: 3, mb: 4, bgcolor: 'var(--color-bg-secondary)', border: '1px solid var(--color-primary)' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)' }}>
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
            <Paper sx={{ p: 3, bgcolor: 'var(--color-bg-secondary)', border: '1px solid var(--color-primary)', position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)' }}>
                Contact Agent
              </Typography>
              
              {property.agent && (
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-bg-dark)', mr: 2 }}>
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
                  sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-bg-dark)', '&:hover': { bgcolor: 'var(--color-primary-hover)' } }}
                >
                  Call Agent
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Email />}
                  sx={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', '&:hover': { borderColor: 'var(--color-primary-hover)' } }}
                >
                  Email Agent
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<WhatsApp />}
                  sx={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', '&:hover': { borderColor: 'var(--color-primary-hover)' } }}
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