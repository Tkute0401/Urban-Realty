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
  useTheme as useMuiTheme
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
  KeyboardArrowUp
} from '@mui/icons-material';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartFilled } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useThemeContext } from '@/contexts/ThemeContext';
import PropertyImageGallery from '@/components/property/PropertyImageGallery';
import PropertyMap from '@/components/property/PropertyMap';
import { toast } from 'react-toastify';

interface Property {
  _id: string;
  title: string;
  buildingName?: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  status: string;
  description?: string;
  address?: {
    street?: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  images?: Array<{ url: string; alt?: string; caption?: string }>;
  projectDetails?: {
    launchDate?: string;
    possessionDate?: string;
    developer?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  amenities?: string[];
  highlights?: string[];
  floorPlan?: {
    image: string;
    description: string;
  };
  nearbyPlaces?: Array<{
    name: string;
    type: string;
    distance: string;
  }>;
  similarProperties?: Property[];
}

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
  const { theme } = useThemeContext();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const isDark = theme === 'dark';

  // Load property details
  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/properties/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Property not found');
          }
          throw new Error('Failed to fetch property');
        }

        const data = await response.json();
        setProperty(data);

        // Check favorite status
        const favoriteResponse = await fetch(`/api/auth/favorites/${params.id}/status`);
        if (favoriteResponse.ok) {
          const favoriteData = await favoriteResponse.json();
          setIsFavorite(favoriteData.isFavorite);
        }
      } catch (err) {
        console.error('Error loading property:', err);
        setError(err instanceof Error ? err.message : 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadProperty();
    }
  }, [params.id]);

  // Handle scroll to show back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFavoriteClick = async () => {
    if (!property) return;

    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        await fetch(`/api/auth/favorites/${property._id}`, { method: 'DELETE' });
        toast.success('Removed from favorites');
      } else {
        await fetch(`/api/auth/favorites/${property._id}`, { method: 'PUT' });
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

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: isDark ? 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <CircularProgress size={80} sx={{ color: '#78CADC' }} />
      </Box>
    );
  }

  if (error || !property) {
    return (
      <Box sx={{
        p: 3,
        textAlign: 'center',
        background: isDark ? 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
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
      background: isDark ? 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh'
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Property Header */}
        <Paper sx={{
          p: 3,
          mb: 4,
          background: isDark ? 'rgba(11, 16, 17, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          borderRadius: '12px'
        }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" sx={{
                fontWeight: 'bold',
                mb: 2,
                color: isDark ? 'white' : 'text.primary'
              }}>
                {property.buildingName || property.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <LocationOn sx={{ color: '#78CADC' }} />
                <Typography variant="body1" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
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
                  color: '#78CADC',
                  textAlign: { xs: 'left', md: 'right' }
                }}>
                  {formatPrice(property.price)}
                  {property.status === 'For Rent' && <Typography component="span" variant="h6" sx={{ ml: 1 }}>/mo</Typography>}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  <IconButton
                    onClick={handleFavoriteClick}
                    disabled={loadingFavorite}
                    sx={{ color: isFavorite ? '#e74c3c' : isDark ? 'white' : 'text.primary' }}
                  >
                    {loadingFavorite ? <CircularProgress size={20} /> : (isFavorite ? <HeartFilled /> : <HeartOutline />)}
                  </IconButton>
                  
                  <IconButton onClick={handleShare} sx={{ color: isDark ? 'white' : 'text.primary' }}>
                    <Share />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Property Images */}
        <Box sx={{ mb: 4 }}>
          <PropertyImageGallery
            images={property.images || []}
            propertyTitle={property.title}
            showThumbnails={true}
            autoPlay={false}
          />
        </Box>

        {/* Property Details */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            {/* Property Info Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={3}>
                <Paper sx={{
                  p: 2,
                  textAlign: 'center',
                  background: isDark ? 'rgba(11, 16, 17, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '12px'
                }}>
                  <SquareFoot sx={{ color: '#78CADC', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: isDark ? 'white' : 'text.primary' }}>
                    {property.area} sqft
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
                    Area
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Paper sx={{
                  p: 2,
                  textAlign: 'center',
                  background: isDark ? 'rgba(11, 16, 17, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '12px'
                }}>
                  <LocalHotel sx={{ color: '#78CADC', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: isDark ? 'white' : 'text.primary' }}>
                    {property.bedrooms}
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
                    Bedrooms
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Paper sx={{
                  p: 2,
                  textAlign: 'center',
                  background: isDark ? 'rgba(11, 16, 17, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '12px'
                }}>
                  <Bathtub sx={{ color: '#78CADC', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: isDark ? 'white' : 'text.primary' }}>
                    {property.bathrooms}
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
                    Bathrooms
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Paper sx={{
                  p: 2,
                  textAlign: 'center',
                  background: isDark ? 'rgba(11, 16, 17, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '12px'
                }}>
                  <Home sx={{ color: '#78CADC', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: isDark ? 'white' : 'text.primary' }}>
                    {property.type}
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
                    Type
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{
              background: isDark ? 'rgba(11, 16, 17, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '12px'
            }}>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{
                  borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  '& .MuiTab-root': {
                    color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                    '&.Mui-selected': {
                      color: '#78CADC'
                    }
                  }
                }}
              >
                <Tab label="Overview" />
                <Tab label="Amenities" />
                <Tab label="Location" />
                <Tab label="Floor Plan" />
              </Tabs>

              <TabPanel value={activeTab} index={0}>
                <Typography variant="h6" sx={{ mb: 2, color: isDark ? 'white' : 'text.primary' }}>
                  Description
                </Typography>
                <Typography sx={{ mb: 3, color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
                  {property.description || 'No description available for this property.'}
                </Typography>

                {property.highlights && property.highlights.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ mb: 2, color: isDark ? 'white' : 'text.primary' }}>
                      Key Highlights
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {property.highlights.map((highlight, index) => (
                        <Chip
                          key={index}
                          label={highlight}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  </>
                )}
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <Typography variant="h6" sx={{ mb: 2, color: isDark ? 'white' : 'text.primary' }}>
                  Amenities
                </Typography>
                <Grid container spacing={2}>
                  {(property.amenities || []).map((amenity, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 2,
                        background: isDark ? 'rgba(11, 16, 17, 0.5)' : 'rgba(248, 250, 252, 0.5)',
                        borderRadius: '8px',
                        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
                      }}>
                        <Star sx={{ color: '#78CADC', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: isDark ? 'white' : 'text.primary' }}>
                          {amenity}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <Typography variant="h6" sx={{ mb: 2, color: isDark ? 'white' : 'text.primary' }}>
                  Location & Nearby Places
                </Typography>
                {property.location ? (
                  <PropertyMap
                    latitude={property.location.latitude}
                    longitude={property.location.longitude}
                    address={fullAddress}
                    height="300px"
                  />
                ) : (
                  <Typography sx={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
                    Location information not available.
                  </Typography>
                )}

                {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: isDark ? 'white' : 'text.primary' }}>
                      Nearby Places
                    </Typography>
                    <Grid container spacing={2}>
                      {property.nearbyPlaces.map((place, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{
                            p: 2,
                            background: isDark ? 'rgba(11, 16, 17, 0.5)' : 'rgba(248, 250, 252, 0.5)',
                            borderRadius: '8px',
                            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
                          }}>
                            <Typography variant="subtitle2" sx={{ color: isDark ? 'white' : 'text.primary' }}>
                              {place.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
                              {place.type} • {place.distance}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </TabPanel>

              <TabPanel value={activeTab} index={3}>
                <Typography variant="h6" sx={{ mb: 2, color: isDark ? 'white' : 'text.primary' }}>
                  Floor Plan
                </Typography>
                {property.floorPlan ? (
                  <Box>
                    <img
                      src={property.floorPlan.image}
                      alt="Floor Plan"
                      style={{
                        width: '100%',
                        maxWidth: '600px',
                        height: 'auto',
                        borderRadius: '8px',
                        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
                      }}
                    />
                    <Typography sx={{ mt: 2, color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
                      {property.floorPlan.description}
                    </Typography>
                  </Box>
                ) : (
                  <Typography sx={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
                    Floor plan not available for this property.
                  </Typography>
                )}
              </TabPanel>
            </Paper>
          </Grid>

          {/* Contact Sidebar */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{
              p: 3,
              position: 'sticky',
              top: 100,
              background: isDark ? 'rgba(11, 16, 17, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '12px'
            }}>
              <Typography variant="h6" sx={{ mb: 3, color: isDark ? 'white' : 'text.primary' }}>
                Contact Agent
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Phone />}
                  onClick={() => handleContact('phone')}
                  sx={{
                    background: '#78CADC',
                    '&:hover': { background: '#5fb4c9' }
                  }}
                >
                  Call Now
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Email />}
                  onClick={() => handleContact('email')}
                  sx={{ borderColor: '#78CADC', color: '#78CADC' }}
                >
                  Send Email
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<WhatsApp />}
                  onClick={() => handleContact('whatsapp')}
                  sx={{ borderColor: '#25D366', color: '#25D366' }}
                >
                  WhatsApp
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="body2" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
                Interested in this property? Contact our agent for more information and to schedule a viewing.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Back to Top Button */}
        {showBackToTop && (
          <IconButton
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            sx={{
              position: 'fixed',
              bottom: 30,
              right: 30,
              backgroundColor: '#78CADC',
              color: '#0B1011',
              '&:hover': { backgroundColor: '#5fb4c9' }
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
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return <PropertyDetailsPageContent />;
};

export default PropertyDetailsPage;
