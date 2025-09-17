'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProperties } from '@/contexts/PropertiesContext';
import PropertyImageGallery from '@/components/property/PropertyImageGallery';
import PropertyMap from '@/components/property/PropertyMap';
import NearbyAmenities from '@/components/property/NearbyAmenities';
import { formatPrice } from '@/lib/utils/format';
import { api } from '@/lib/services/api';
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
        // Ensure id is a string (handle case where it might be an array)
        const propertyId = Array.isArray(id) ? id[0] : id;
        const response = await api.properties.getById(propertyId as string);
        const prop = (response as any).data?.data ?? response.data;
        setProperty(prop);
        // add to recently viewed (best-effort)
        try {
          await api.auth.addRecentlyViewed(propertyId as string);
        } catch (_) {}
        // fetch favorite status if authenticated
        if (isAuthenticated) {
          try {
            const favRes = await api.auth.favoriteStatus(propertyId as string);
            setIsFavorite(Boolean((favRes as any)?.data?.favorited));
          } catch (_) {}
        }
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
  }, [id, isAuthenticated]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      // Ensure id is a string (handle case where it might be an array)
      const propertyId = Array.isArray(id) ? id[0] : id;
      if (isFavorite) {
        await api.auth.removeFavorite(propertyId as string);
        setIsFavorite(false);
      } else {
        await api.auth.addFavorite(propertyId as string);
        setIsFavorite(true);
      }
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
              <PropertyImageGallery images={Array.isArray(property.images) ? property.images : []} />
            </Paper>

            {/* Property Header */}
            <Paper sx={{ p: 3, mb: 4, bgcolor: 'var(--color-bg-secondary)', border: '1px solid var(--color-primary)' }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'var(--color-primary)' }}>
                    {property.title || property.address?.street || property.address?.city}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationOn sx={{ color: 'var(--color-primary)', mr: 1 }} />
                    <Typography variant="body1">{property.address ? `${property.address.street || ''}, ${property.address.city || ''}, ${property.address.state || ''}`.replace(/^,\s*|,\s*$/g, '') : ''}</Typography>
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
                    <Typography variant="body2">{property.bedrooms || 0} Bed</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Bathtub sx={{ color: 'var(--color-primary)', fontSize: 32, mb: 1 }} />
                    <Typography variant="body2">{property.bathrooms || 0} Bath</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <SquareFoot sx={{ color: 'var(--color-primary)', fontSize: 32, mb: 1 }} />
                    <Typography variant="body2">{property.area || 'N/A'} sqft</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Apartment sx={{ color: 'var(--color-primary)', fontSize: 32, mb: 1 }} />
                    <Typography variant="body2">{property.type || 'N/A'}</Typography>
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

            {/* Nearby Amenities */}
            {property.location?.coordinates && (
              <NearbyAmenities 
                coordinates={{ lat: property.location.coordinates[1], lng: property.location.coordinates[0] }}
                radius={2000}
              />
            )}

            {/* Map */}
            <Paper sx={{ p: 3, mb: 4, bgcolor: 'var(--color-bg-secondary)', border: '1px solid var(--color-primary)' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)' }}>
                Location
              </Typography>
              <PropertyMap 
                location={{ coordinates: property.location?.coordinates ? [property.location.coordinates[0], property.location.coordinates[1]] : [0, 0] }}
                address={property.address?.street ? `${property.address.street}, ${property.address.city}` : ''}
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