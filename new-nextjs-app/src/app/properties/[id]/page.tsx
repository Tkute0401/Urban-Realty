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
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeProvider';
import PropertyImageGallery from '@/components/property/PropertyImageGallery';
import PropertyMap from '@/components/property/PropertyMap';
import PropertySidebar from '@/components/property/PropertySidebar';
import PropertyMoreInfo from '@/components/property/PropertyMoreInfo';
import { formatPrice } from '@/lib/utils/format';
import { toast } from 'react-toastify';
import http from '@/lib/services/http';

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
    line1?: string;
    street?: string;
    city: string;
    locality?: string;
    state: string;
    zipCode?: string;
    country?: string;
  };
  images?: Array<{ 
    url: string; 
    publicId?: string;
    width?: number;
    height?: number;
  }>;
  projectDetails?: {
    projectArea?: string;
    totalUnits?: string;
    launchDate?: string;
    reraId?: string;
    configurations?: string;
  };
  location?: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
    formattedAddress?: string;
  };
  amenities?: string[];
  highlights?: string[];
  floorPlanImages?: Array<{
    url: string;
    publicId?: string;
    description?: string;
  }>;
  nearbyLocalities?: {
    hasSchool?: boolean;
    school?: string;
    hasHospital?: boolean;
    hospital?: string;
    hasMall?: boolean;
    mall?: string;
    hasPark?: boolean;
    park?: string;
    hasTransport?: boolean;
    transport?: string;
  };
  similarProperties?: Property[];
  developer?: {
    _id: string;
    name: string;
    logo?: { url: string };
  };
  agent?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    mobile?: string;
    company?: string;
    avatar?: string;
  };
  virtualTour?: {
    url: string;
    type?: string;
  };
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
  const { theme } = useContext(ThemeContext);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [mounted, setMounted] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

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
                    sx={{ color: isFavorite ? '#e74c3c' : 'var(--color-text-primary)' }}
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

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Paper sx={{
              background: 'var(--color-surface)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--color-border)',
              borderRadius: { xs: '8px', sm: '12px' },
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
                sx={{
                  borderBottom: '1px solid var(--color-border)',
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
                <Tab label="Overview" />
                <Tab label="Amenities" />
                <Tab label="Location" />
                <Tab label="Floor Plan" />
              </Tabs>

              <TabPanel value={activeTab} index={0}>
                <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                  Description
                </Typography>
                <Typography sx={{ mb: 3, color: 'var(--color-text-muted)' }}>
                  {property.description || 'No description available for this property.'}
                </Typography>

                {property.highlights && property.highlights.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
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
                <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
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
                        background: 'var(--color-bg-secondary)',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)'
                      }}>
                        <Star sx={{ color: 'var(--color-primary)', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
                          {amenity}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                  Location & Nearby Places
                </Typography>
                {property.location && property.location.coordinates && property.location.coordinates.length === 2 ? (
                  <PropertyMap
                    latitude={property.location.coordinates[1]}
                    longitude={property.location.coordinates[0]}
                    address={fullAddress}
                    height="400px"
                  />
                ) : (
                  <Typography sx={{ color: 'var(--color-text-muted)' }}>
                    Location information not available.
                  </Typography>
                )}

                {property.nearbyLocalities && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                      Nearby Places
                    </Typography>
                    <Grid container spacing={2}>
                      {property.nearbyLocalities.hasSchool && property.nearbyLocalities.school && (
                        <Grid item xs={12} sm={6}>
                          <Box sx={{
                            p: 2,
                            background: isDark ? 'rgba(11, 16, 17, 0.5)' : 'rgba(248, 250, 252, 0.5)',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)'
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
                            background: isDark ? 'rgba(11, 16, 17, 0.5)' : 'rgba(248, 250, 252, 0.5)',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)'
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
                            background: isDark ? 'rgba(11, 16, 17, 0.5)' : 'rgba(248, 250, 252, 0.5)',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)'
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
                            background: isDark ? 'rgba(11, 16, 17, 0.5)' : 'rgba(248, 250, 252, 0.5)',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)'
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
              </TabPanel>

              <TabPanel value={activeTab} index={3}>
                <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                  Floor Plan
                </Typography>
                {property.floorPlanImages && property.floorPlanImages.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {property.floorPlanImages.map((floorPlan, index) => (
                      <Box key={index}>
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
                ) : (
                  <Typography sx={{ color: 'var(--color-text-muted)' }}>
                    Floor plan not available for this property.
                  </Typography>
                )}
              </TabPanel>
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

        {/* More Information Section */}
        <Box sx={{ mt: 4 }}>
          <PropertyMoreInfo property={property} />
        </Box>

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
