'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme as useMuiTheme,
  Card,
  CardContent
} from '@mui/material';
import {
  Share,
  Phone,
  Email,
  WhatsApp,
  LocationOn,
  Home,
  LocalHotel,
  Bathtub,
  SquareFoot,
  Star,
  KeyboardArrowUp,
  PictureAsPdf,
  Download,
  VideoLibrary,
  PlayArrow
} from '@mui/icons-material';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartFilled } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeProvider';
import PropertyImageGallery from '@/components/property/PropertyImageGallery';
import PropertyMap from '@/components/property/PropertyMap';
import PropertySidebar from '@/components/property/PropertySidebar';
import { formatPrice } from '@/lib/utils/format';
import { toast } from 'react-toastify';
import http from '@/lib/services/http';
import { useProperties } from '@/contexts/PropertiesContext';
import PropertyCard from '@/components/property/PropertyCard';
import { Property } from '@/types/property';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`property-tabpanel-${index}`}
      aria-labelledby={`property-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const PropertyDetailsPageContent: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [mounted, setMounted] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [similarPropertiesLoading, setSimilarPropertiesLoading] = useState(false);
  const [featuredPropertiesLoading, setFeaturedPropertiesLoading] = useState(false);
  const [morePropertiesTab, setMorePropertiesTab] = useState(0);

  const isDark = theme === 'dark';

  // Client-side mounting check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load property details
  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await http.get(`/api/v1/properties/${params.id}`);
        const data = response.data;
        // Backend sends { success: true, data: propertyObject }
        const propertyData = data.data || data;
        setProperty(propertyData);

        // Check favorite status
        try {
          const favoriteResponse = await http.get(`/api/v1/auth/favorites/${params.id}/status`);
          const favoriteData = favoriteResponse.data;
          setIsFavorite(favoriteData.isFavorite);
        } catch (err) {
          console.log('Could not check favorite status:', err);
        }
      } catch (err) {
        console.error('Error loading property:', err);
        setError(err instanceof Error ? err.message : 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    if (mounted && params.id) {
      loadProperty();
    }
  }, [mounted, params.id]);

  // Handle scroll to show back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch similar and featured properties when property loads
  useEffect(() => {
    if (property) {
      fetchSimilarProperties();
      fetchFeaturedProperties();
    }
  }, [property]);

  const handleFavoriteClick = async () => {
    if (!property) return;

    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        await http.delete(`/api/v1/auth/favorites/${property._id}`);
        toast.success('Removed from favorites');
      } else {
        await http.put(`/api/v1/auth/favorites/${property._id}`, {});
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error updating favorite:', err);
      toast.error('Failed to update favorites');
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: property?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const formatPrice = (price: number) => {
    if (!price) return 'Price not available';
    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹ ${price.toLocaleString()}`;
  };

  const handleContact = (method: 'phone' | 'email' | 'whatsapp') => {
    if (!property) return;

    switch (method) {
      case 'phone':
        window.open(`tel:+1234567890`);
        break;
      case 'email':
        window.open(`mailto:contact@example.com?subject=Inquiry about ${property.title}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/1234567890?text=Hi, I'm interested in your property: ${property.title}`);
        break;
    }
  };

  const fetchSimilarProperties = async () => {
    if (!property) return;
    
    setSimilarPropertiesLoading(true);
    try {
      const params = new URLSearchParams();
      if (property.address?.city) params.set('city', property.address.city);
      if (property.type) params.set('type', property.type);
      if (property.status) params.set('status', property.status);
      params.set('limit', '6');
      
      // Add location-based filtering if property has coordinates
      if (property.location?.coordinates) {
        params.set('userLat', property.location.coordinates[1].toString());
        params.set('userLng', property.location.coordinates[0].toString());
        params.set('radius', '5000'); // 5km radius
      }

      const response = await http.get(`/api/v1/properties?${params.toString()}`);
      const data = response.data;
      const properties = data.data || data.properties || [];
      
      // Filter out the current property
      const filteredProperties = properties.filter((p: Property) => p._id !== property._id);
      setSimilarProperties(filteredProperties.slice(0, 6));
    } catch (err) {
      console.error('Error fetching similar properties:', err);
    } finally {
      setSimilarPropertiesLoading(false);
    }
  };

  const fetchFeaturedProperties = async () => {
    setFeaturedPropertiesLoading(true);
    try {
      const response = await http.get('/api/v1/properties/featured');
      const data = response.data;
      const properties = data.data || data.properties || [];
      setFeaturedProperties(properties.slice(0, 6));
    } catch (err) {
      console.error('Error fetching featured properties:', err);
    } finally {
      setFeaturedPropertiesLoading(false);
    }
  };

  // Show loading state until mounted
  if (!mounted) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--color-bg)'
      }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--color-bg)',
        gap: 2
      }}>
        <CircularProgress size={80} sx={{ color: 'var(--color-primary)' }} />
        <Typography variant="h6" sx={{ color: 'var(--color-text-muted)' }}>
          Loading property details...
        </Typography>
      </Box>
    );
  }

  if (error || !property) {
    return (
      <Box sx={{
        p: 3,
        textAlign: 'center',
        background: 'var(--color-bg)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 600 }}>
          {error || 'Property not found'}
        </Alert>
        <Button
          variant="contained"
          onClick={() => router.push('/properties')}
          sx={{ mt: 2 }}
        >
          Browse Properties
        </Button>
      </Box>
    );
  }

  const fullAddress = [
    property.address?.street,
    property.address?.city,
    property.address?.state,
    property.address?.zipCode
  ].filter(Boolean).join(', ');

  return (
    <Box sx={{
      background: 'var(--color-bg)',
      minHeight: '100vh',
      fontFamily: 'var(--font-family-sans, "Poppins", sans-serif)'
    }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Property Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper sx={{
            p: { xs: 2, sm: 3 },
            mb: { xs: 3, sm: 4 },
            background: 'var(--color-surface)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--color-border)',
            borderRadius: { xs: '8px', sm: '12px' },
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" sx={{
                fontWeight: 'bold',
                mb: 2,
                color: 'var(--color-text-primary)'
              }}>
                {property.buildingName || property.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <LocationOn sx={{ color: 'var(--color-primary)' }} />
                <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
                  {fullAddress}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={property.type}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={property.status}
                  color={property.status === 'For Sale' ? 'success' : 'warning'}
                  variant="filled"
                  size="small"
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h3" sx={{
                  fontWeight: 'bold',
                  color: 'var(--color-primary)',
                  textAlign: { xs: 'left', md: 'right' }
                }}>
                  {formatPrice(property.price)}
                  {property.status === 'For Rent' && <Typography component="span" variant="h6" sx={{ ml: 1 }}>/mo</Typography>}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  <IconButton
                    onClick={handleFavoriteClick}
                    disabled={loadingFavorite}
                    sx={{ color: isFavorite ? 'var(--color-error)' : 'var(--color-text-primary)' }}
                  >
                    {loadingFavorite ? <CircularProgress size={20} /> : (isFavorite ? <HeartFilled /> : <HeartOutline />)}
                  </IconButton>
                  
                  <IconButton onClick={handleShare} sx={{ color: 'var(--color-text-primary)' }}>
                    <Share />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
          </Paper>
        </motion.div>

        {/* Property Images */}
        <Box sx={{ mb: 4 }}>
          <PropertyImageGallery
            images={property.images || []}
            title={property.title}
          />
        </Box>

        {/* Property Details */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            {/* Property Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
                <Grid item xs={6} sm={3}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Paper sx={{
                  p: { xs: 1.5, sm: 2 },
                  textAlign: 'center',
                  background: 'var(--color-surface)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--color-border)',
                  borderRadius: { xs: '8px', sm: '12px' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}>
                  <SquareFoot sx={{ color: 'var(--color-primary)', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                    {property.area} sqft
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                    Area
                  </Typography>
                    </Paper>
                  </motion.div>
                </Grid>

              <Grid item xs={6} sm={3}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Paper sx={{
                  p: 2,
                  textAlign: 'center',
                  background: 'var(--color-surface)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}>
                  <LocalHotel sx={{ color: 'var(--color-primary)', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                    {property.bedrooms}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                    Bedrooms
                  </Typography>
                  </Paper>
                </motion.div>
              </Grid>

              <Grid item xs={6} sm={3}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Paper sx={{
                  p: 2,
                  textAlign: 'center',
                  background: 'var(--color-surface)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}>
                  <Bathtub sx={{ color: 'var(--color-primary)', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                    {property.bathrooms}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                    Bathrooms
                  </Typography>
                  </Paper>
                </motion.div>
              </Grid>

              <Grid item xs={6} sm={3}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Paper sx={{
                  p: 2,
                  textAlign: 'center',
                  background: 'var(--color-surface)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}>
                  <Home sx={{ color: 'var(--color-primary)', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                    {property.type}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                    Type
                  </Typography>
                  </Paper>
                </motion.div>
              </Grid>
              </Grid>
            </motion.div>

            {/* Property Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Paper sx={{
                p: { xs: 2, sm: 3 },
                mb: 3,
                background: 'var(--color-surface)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--color-border)',
                borderRadius: { xs: '8px', sm: '12px' },
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}>
                <Typography variant="h5" sx={{ 
                  mb: 3, 
                  color: 'var(--color-text-primary)',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Home sx={{ color: 'var(--color-primary)' }} />
                  Property Description
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-line',
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    color: 'var(--color-text-primary)',
                    mb: 3
                  }}
                >
                  {property.description || 'No description available for this property.'}
                </Typography>
                {property.highlights && property.highlights.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                      Key Highlights
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                      {property.highlights.map((highlight, index) => (
                        <Chip
                          key={index}
                          label={highlight}
                          sx={{
                            backgroundColor: 'var(--color-bg-secondary)',
                            color: 'var(--color-text-primary)',
                            border: '1px solid var(--color-border)',
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: 'var(--color-primary-20)',
                              borderColor: 'var(--color-primary)'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </>
                )}
              </Paper>
            </motion.div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Paper sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 3,
                  background: 'var(--color-surface)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--color-border)',
                  borderRadius: { xs: '8px', sm: '12px' },
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                  <Typography variant="h5" sx={{ 
                    mb: 3, 
                    color: 'var(--color-text-primary)',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Star sx={{ color: 'var(--color-primary)' }} />
                    Amenities & Features
                  </Typography>
                  <Grid container spacing={2}>
                    {property.amenities.map((amenity, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 2,
                          background: 'var(--color-bg-secondary)',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'var(--color-primary-20)',
                            borderColor: 'var(--color-primary)',
                            transform: 'translateY(-2px)'
                          }
                        }}>
                          <Star sx={{ color: 'var(--color-primary)', fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
                            {amenity}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </motion.div>
            )}

            {/* Location & Nearby Places */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Paper sx={{
                p: { xs: 2, sm: 3 },
                mb: 3,
                background: 'var(--color-surface)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--color-border)',
                borderRadius: { xs: '8px', sm: '12px' },
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}>
                <Typography variant="h5" sx={{ 
                  mb: 3, 
                  color: 'var(--color-text-primary)',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <LocationOn sx={{ color: 'var(--color-primary)' }} />
                  Location & Nearby Places
                </Typography>
                
                <Typography sx={{ color: 'var(--color-text-muted)', mb: 3 }}>
                  View the interactive map in the sidebar for detailed location information.
                </Typography>

                {property.nearbyLocalities && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                      Nearby Places
                    </Typography>
                    <Grid container spacing={2}>
                      {property.nearbyLocalities.hasSchool && property.nearbyLocalities.school && (
                        <Grid item xs={12} sm={6}>
                          <Box sx={{
                            p: 2,
                            background: 'var(--color-bg-secondary)',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'var(--color-primary-20)',
                              borderColor: 'var(--color-primary)',
                              transform: 'translateY(-2px)'
                            }
                          }}>
                            <Typography variant="subtitle2" sx={{ color: 'var(--color-text-primary)' }}>
                              {property.nearbyLocalities.school}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                              School
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      {property.nearbyLocalities.hasHospital && property.nearbyLocalities.hospital && (
                        <Grid item xs={12} sm={6}>
                          <Box sx={{
                            p: 2,
                            background: 'var(--color-bg-secondary)',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'var(--color-primary-20)',
                              borderColor: 'var(--color-primary)',
                              transform: 'translateY(-2px)'
                            }
                          }}>
                            <Typography variant="subtitle2" sx={{ color: 'var(--color-text-primary)' }}>
                              {property.nearbyLocalities.hospital}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                              Hospital
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      {property.nearbyLocalities.hasMall && property.nearbyLocalities.mall && (
                        <Grid item xs={12} sm={6}>
                          <Box sx={{
                            p: 2,
                            background: 'var(--color-bg-secondary)',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'var(--color-primary-20)',
                              borderColor: 'var(--color-primary)',
                              transform: 'translateY(-2px)'
                            }
                          }}>
                            <Typography variant="subtitle2" sx={{ color: 'var(--color-text-primary)' }}>
                              {property.nearbyLocalities.mall}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                              Shopping Mall
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      {property.nearbyLocalities.hasPark && property.nearbyLocalities.park && (
                        <Grid item xs={12} sm={6}>
                          <Box sx={{
                            p: 2,
                            background: 'var(--color-bg-secondary)',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'var(--color-primary-20)',
                              borderColor: 'var(--color-primary)',
                              transform: 'translateY(-2px)'
                            }
                          }}>
                            <Typography variant="subtitle2" sx={{ color: 'var(--color-text-primary)' }}>
                              {property.nearbyLocalities.park}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                              Park
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}
              </Paper>
            </motion.div>

            {/* Floor Plan */}
            {property.floorPlanImages && property.floorPlanImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Paper sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 3,
                  background: 'var(--color-surface)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--color-border)',
                  borderRadius: { xs: '8px', sm: '12px' },
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                  <Typography variant="h5" sx={{ 
                    mb: 3, 
                    color: 'var(--color-text-primary)',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <SquareFoot sx={{ color: 'var(--color-primary)' }} />
                    Floor Plans
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {property.floorPlanImages.map((floorPlan, index) => (
                      <Box key={index} sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                        }
                      }}>
                        <img
                          src={floorPlan.url}
                          alt={`Floor Plan ${index + 1}`}
                          style={{
                            width: '100%',
                            maxWidth: '800px',
                            height: 'auto',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)'
                          }}
                        />
                        {floorPlan.description && (
                          <Typography sx={{ mt: 2, color: 'var(--color-text-muted)' }}>
                            {floorPlan.description}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </motion.div>
            )}

            {/* Brochure Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Paper sx={{
                p: { xs: 2, sm: 3 },
                mb: 3,
                background: 'var(--color-surface)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--color-border)',
                borderRadius: { xs: '8px', sm: '12px' },
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}>
                <Typography variant="h5" sx={{ 
                  mb: 3, 
                  color: 'var(--color-text-primary)',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <PictureAsPdf sx={{ color: 'var(--color-primary)' }} />
                  Property Brochure & Virtual Tour
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                          transform: 'translateY(-4px)'
                        }
                      }}
                      onClick={() => {
                        // In a real app, this would download the brochure PDF
                        window.open('/api/placeholder/400/600', '_blank');
                      }}
                    >
                      <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                        <img
                          src="/api/placeholder/400/600"
                          alt="Property Brochure"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <PictureAsPdf sx={{ 
                              fontSize: 48, 
                              color: 'var(--color-primary)', 
                              mb: 1 
                            }} />
                            <Typography variant="h6" sx={{ 
                              color: 'white',
                              fontWeight: 'bold'
                            }}>
                              Download Brochure
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold', 
                          color: 'var(--color-text-primary)',
                          mb: 1
                        }}>
                          Property Brochure PDF
                        </Typography>
                        
                        <Typography variant="body2" sx={{ 
                          color: 'var(--color-text-muted)',
                          mb: 2
                        }}>
                          Download the complete property brochure with detailed information, floor plans, and amenities.
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Download sx={{ fontSize: 16, color: 'var(--color-primary)' }} />
                          <Typography variant="body2" sx={{ color: 'var(--color-primary)' }}>
                            Click to download
                          </Typography>
                        </Box>
                      </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                          transform: 'translateY(-4px)'
                        }
                      }}
                      onClick={() => {
                        // In a real app, this would open the virtual tour
                        if (property.virtualTour?.url) {
                          window.open(property.virtualTour.url, '_blank');
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                        <img
                          src="/api/placeholder/400/600"
                          alt="Virtual Tour"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <VideoLibrary sx={{ 
                              fontSize: 48, 
                              color: 'var(--color-primary)', 
                              mb: 1 
                            }} />
                            <Typography variant="h6" sx={{ 
                              color: 'white',
                              fontWeight: 'bold'
                            }}>
                              Virtual Tour
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold', 
                          color: 'var(--color-text-primary)',
                          mb: 1
                        }}>
                          360° Virtual Tour
                        </Typography>
                        
                        <Typography variant="body2" sx={{ 
                          color: 'var(--color-text-muted)',
                          mb: 2
                        }}>
                          Take a virtual walkthrough of the property with our interactive 360° tour experience.
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PlayArrow sx={{ fontSize: 16, color: 'var(--color-primary)' }} />
                          <Typography variant="body2" sx={{ color: 'var(--color-primary)' }}>
                            Start virtual tour
                          </Typography>
                        </Box>
                      </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          </Grid>

          {/* Property Sidebar */}
          <Grid item xs={12} lg={4}>
            <PropertySidebar
              property={property}
              fullAddress={fullAddress}
              isSticky={true}
              headerHeight={100}
              handleContactOpen={() => handleContact('email')}
            />
          </Grid>
        </Grid>


        {/* Similar Properties Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Box sx={{ mt: 6 }}>
            <Paper sx={{
              background: 'var(--color-surface)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--color-border)',
              borderRadius: { xs: '8px', sm: '12px' },
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              p: { xs: 2, sm: 3 }
            }}>
              <Typography variant="h4" sx={{ 
                mb: 3, 
                color: 'var(--color-text-primary)',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                More Properties
              </Typography>

              <Tabs
                value={morePropertiesTab}
                onChange={(_, newValue) => setMorePropertiesTab(newValue)}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
                sx={{
                  borderBottom: '1px solid var(--color-border)',
                  mb: 3,
                  '& .MuiTab-root': {
                    color: 'var(--color-text-muted)',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    minHeight: { xs: 48, sm: 64 },
                    '&.Mui-selected': {
                      color: 'var(--color-primary)'
                    }
                  }
                }}
              >
                <Tab label="Similar Properties" />
                <Tab label="Featured Properties" />
              </Tabs>

              <TabPanel value={morePropertiesTab} index={0}>
                {similarPropertiesLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={40} sx={{ color: 'var(--color-primary)' }} />
                  </Box>
                ) : similarProperties.length > 0 ? (
                  <Grid container spacing={3}>
                    {similarProperties.map((prop) => (
                      <Grid item xs={12} sm={6} md={4} key={prop._id}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                              transform: 'translateY(-4px)'
                            }
                          }}
                          onClick={() => router.push(`/properties/${prop._id}`)}
                        >
                          <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                            <img
                              src={prop.images?.[0]?.url || '/api/placeholder/400/300'}
                              alt={prop.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                            <Chip
                              label={prop.status}
                              color={prop.status === 'For Sale' ? 'success' : 'warning'}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                fontWeight: 'bold'
                              }}
                            />
                          </Box>
                          
                          <CardContent sx={{ flexGrow: 1, p: 2 }}>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 'bold', 
                              color: 'var(--color-text-primary)',
                              mb: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {prop.buildingName || prop.title}
                            </Typography>
                            
                            <Typography variant="body2" sx={{ 
                              color: 'var(--color-text-muted)',
                              mb: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {prop.address?.city}, {prop.address?.state}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="h6" sx={{ 
                                color: 'var(--color-primary)',
                                fontWeight: 'bold'
                              }}>
                                {formatPrice(prop.price)}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                                {prop.area} sqft
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocalHotel sx={{ fontSize: 16, color: 'var(--color-primary)' }} />
                                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                                  {prop.bedrooms}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Bathtub sx={{ fontSize: 16, color: 'var(--color-primary)' }} />
                                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                                  {prop.bathrooms}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <SquareFoot sx={{ fontSize: 16, color: 'var(--color-primary)' }} />
                                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                                  {prop.type}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
                      No similar properties found.
                    </Typography>
                  </Box>
                )}
              </TabPanel>

              <TabPanel value={morePropertiesTab} index={1}>
                {featuredPropertiesLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={40} sx={{ color: 'var(--color-primary)' }} />
                  </Box>
                ) : featuredProperties.length > 0 ? (
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)'
                    },
                    gap: 3,
                    justifyItems: 'center'
                  }}>
                    {featuredProperties.map((prop) => (
                      <PropertyCard
                        key={prop._id}
                        property={prop as Property}
                        index={0}
                        onClick={() => router.push(`/properties/${prop._id}`)}
                      />
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
                      No featured properties available.
                    </Typography>
                  </Box>
                )}
              </TabPanel>
            </Paper>
          </Box>
        </motion.div>


        {/* Back to Top Button */}
        {showBackToTop && (
          <IconButton
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            sx={{
              position: 'fixed',
              bottom: { xs: 20, sm: 30 },
              right: { xs: 20, sm: 30 },
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text-inverse)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              '&:hover': { 
                backgroundColor: 'var(--color-primary-hover)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <KeyboardArrowUp />
          </IconButton>
        )}
      </Container>
    </Box>
  );
};

const PropertyDetailsPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--color-bg)'
      }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return <PropertyDetailsPageContent />;
};

export default PropertyDetailsPage;
