import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Box, Typography, Grid, Divider, Chip, Button, Paper, 
  CircularProgress, Alert, Dialog, DialogActions, 
  DialogContent, DialogTitle, IconButton, useMediaQuery, useTheme,
  Stack, Avatar, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { 
  LocationOn, KingBed, Bathtub, SquareFoot, 
  Phone, Email, Edit, Delete, ArrowBack,
  WhatsApp, Apartment, MeetingRoom, Check, Close
} from '@mui/icons-material';
import PropertyImageGallery from '../../components/property/PropertyImageGallery';
import PropertyMap from '../../components/property/PropertyMap';
import { formatPrice } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import { useProperties } from '../../context/PropertiesContext';

const PropertyDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    property: fetchedProperty, 
    getProperty, 
    deleteProperty,
    clearProperty
  } = useProperties();

  // Initialize state with proper data structure
  const [property, setProperty] = useState(() => {
    const updatedProperty = location.state?.updatedProperty;
    return updatedProperty?.data || updatedProperty || null;
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!location.state?.updatedProperty) {
          const response = await getProperty(id);
          // Handle both possible response structures
          setProperty(response.data?.data || response.data || null);
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();

    return () => clearProperty();
  }, [id, getProperty, location.state, clearProperty]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setDeleteError(null);
      await deleteProperty(id);
      navigate('/properties', { 
        state: { 
          message: 'Property deleted successfully',
          severity: 'success'
        } 
      });
    } catch (err) {
      console.error('Delete error:', err);
      setDeleteError(err.response?.data?.message || err.message || 'Failed to delete property');
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  const handleEdit = () => {
    navigate(`/properties/${id}/edit`, { 
      state: { property } 
    });
  };

  const getAddressPart = (part) => {
    if (!property) return '';
    return property.address?.[part] || property.location?.[part] || '';
  };

  const fullAddress = [
    getAddressPart('line1'),
    getAddressPart('street'),
    getAddressPart('city'),
    getAddressPart('state'),
    getAddressPart('zipCode')
  ].filter(Boolean).join(', ');

  const handleWhatsAppClick = () => {
    const phoneNumber = property?.agent?.mobile?.replace(/\D/g, '');
    if (!phoneNumber) return;
    
    const link = window.location.href;
    const message = `Hi, I'm interested in your property "${property?.title}" at ${fullAddress}. ${link}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCallClick = () => {
    const phoneNumber = property?.agent?.mobile?.replace(/\D/g, '');
    if (!phoneNumber) return;
    window.open(`tel:${phoneNumber}`, '_blank');
  };

  const handleEmailClick = () => {
    if (!property?.agent?.email) return;
    window.open(`mailto:${property.agent.email}?subject=Inquiry about ${property.title}`, '_blank');
  };

  const isOwner = user?.role === 'agent' && user.id === property?.agent?._id;

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '50vh'
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 1 }}
        >
          Retry
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/properties')}
          sx={{ mt: 1, ml: 2 }}
        >
          Browse Properties
        </Button>
      </Box>
    );
  }

  if (!property || !property.title) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {property ? 'Property data incomplete' : 'Property not found'}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/properties')}
          sx={{ mt: 2 }}
        >
          Browse Properties
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 1400, 
      mx: 'auto', 
      p: { xs: 1, sm: 2, md: 3 },
      pb: { xs: 6, sm: 3 }
    }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/properties')}
        sx={{
          mb: 3,
          color: 'text.secondary',
          '&:hover': {
            backgroundColor: 'rgba(46, 134, 171, 0.08)'
          }
        }}
      >
        Back to Properties
      </Button>

      {/* Main content */}
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} md={8}>
          {/* Image gallery with fallback */}
          <Box sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 1,
            mb: 3,
            minHeight: 300,
            backgroundColor: 'action.hover'
          }}>
            {property.images?.length > 0 ? (
              <PropertyImageGallery images={property.images} />
            ) : (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 300
              }}>
                <Typography variant="h6" color="text.secondary">
                  No images available
                </Typography>
              </Box>
            )}
          </Box>

          {/* Description section */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              Property Description
            </Typography>
            <Typography 
              paragraph 
              sx={{ 
                whiteSpace: 'pre-line',
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: 'text.secondary'
              }}
            >
              {property.description || 'No description available'}
            </Typography>
          </Paper>

          {/* Amenities with fallback */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              Amenities
            </Typography>
            {property.amenities?.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {property.amenities.map((amenity, index) => (
                  <Chip 
                    key={index}
                    label={amenity}
                    icon={<Check fontSize="small" />}
                    color="primary"
                    variant="outlined"
                    sx={{ 
                      backgroundColor: 'rgba(46, 134, 171, 0.1)',
                      borderColor: 'primary.main'
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">
                No amenities listed
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            {/* Price card */}
            <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography 
                  variant="h4" 
                  color="primary" 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '1.8rem', sm: '2rem' }
                  }}
                >
                  {formatPrice(property.price || 0)}
                </Typography>
                {property.status && (
                  <Chip 
                    label={property.status} 
                    color={
                      property.status === 'For Sale' ? 'primary' : 
                      property.status === 'For Rent' ? 'secondary' : 'default'
                    } 
                    size="medium"
                    sx={{ 
                      ml: 2,
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }} 
                  />
                )}
              </Box>

              {isOwner && (
                <>
                  <Typography 
                    variant="caption" 
                    color="primary" 
                    display="block" 
                    sx={{ 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      mt: -0.5,
                      mb: 1
                    }}
                  >
                    <Check fontSize="small" sx={{ mr: 0.5 }} />
                    Your listing
                  </Typography>

                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    mt: 2,
                    mb: 2,
                    borderTop: '1px solid',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    py: 2
                  }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={handleEdit}
                      fullWidth
                      sx={{
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => setDeleteConfirmOpen(true)}
                      fullWidth
                      sx={{
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </>
              )}

              {/* Contact agent section */}
              <Box sx={{ mt: 3 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    mb: 2
                  }}
                >
                  Contact Agent
                </Typography>
                
                {property.agent ? (
                  <>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      p: 2,
                      backgroundColor: 'rgba(46, 134, 171, 0.05)',
                      borderRadius: 1
                    }}>
                      <Avatar 
                        src={property.agent.avatar}
                        sx={{ 
                          width: 56, 
                          height: 56,
                          mr: 2,
                          backgroundColor: 'primary.main',
                          color: 'white'
                        }}
                      >
                        {property.agent.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {property.agent.name}
                        </Typography>
                        {property.agent.company && (
                          <Typography variant="body2" color="text.secondary">
                            {property.agent.company}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Stack spacing={2} sx={{ mt: 3 }}>
                      {property.agent.mobile && (
                        <Button 
                          fullWidth
                          variant="contained" 
                          color="primary"
                          size="large"
                          onClick={handleWhatsAppClick}
                          startIcon={<WhatsApp />}
                          sx={{ 
                            py: 1.5,
                            fontWeight: 600,
                            '&:hover': {
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          WhatsApp
                        </Button>
                      )}
                      
                      {property.agent.mobile && (
                        <Button 
                          fullWidth
                          variant="outlined" 
                          size="large"
                          onClick={handleCallClick}
                          startIcon={<Phone />}
                          sx={{ 
                            py: 1.5,
                            fontWeight: 600,
                            '&:hover': {
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Call Agent
                        </Button>
                      )}

                      {property.agent.email && (
                        <Button 
                          fullWidth
                          variant="outlined" 
                          size="large"
                          onClick={handleEmailClick}
                          startIcon={<Email />}
                          sx={{ 
                            py: 1.5,
                            fontWeight: 600,
                            '&:hover': {
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Email Agent
                        </Button>
                      )}
                    </Stack>
                  </>
                ) : (
                  <Typography color="text.secondary">
                    No agent information available
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Location section */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  mb: 2
                }}
              >
                Location
              </Typography>
              <Box sx={{ 
                height: 300,
                borderRadius: 1,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider'
              }}>
                {property.location?.coordinates ? (
                  <PropertyMap 
                    location={property.location} 
                    address={property.address || {}} 
                  />
                ) : (
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    backgroundColor: 'action.hover'
                  }}>
                    <Typography color="text.secondary">
                      Location not available
                    </Typography>
                  </Box>
                )}
              </Box>
              {fullAddress && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.secondary'
                  }}
                >
                  <LocationOn fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                  {fullAddress}
                </Typography>
              )}
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this property? This action cannot be undone.
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <Delete />}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertyDetails;