import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Divider, Chip, Button, Paper, 
  CircularProgress, Alert, Dialog, DialogActions, 
  DialogContent, DialogTitle, IconButton, useMediaQuery, 
  Stack, Avatar, FormControl, InputLabel, Select, MenuItem,
  TextField, RadioGroup, FormControlLabel, Radio, Collapse
} from '@mui/material';
import { 
  LocationOn, KingBed, Bathtub, SquareFoot, 
  Phone, Email, Edit, Delete, ArrowBack,
  WhatsApp, Apartment, MeetingRoom, Check, Close,
  KeyboardArrowDown, KeyboardArrowUp
} from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProperties } from '../../context/PropertiesContext';
import PropertyImageGallery from '../../components/property/PropertyImageGallery';
import PropertyMap from '../../components/property/PropertyMap';
import { formatPrice } from '../../utils/format';
import axios from '../../services/axios';
import { styled, keyframes } from '@mui/material/styles';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(120, 202, 220, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(120, 202, 220, 0); }
  100% { box-shadow: 0 0 0 0 rgba(120, 202, 220, 0); }
`;

// Styled components
const PremiumPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#0B1011',
  color: '#fff',
  borderRadius: '16px',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
  border: `2px solid #78CADC`,
  padding: theme.spacing(4),
  fontFamily: '"Poppins", sans-serif',
  animation: `${fadeIn} 0.6s ease-out forwards`,
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #78CADC 0%, #0B1011 100%)',
  }
}));

const PremiumButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#78CADC',
  color: '#0B1011',
  fontWeight: 600,
  padding: theme.spacing(1.8, 4),
  borderRadius: '12px',
  fontFamily: '"Poppins", sans-serif',
  textTransform: 'none',
  fontSize: '1rem',
  letterSpacing: '0.5px',
  '&:hover': {
    backgroundColor: '#5fb4c9',
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 12px rgba(120, 202, 220, 0.4)',
  },
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  boxShadow: '0 4px 8px rgba(120, 202, 220, 0.2)',
}));

const PropertyDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    property: fetchedProperty, 
    getProperty, 
    deleteProperty,
    clearProperty
  } = useProperties();
  
  const [property, setProperty] = useState(location.state?.updatedProperty || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactMethod, setContactMethod] = useState('message');
  const [message, setMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!location.state?.updatedProperty) {
          const data = await getProperty(id);
          setProperty(data);
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

  const handleContactOpen = () => {
    const fullAddress = [
      property.address?.line1,
      property.address?.street,
      property.address?.city,
      property.address?.state,
      property.address?.zipCode
    ].filter(Boolean).join(', ');
    
    const propertyLink = window.location.href;
    const prefilledMessage = `Hello, I'm interested in your property "${property.title}" at ${fullAddress} (${formatPrice(property.price)}).\n\n${propertyLink}\n\nCould you please provide more information about:\n- Availability\n- Viewing options\n- Any additional details`;
    
    setMessage(prefilledMessage);
    setContactOpen(true);
    setContactSuccess(false);
    setContactMethod('message');
  };

  const handleContactSubmit = async () => {
    try {
      setContactLoading(true);
      
      const fullAddress = [
        property.address?.line1,
        property.address?.street,
        property.address?.city,
        property.address?.state,
        property.address?.zipCode
      ].filter(Boolean).join(', ');
      
      const defaultMessage = `Hello, I'm interested in your property "${property.title}" at ${fullAddress} (${formatPrice(property.price)}).`;
      const finalMessage = message || defaultMessage;
      
      if (contactMethod === 'whatsapp') {
        const phoneNumber = property.agent?.mobile?.replace(/\D/g, '');
        const link = window.location.href;
        const messageText = `${finalMessage}\n\n${link}`;
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageText)}`, '_blank');
        
        await axios.post(`/contacts/property/${id}`, {
          message: messageText,
          contactMethod: 'whatsapp'
        });
        
        setContactSuccess(true);
        return;
      }
      
      if (contactMethod === 'phone') {
        const phoneNumber = property.agent?.mobile?.replace(/\D/g, '');
        window.open(`tel:${phoneNumber}`, '_blank');
        
        await axios.post(`/contacts/property/${id}`, {
          message: 'Requested phone call about property',
          contactMethod: 'phone'
        });
        
        setContactSuccess(true);
        return;
      }
  
      await axios.post(`/contacts/property/${id}`, {
        message: finalMessage,
        contactMethod: contactMethod === 'email' ? 'email' : 'message'
      });
      
      if (contactMethod === 'email') {
        const subject = `Inquiry about ${property.title}`;
        const body = `${finalMessage}\n\n${window.location.href}`;
        window.open(`mailto:${property.agent?.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
      }
      
      setContactSuccess(true);
    } catch (err) {
      console.error('Error sending contact request:', err);
      setError(err.response?.data?.message || err.message || 'Failed to send contact request');
    } finally {
      setContactLoading(false);
      if (contactSuccess) {
        setTimeout(() => {
          setContactOpen(false);
          setMessage('');
        }, 2000);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)'
      }}>
        <CircularProgress 
          size={80} 
          thickness={4}
          sx={{ 
            color: '#78CADC',
            animation: `${pulse} 2s infinite ease-in-out`
          }} 
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)',
        minHeight: '100vh'
      }}>
        <Alert severity="error" sx={{ 
          mb: 3,
          maxWidth: 600,
          mx: 'auto',
          backgroundColor: 'rgba(211, 47, 47, 0.1)',
          border: '1px solid rgba(211, 47, 47, 0.3)'
        }}>
          {error}
        </Alert>
        <PremiumButton 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </PremiumButton>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/properties')}
          sx={{ 
            mt: 2, 
            ml: 2,
            color: '#78CADC',
            borderColor: '#78CADC',
            '&:hover': {
              borderColor: '#5fb4c9',
              backgroundColor: 'rgba(120, 202, 220, 0.1)'
            }
          }}
        >
          Browse Properties
        </Button>
      </Box>
    );
  }

  if (!property) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)',
        minHeight: '100vh'
      }}>
        <Typography variant="h5" gutterBottom sx={{ 
          color: '#fff',
          fontWeight: 600,
          mb: 3
        }}>
          Property not found
        </Typography>
        <PremiumButton 
          onClick={() => navigate('/properties')}
          sx={{ mt: 2 }}
        >
          Browse Properties
        </PremiumButton>
      </Box>
    );
  }

  const getAddressPart = (part) => property.address?.[part] || property.location?.[part] || '';
  const fullAddress = [
    getAddressPart('line1'),
    getAddressPart('street'),
    getAddressPart('city'),
    getAddressPart('state'),
    getAddressPart('zipCode')
  ].filter(Boolean).join(', ');

  const isOwner = user?.role === 'agent' && user.id === property.agent?._id;

  return (
    <Box sx={{ 
      maxWidth: 1600, 
      mx: 'auto', 
      p: { xs: 2, sm: 3, md: 4 },
      pb: { xs: 8, sm: 6 },
      background: 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)',
      minHeight: '100vh'
    }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBack sx={{ color: '#78CADC' }} />}
        onClick={() => navigate('/properties')}
        sx={{
          mb: 4,
          color: '#78CADC',
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: 'rgba(120, 202, 220, 0.1)',
            transform: 'translateX(-5px)'
          },
          transition: 'all 0.3s ease',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '0%',
            height: '2px',
            backgroundColor: '#78CADC',
            transition: 'width 0.3s ease'
          },
          '&:hover:after': {
            width: '100%'
          }
        }}
      >
        Back to Properties
      </Button>

      {/* Main content */}
      <Grid container spacing={{ xs: 3, md: 5 }}>
        <Grid item xs={12} md={8}>
          {/* Image gallery */}
          <Box sx={{ 
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 15px 50px rgba(0, 0, 0, 0.5)',
            mb: 4,
            border: '3px solid #78CADC',
            position: 'relative',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
            },
            transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}>
            <PropertyImageGallery images={property.images || []} />
          </Box>

          {/* Collapsible Description section */}
          {/* Collapsible Description section */}
<PremiumPaper elevation={0} sx={{ mb: 4 }}>
  <Box 
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      minHeight: '50px',
    }}
    onClick={() => setDescriptionExpanded(!descriptionExpanded)}
  >
    <Typography variant="h4" sx={{ 
      fontWeight: 700, 
      color: '#78CADC',
      position: 'relative',
      display: 'inline-block',
      '&:after': {
        content: '""',
        position: 'absolute',
        bottom: -8,
        left: 0,
        width: '60px',
        height: '3px',
        backgroundColor: '#78CADC',
        borderRadius: '3px'
      }
    }}>
      Property Description
    </Typography>
    <IconButton
      sx={{ color: '#78CADC' }}
      onClick={(e) => {
        e.stopPropagation();
        setDescriptionExpanded(!descriptionExpanded);
      }}
    >
      {descriptionExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
    </IconButton>
  </Box>
  
  {/* Show first paragraph always */}
  <Typography 
    paragraph 
    sx={{ 
      whiteSpace: 'pre-line',
      fontSize: '1.1rem',
      lineHeight: 1.8,
      color: 'rgba(255, 255, 255, 0.85)',
      letterSpacing: '0.2px',
      pt: 2,
      mb: descriptionExpanded ? 0 : 2
    }}
  >
    {property.description.split('\n')[0]}
  </Typography>
  
  {/* Collapsible content for remaining paragraphs */}
  <Collapse in={descriptionExpanded}>
    {property.description.split('\n').slice(1).map((paragraph, index) => (
      <Typography 
        key={index}
        paragraph 
        sx={{ 
          whiteSpace: 'pre-line',
          fontSize: '1.1rem',
          lineHeight: 1.8,
          color: 'rgba(255, 255, 255, 0.85)',
          letterSpacing: '0.2px',
          mt: index === 0 ? 0 : 2
        }}
      >
        {paragraph}
      </Typography>
    ))}
  </Collapse>
</PremiumPaper>

          {/* Amenities */}
          <PremiumPaper elevation={0}>
            <Typography variant="h4" gutterBottom sx={{ 
              fontWeight: 700, 
              mb: 3, 
              color: '#78CADC',
              position: 'relative',
              display: 'inline-block',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: '60px',
                height: '3px',
                backgroundColor: '#78CADC',
                borderRadius: '3px'
              }
            }}>
              Amenities
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              mt: 3
            }}>
              {property.amenities?.map((amenity, index) => (
                <Chip 
                  key={index}
                  label={amenity}
                  icon={<Check fontSize="small" sx={{ color: '#78CADC' }} />}
                  sx={{ 
                    backgroundColor: 'rgba(120, 202, 220, 0.15)',
                    border: '1px solid #78CADC',
                    color: '#fff',
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: '0.95rem',
                    padding: '8px 12px',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      backgroundColor: 'rgba(120, 202, 220, 0.25)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </Box>
          </PremiumPaper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 30 }}>
            {/* Price card */}
            <PremiumPaper elevation={3} sx={{ mb: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                position: 'relative'
              }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '2rem', sm: '2.4rem' },
                    color: '#78CADC',
                    lineHeight: 1.2
                  }}
                >
                  {formatPrice(property.price || 0)}
                </Typography>
                <Chip 
                  label={property.status} 
                  sx={{ 
                    ml: 3,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    backgroundColor: property.status === 'For Sale' ? '#78CADC' : '#e74c3c',
                    color: '#0B1011',
                    fontFamily: '"Poppins", sans-serif',
                    height: '32px',
                    '& .MuiChip-label': {
                      padding: '0 12px'
                    }
                  }} 
                />
              </Box>

              {isOwner && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    color: '#78CADC',
                    fontSize: '0.95rem'
                  }}
                >
                  <Check fontSize="small" sx={{ mr: 1, color: '#78CADC' }} />
                  Your listing
                </Typography>
              )}

              {isOwner && (
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mt: 3,
                  mb: 3,
                  borderTop: '1px solid',
                  borderBottom: '1px solid',
                  borderColor: 'rgba(120, 202, 220, 0.3)',
                  py: 3
                }}>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    fullWidth
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textTransform: 'none',
                      color: '#78CADC',
                      borderColor: '#78CADC',
                      fontFamily: '"Poppins", sans-serif',
                      py: 1.5,
                      '&:hover': {
                        borderColor: '#5fb4c9',
                        backgroundColor: 'rgba(120, 202, 220, 0.1)'
                      }
                    }}
                  >
                    Edit Property
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Delete />}
                    onClick={() => setDeleteConfirmOpen(true)}
                    fullWidth
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textTransform: 'none',
                      color: '#e74c3c',
                      borderColor: '#e74c3c',
                      fontFamily: '"Poppins", sans-serif',
                      py: 1.5,
                      '&:hover': {
                        borderColor: '#c0392b',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)'
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              )}

              {/* Contact form */}
              <Box sx={{ mt: 4 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    mb: 3,
                    color: '#78CADC',
                    position: 'relative',
                    display: 'inline-block',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '60px',
                      height: '3px',
                      backgroundColor: '#78CADC',
                      borderRadius: '3px'
                    }
                  }}
                >
                  Contact Agent
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  p: 3,
                  backgroundColor: 'rgba(120, 202, 220, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(120, 202, 220, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 5px 15px rgba(120, 202, 220, 0.2)'
                  }
                }}>
                  <Avatar 
                    src={property.agent?.avatar}
                    sx={{ 
                      width: 64, 
                      height: 64,
                      mr: 3,
                      backgroundColor: '#78CADC',
                      color: '#0B1011',
                      border: '2px solid rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    {property.agent?.name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 700, 
                      color: '#fff',
                      fontSize: '1.1rem'
                    }}>
                      {property.agent?.name || 'N/A'}
                    </Typography>
                    {property.agent?.company && (
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem'
                      }}>
                        {property.agent.company}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Contact button */}
                <PremiumButton 
                  fullWidth
                  size="large"
                  onClick={handleContactOpen}
                  startIcon={<Email sx={{ fontSize: '1.4rem' }} />}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    '&:hover': {
                      animation: `${pulse} 1.5s infinite`
                    }
                  }}
                >
                  Contact Agent
                </PremiumButton>
              </Box>
            </PremiumPaper>

            {/* Map section */}
            <PremiumPaper elevation={3}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '1.3rem',
                  mb: 3,
                  color: '#78CADC',
                  position: 'relative',
                  display: 'inline-block',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '60px',
                    height: '3px',
                    backgroundColor: '#78CADC',
                    borderRadius: '3px'
                  }
                }}
              >
                Location
              </Typography>
              <Box sx={{ 
                height: 350,
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'rgba(120, 202, 220, 0.3)',
                mb: 2
              }}>
                <PropertyMap 
                  location={property.location} 
                  address={property.address || {}} 
                />
              </Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 2,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '1rem'
                }}
              >
                <LocationOn fontSize="medium" sx={{ mr: 1.5, color: '#78CADC' }} />
                {fullAddress}
              </Typography>
            </PremiumPaper>
          </Box>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#0B1011',
            color: '#fff',
            border: '2px solid #78CADC',
            borderRadius: '16px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#78CADC', 
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 700,
          fontSize: '1.4rem',
          borderBottom: '1px solid rgba(120, 202, 220, 0.3)',
          py: 3
        }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography sx={{ 
            color: 'rgba(255, 255, 255, 0.85)', 
            fontFamily: '"Poppins", sans-serif',
            fontSize: '1.05rem',
            lineHeight: 1.6
          }}>
            Are you sure you want to delete this property? This action cannot be undone.
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          py: 2,
          borderTop: '1px solid rgba(120, 202, 220, 0.3)'
        }}>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)}
            disabled={deleting}
            sx={{ 
              color: '#78CADC', 
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(120, 202, 220, 0.1)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            sx={{
              color: '#e74c3c',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(231, 76, 60, 0.1)'
              }
            }}
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} sx={{ color: '#e74c3c' }} /> : <Delete />}
          >
            {deleting ? 'Deleting...' : 'Delete Property'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog 
        open={contactOpen} 
        onClose={() => {
          setContactOpen(false);
          setContactSuccess(false);
        }} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#0B1011',
            color: '#fff',
            border: '2px solid #78CADC',
            borderRadius: '16px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#78CADC', 
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 700,
          fontSize: '1.4rem',
          borderBottom: '1px solid rgba(120, 202, 220, 0.3)',
          py: 3
        }}>
          Contact Agent
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {contactSuccess ? (
            <Alert severity="success" sx={{ 
              mb: 3,
              backgroundColor: 'rgba(46, 125, 50, 0.2)',
              border: '1px solid rgba(46, 125, 50, 0.5)'
            }}>
              Your contact request has been sent successfully!
            </Alert>
          ) : (
            <>
              <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
                <RadioGroup
                  value={contactMethod}
                  onChange={(e) => setContactMethod(e.target.value)}
                  row
                  sx={{ justifyContent: 'space-between', gap: 2 }}
                >
                  <FormControlLabel 
                    value="email" 
                    control={<Radio sx={{ 
                      color: '#78CADC',
                      '&.Mui-checked': {
                        color: '#78CADC'
                      }
                    }} />} 
                    label={<Typography sx={{ 
                      color: '#fff', 
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 500
                    }}>Email</Typography>} 
                  />
                  <FormControlLabel 
                    value="whatsapp" 
                    control={<Radio sx={{ 
                      color: '#78CADC',
                      '&.Mui-checked': {
                        color: '#78CADC'
                      }
                    }} />} 
                    label={<Typography sx={{ 
                      color: '#fff', 
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 500
                    }}>WhatsApp</Typography>} 
                  />
                  <FormControlLabel 
                    value="phone" 
                    control={<Radio sx={{ 
                      color: '#78CADC',
                      '&.Mui-checked': {
                        color: '#78CADC'
                      }
                    }} />} 
                    label={<Typography sx={{ 
                      color: '#fff', 
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 500
                    }}>Phone Call</Typography>} 
                  />
                </RadioGroup>
              </FormControl>

              {(contactMethod === 'email' || contactMethod === 'whatsapp') && (
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label={contactMethod === 'whatsapp' ? 'WhatsApp Message' : contactMethod === 'email' ? 'Email Content' : 'Your Message'}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{ mb: 3 }}
                  InputProps={{
                    style: {
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      color: '#fff',
                      fontFamily: '"Poppins", sans-serif',
                      backgroundColor: 'rgba(120, 202, 220, 0.1)',
                      borderRadius: '8px',
                      padding: '12px'
                    }
                  }}
                  InputLabelProps={{
                    style: {
                      color: '#78CADC',
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 500,
                      fontSize: '1rem'
                    }
                  }}
                />
              )}

              {contactMethod === 'phone' && (
                <Alert severity="info" sx={{ 
                  mb: 3,
                  backgroundColor: 'rgba(120, 202, 220, 0.1)',
                  border: '1px solid rgba(120, 202, 220, 0.3)'
                }}>
                  Clicking "Send Request" will initiate a phone call to the agent and create a contact record.
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          py: 2,
          borderTop: '1px solid rgba(120, 202, 220, 0.3)'
        }}>
          <Button 
            onClick={() => {
              setContactOpen(false);
              setContactSuccess(false);
            }}
            sx={{ 
              color: '#78CADC', 
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(120, 202, 220, 0.1)'
              }
            }}
          >
            {contactSuccess ? 'Close' : 'Cancel'}
          </Button>
          {!contactSuccess && (
            <PremiumButton 
              onClick={handleContactSubmit} 
              disabled={contactLoading || (( contactMethod === 'email' || contactMethod === 'whatsapp') && !message.trim())}
              startIcon={contactLoading ? <CircularProgress size={20} sx={{ color: '#0B1011' }} /> : null}
              sx={{
                minWidth: '180px'
              }}
            >
              {contactMethod === 'phone' ? 'Call Agent' : 
               contactMethod === 'whatsapp' ? 'Open WhatsApp' : 
               contactMethod === 'email' ? 'Send Email' : 'Send Message'}
            </PremiumButton>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertyDetails;

// import { useState, useEffect } from 'react';
// import { 
//   Box, Typography, Grid, Divider, Chip, Button, Paper, 
//   CircularProgress, Alert, Dialog, DialogActions, 
//   DialogContent, DialogTitle, IconButton, useMediaQuery, 
//   Stack, Avatar, FormControl, InputLabel, Select, MenuItem,
//   TextField, RadioGroup, FormControlLabel, Radio, Collapse,
//   Tooltip, Badge
// } from '@mui/material';
// import { 
//   LocationOn, KingBed, Bathtub, SquareFoot, 
//   Phone, Email, Edit, Delete, ArrowBack,
//   WhatsApp, Apartment, MeetingRoom, Check, Close,
//   KeyboardArrowDown, KeyboardArrowUp, Favorite,
//   Share, Print, Fullscreen, FullscreenExit
// } from '@mui/icons-material';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { useProperties } from '../../context/PropertiesContext';
// import PropertyImageGallery from '../../components/property/PropertyImageGallery';
// import PropertyMap from '../../components/property/PropertyMap';
// import { formatPrice } from '../../utils/format';
// import axios from '../../services/axios';
// import { styled } from '@mui/material/styles';

// // Styled components
// const GlassPaper = styled(Paper)(({ theme }) => ({
//   backgroundColor: 'rgba(255, 255, 255, 0.05)',
//   backdropFilter: 'blur(10px)',
//   borderRadius: theme.shape.borderRadius * 2,
//   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
//   border: '1px solid rgba(255, 255, 255, 0.1)',
//   padding: theme.spacing(3),
//   transition: 'all 0.3s ease',
//   '&:hover': {
//     transform: 'translateY(-5px)',
//     boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
//   }
// }));

// const PrimaryButton = styled(Button)(({ theme }) => ({
//   background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
//   color: 'white',
//   fontWeight: 600,
//   padding: theme.spacing(1.5, 3),
//   borderRadius: '12px',
//   textTransform: 'none',
//   fontSize: '1rem',
//   letterSpacing: '0.5px',
//   '&:hover': {
//     background: 'linear-gradient(135deg, #5B63EE 0%, #0000EE 100%)',
//     boxShadow: '0 4px 12px rgba(107, 115, 255, 0.4)'
//   },
//   transition: 'all 0.3s ease',
// }));

// const SecondaryButton = styled(Button)(({ theme }) => ({
//   border: '2px solid #6B73FF',
//   color: '#6B73FF',
//   fontWeight: 600,
//   padding: theme.spacing(1.5, 3),
//   borderRadius: '12px',
//   textTransform: 'none',
//   fontSize: '1rem',
//   letterSpacing: '0.5px',
//   '&:hover': {
//     backgroundColor: 'rgba(107, 115, 255, 0.1)',
//     borderColor: '#5B63EE'
//   },
//   transition: 'all 0.3s ease',
// }));

// const PropertyDetails = () => {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { 
//     property: fetchedProperty, 
//     getProperty, 
//     deleteProperty,
//     clearProperty
//   } = useProperties();
  
//   const [property, setProperty] = useState(location.state?.updatedProperty || null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [deleteError, setDeleteError] = useState(null);
//   const [contactOpen, setContactOpen] = useState(false);
//   const [contactMethod, setContactMethod] = useState('message');
//   const [message, setMessage] = useState('');
//   const [contactLoading, setContactLoading] = useState(false);
//   const [contactSuccess, setContactSuccess] = useState(false);
//   const [descriptionExpanded, setDescriptionExpanded] = useState(false);
//   const [favorite, setFavorite] = useState(false);
//   const [fullscreenGallery, setFullscreenGallery] = useState(false);
//   const isMobile = useMediaQuery('(max-width:600px)');

//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         if (!location.state?.updatedProperty) {
//           const data = await getProperty(id);
//           setProperty(data);
//         }
//       } catch (err) {
//         console.error('Error fetching property:', err);
//         setError(err.response?.data?.message || err.message || 'Failed to load property');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchProperty();

//     return () => clearProperty();
//   }, [id, getProperty, location.state, clearProperty]);

//   const handleDelete = async () => {
//     try {
//       setDeleting(true);
//       setDeleteError(null);
      
//       await deleteProperty(id);
      
//       navigate('/properties', { 
//         state: { 
//           message: 'Property deleted successfully',
//           severity: 'success'
//         } 
//       });
//     } catch (err) {
//       console.error('Delete error:', err);
//       setDeleteError(err.response?.data?.message || err.message || 'Failed to delete property');
//     } finally {
//       setDeleting(false);
//       setDeleteConfirmOpen(false);
//     }
//   };

//   const handleEdit = () => {
//     navigate(`/properties/${id}/edit`, { 
//       state: { property } 
//     });
//   };

//   const handleContactOpen = () => {
//     const fullAddress = [
//       property.address?.line1,
//       property.address?.street,
//       property.address?.city,
//       property.address?.state,
//       property.address?.zipCode
//     ].filter(Boolean).join(', ');
    
//     const propertyLink = window.location.href;
//     const prefilledMessage = `Hello, I'm interested in your property "${property.title}" at ${fullAddress} (${formatPrice(property.price)}).\n\n${propertyLink}\n\nCould you please provide more information about:\n- Availability\n- Viewing options\n- Any additional details`;
    
//     setMessage(prefilledMessage);
//     setContactOpen(true);
//     setContactSuccess(false);
//     setContactMethod('message');
//   };

//   const handleContactSubmit = async () => {
//     try {
//       setContactLoading(true);
      
//       const fullAddress = [
//         property.address?.line1,
//         property.address?.street,
//         property.address?.city,
//         property.address?.state,
//         property.address?.zipCode
//       ].filter(Boolean).join(', ');
      
//       const defaultMessage = `Hello, I'm interested in your property "${property.title}" at ${fullAddress} (${formatPrice(property.price)}).`;
//       const finalMessage = message || defaultMessage;
      
//       if (contactMethod === 'whatsapp') {
//         const phoneNumber = property.agent?.mobile?.replace(/\D/g, '');
//         const link = window.location.href;
//         const messageText = `${finalMessage}\n\n${link}`;
//         window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageText)}`, '_blank');
        
//         await axios.post(`/contacts/property/${id}`, {
//           message: messageText,
//           contactMethod: 'whatsapp'
//         });
        
//         setContactSuccess(true);
//         return;
//       }
      
//       if (contactMethod === 'phone') {
//         const phoneNumber = property.agent?.mobile?.replace(/\D/g, '');
//         window.open(`tel:${phoneNumber}`, '_blank');
        
//         await axios.post(`/contacts/property/${id}`, {
//           message: 'Requested phone call about property',
//           contactMethod: 'phone'
//         });
        
//         setContactSuccess(true);
//         return;
//       }
  
//       await axios.post(`/contacts/property/${id}`, {
//         message: finalMessage,
//         contactMethod: contactMethod === 'email' ? 'email' : 'message'
//       });
      
//       if (contactMethod === 'email') {
//         const subject = `Inquiry about ${property.title}`;
//         const body = `${finalMessage}\n\n${window.location.href}`;
//         window.open(`mailto:${property.agent?.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
//       }
      
//       setContactSuccess(true);
//     } catch (err) {
//       console.error('Error sending contact request:', err);
//       setError(err.response?.data?.message || err.message || 'Failed to send contact request');
//     } finally {
//       setContactLoading(false);
//       if (contactSuccess) {
//         setTimeout(() => {
//           setContactOpen(false);
//           setMessage('');
//         }, 2000);
//       }
//     }
//   };

//   const getAddressPart = (part) => property.address?.[part] || property.location?.[part] || '';
//   const fullAddress = [
//     getAddressPart('line1'),
//     getAddressPart('street'),
//     getAddressPart('city'),
//     getAddressPart('state'),
//     getAddressPart('zipCode')
//   ].filter(Boolean).join(', ');

//   const isOwner = user?.role === 'agent' && user.id === property.agent?._id;

//   if (loading) {
//     return (
//       <Box sx={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center',
//         minHeight: '100vh',
//         background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
//       }}>
//         <CircularProgress 
//           size={80} 
//           thickness={4}
//           sx={{ 
//             color: '#6B73FF',
//           }} 
//         />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ 
//         p: 3, 
//         textAlign: 'center',
//         background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
//         minHeight: '100vh'
//       }}>
//         <Alert severity="error" sx={{ 
//           mb: 3,
//           maxWidth: 600,
//           mx: 'auto',
//         }}>
//           {error}
//         </Alert>
//         <PrimaryButton 
//           onClick={() => window.location.reload()}
//           sx={{ mt: 2 }}
//         >
//           Retry
//         </PrimaryButton>
//         <SecondaryButton 
//           onClick={() => navigate('/properties')}
//           sx={{ mt: 2, ml: 2 }}
//         >
//           Browse Properties
//         </SecondaryButton>
//       </Box>
//     );
//   }

//   if (!property) {
//     return (
//       <Box sx={{ 
//         p: 3, 
//         textAlign: 'center',
//         background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
//         minHeight: '100vh'
//       }}>
//         <Typography variant="h5" gutterBottom sx={{ 
//           fontWeight: 600,
//           mb: 3
//         }}>
//           Property not found
//         </Typography>
//         <PrimaryButton 
//           onClick={() => navigate('/properties')}
//           sx={{ mt: 2 }}
//         >
//           Browse Properties
//         </PrimaryButton>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ 
//       maxWidth: 1600, 
//       mx: 'auto', 
//       p: { xs: 2, sm: 3, md: 4 },
//       pb: { xs: 8, sm: 6 },
//       background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
//       minHeight: '100vh'
//     }}>
//       {/* Back button */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//         <Button
//           startIcon={<ArrowBack />}
//           onClick={() => navigate('/properties')}
//           sx={{
//             color: '#6B73FF',
//             fontWeight: 600,
//             '&:hover': {
//               backgroundColor: 'rgba(107, 115, 255, 0.1)'
//             }
//           }}
//         >
//           Back to Properties
//         </Button>
        
//         <Box>
//           <Tooltip title="Add to favorites">
//             <IconButton 
//               onClick={() => setFavorite(!favorite)}
//               sx={{ 
//                 color: favorite ? '#ff4081' : 'inherit',
//                 mr: 1
//               }}
//             >
//               <Favorite />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Share property">
//             <IconButton sx={{ mr: 1 }}>
//               <Share />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Print details">
//             <IconButton onClick={() => window.print()}>
//               <Print />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       </Box>

//       {/* Main content */}
//       <Grid container spacing={{ xs: 2, md: 4 }}>
//         <Grid item xs={12} md={8}>
//           {/* Image gallery */}
//           <Box sx={{ 
//             borderRadius: '16px',
//             overflow: 'hidden',
//             boxShadow: '0 15px 50px rgba(0, 0, 0, 0.1)',
//             mb: 4,
//             position: 'relative',
//             border: '1px solid rgba(0, 0, 0, 0.1)',
//             backgroundColor: 'white'
//           }}>
//             <PropertyImageGallery 
//               images={property.images || []} 
//               fullscreen={fullscreenGallery}
//               onFullscreenChange={setFullscreenGallery}
//             />
            
//             <IconButton
//               onClick={() => setFullscreenGallery(!fullscreenGallery)}
//               sx={{
//                 position: 'absolute',
//                 bottom: 16,
//                 right: 16,
//                 backgroundColor: 'rgba(0, 0, 0, 0.6)',
//                 color: 'white',
//                 '&:hover': {
//                   backgroundColor: 'rgba(0, 0, 0, 0.8)'
//                 }
//               }}
//             >
//               {fullscreenGallery ? <FullscreenExit /> : <Fullscreen />}
//             </IconButton>
//           </Box>

//           {/* Title and basic info */}
//           <GlassPaper elevation={0} sx={{ mb: 4 }}>
//             <Typography variant="h3" sx={{ 
//               fontWeight: 700, 
//               mb: 2,
//               color: 'text.primary'
//             }}>
//               {property.title}
//             </Typography>
            
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//               <LocationOn color="primary" sx={{ mr: 1 }} />
//               <Typography variant="body1" color="text.secondary">
//                 {fullAddress}
//               </Typography>
//             </Box>
            
//             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
//               <Chip 
//                 icon={<SquareFoot />} 
//                 label={`${property.area} sqft`} 
//                 variant="outlined"
//                 color="primary"
//               />
//               <Chip 
//                 icon={<KingBed />} 
//                 label={`${property.bedrooms} Bed`} 
//                 variant="outlined"
//                 color="primary"
//               />
//               <Chip 
//                 icon={<Bathtub />} 
//                 label={`${property.bathrooms} Bath`} 
//                 variant="outlined"
//                 color="primary"
//               />
//               {property.type && (
//                 <Chip 
//                   icon={<Apartment />} 
//                   label={property.type} 
//                   variant="outlined"
//                   color="primary"
//                 />
//               )}
//             </Box>
            
//             <Divider sx={{ my: 3 }} />
            
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <Typography variant="h5" sx={{ fontWeight: 700 }}>
//                 {formatPrice(property.price || 0)}
//               </Typography>
//               <Chip 
//                 label={property.status} 
//                 color={property.status === 'For Sale' ? 'primary' : 'error'}
//                 sx={{ fontWeight: 700 }}
//               />
//             </Box>
//           </GlassPaper>

//           {/* Description section */}
//           <GlassPaper elevation={0} sx={{ mb: 4 }}>
//             <Box 
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 cursor: 'pointer',
//                 minHeight: '50px',
//               }}
//               onClick={() => setDescriptionExpanded(!descriptionExpanded)}
//             >
//               <Typography variant="h5" sx={{ 
//                 fontWeight: 700, 
//                 color: 'text.primary'
//               }}>
//                 Property Description
//               </Typography>
//               <IconButton
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setDescriptionExpanded(!descriptionExpanded);
//                 }}
//               >
//                 {descriptionExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
//               </IconButton>
//             </Box>
            
//             {/* Show first paragraph always */}
//             <Typography 
//               paragraph 
//               sx={{ 
//                 whiteSpace: 'pre-line',
//                 fontSize: '1.1rem',
//                 lineHeight: 1.8,
//                 color: 'text.secondary',
//                 pt: 2,
//                 mb: descriptionExpanded ? 0 : 2
//               }}
//             >
//               {property.description.split('\n')[0]}
//             </Typography>
            
//             {/* Collapsible content for remaining paragraphs */}
//             <Collapse in={descriptionExpanded}>
//               {property.description.split('\n').slice(1).map((paragraph, index) => (
//                 <Typography 
//                   key={index}
//                   paragraph 
//                   sx={{ 
//                     whiteSpace: 'pre-line',
//                     fontSize: '1.1rem',
//                     lineHeight: 1.8,
//                     color: 'text.secondary',
//                     mt: index === 0 ? 0 : 2
//                   }}
//                 >
//                   {paragraph}
//                 </Typography>
//               ))}
//             </Collapse>
//           </GlassPaper>

//           {/* Amenities */}
//           <GlassPaper elevation={0}>
//             <Typography variant="h5" gutterBottom sx={{ 
//               fontWeight: 700, 
//               mb: 3, 
//               color: 'text.primary'
//             }}>
//               Amenities
//             </Typography>
//             <Grid container spacing={2}>
//               {property.amenities?.map((amenity, index) => (
//                 <Grid item xs={6} sm={4} key={index}>
//                   <Box sx={{ 
//                     display: 'flex', 
//                     alignItems: 'center',
//                     p: 1.5,
//                     borderRadius: '8px',
//                     backgroundColor: 'rgba(107, 115, 255, 0.05)',
//                     '&:hover': {
//                       backgroundColor: 'rgba(107, 115, 255, 0.1)'
//                     }
//                   }}>
//                     <Check color="primary" fontSize="small" sx={{ mr: 1.5 }} />
//                     <Typography variant="body1">{amenity}</Typography>
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>
//           </GlassPaper>
//         </Grid>

//         {/* Sidebar */}
//         <Grid item xs={12} md={4}>
//           <Box sx={{ position: 'sticky', top: 20 }}>
//             {/* Contact card */}
//             <GlassPaper elevation={3} sx={{ mb: 4 }}>
//               <Typography variant="h5" gutterBottom sx={{ 
//                 fontWeight: 700,
//                 mb: 3,
//                 color: 'text.primary'
//               }}>
//                 Contact Agent
//               </Typography>
              
//               <Box sx={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 mb: 3,
//                 p: 3,
//                 backgroundColor: 'rgba(107, 115, 255, 0.05)',
//                 borderRadius: '12px',
//                 border: '1px solid rgba(107, 115, 255, 0.1)',
//               }}>
//                 <Badge
//                   overlap="circular"
//                   anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//                   badgeContent={
//                     <Box sx={{ 
//                       backgroundColor: '#4CAF50',
//                       width: 12,
//                       height: 12,
//                       borderRadius: '50%',
//                       border: '2px solid white'
//                     }} />
//                   }
//                 >
//                   <Avatar 
//                     src={property.agent?.avatar}
//                     sx={{ 
//                       width: 64, 
//                       height: 64,
//                       mr: 3,
//                       backgroundColor: '#6B73FF',
//                       color: 'white'
//                     }}
//                   >
//                     {property.agent?.name?.charAt(0)}
//                   </Avatar>
//                 </Badge>
//                 <Box>
//                   <Typography variant="subtitle1" sx={{ 
//                     fontWeight: 700, 
//                     fontSize: '1.1rem'
//                   }}>
//                     {property.agent?.name || 'N/A'}
//                   </Typography>
//                   {property.agent?.company && (
//                     <Typography variant="body2" sx={{ 
//                       color: 'text.secondary',
//                       fontSize: '0.9rem'
//                     }}>
//                       {property.agent.company}
//                     </Typography>
//                   )}
//                 </Box>
//               </Box>

//               {/* Contact buttons */}
//               <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   startIcon={<Phone />}
//                   onClick={() => {
//                     setContactMethod('phone');
//                     handleContactOpen();
//                   }}
//                   sx={{
//                     backgroundColor: '#4CAF50',
//                     '&:hover': {
//                       backgroundColor: '#3e8e41'
//                     }
//                   }}
//                 >
//                   Call
//                 </Button>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   startIcon={<WhatsApp />}
//                   onClick={() => {
//                     setContactMethod('whatsapp');
//                     handleContactOpen();
//                   }}
//                   sx={{
//                     backgroundColor: '#25D366',
//                     '&:hover': {
//                       backgroundColor: '#1da851'
//                     }
//                   }}
//                 >
//                   WhatsApp
//                 </Button>
//               </Box>
              
//               <PrimaryButton 
//                 fullWidth
//                 size="large"
//                 onClick={handleContactOpen}
//                 startIcon={<Email />}
//                 sx={{
//                   mb: 2
//                 }}
//               >
//                 Send Message
//               </PrimaryButton>
              
//               <Typography variant="body2" sx={{ 
//                 textAlign: 'center',
//                 color: 'text.secondary',
//                 mt: 2
//               }}>
//                 Response time: usually within 24 hours
//               </Typography>
//             </GlassPaper>

//             {/* Map section */}
//             <GlassPaper elevation={3}>
//               <Typography variant="h5" gutterBottom sx={{ 
//                 fontWeight: 700,
//                 mb: 3,
//                 color: 'text.primary'
//               }}>
//                 Location
//               </Typography>
//               <Box sx={{ 
//                 height: 300,
//                 borderRadius: '12px',
//                 overflow: 'hidden',
//                 border: '1px solid rgba(0, 0, 0, 0.1)',
//                 mb: 2
//               }}>
//                 <PropertyMap 
//                   location={property.location} 
//                   address={property.address || {}} 
//                 />
//               </Box>
//               <Typography variant="body1" sx={{ 
//                 mt: 2,
//                 display: 'flex',
//                 alignItems: 'center',
//                 color: 'text.secondary',
//                 fontSize: '1rem'
//               }}>
//                 <LocationOn color="primary" sx={{ mr: 1.5 }} />
//                 {fullAddress}
//               </Typography>
//             </GlassPaper>
            
//             {/* Owner actions */}
//             {isOwner && (
//               <GlassPaper elevation={3} sx={{ mt: 4 }}>
//                 <Typography variant="h6" gutterBottom sx={{ 
//                   fontWeight: 700,
//                   mb: 2,
//                   color: 'text.primary'
//                 }}>
//                   Property Management
//                 </Typography>
//                 <Box sx={{ display: 'flex', gap: 2 }}>
//                   <Button
//                     variant="outlined"
//                     startIcon={<Edit />}
//                     onClick={handleEdit}
//                     fullWidth
//                     sx={{
//                       fontWeight: 600,
//                       color: '#6B73FF',
//                       borderColor: '#6B73FF',
//                       '&:hover': {
//                         borderColor: '#5B63EE',
//                         backgroundColor: 'rgba(107, 115, 255, 0.1)'
//                       }
//                     }}
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     startIcon={<Delete />}
//                     onClick={() => setDeleteConfirmOpen(true)}
//                     fullWidth
//                     sx={{
//                       fontWeight: 600,
//                       color: '#f44336',
//                       borderColor: '#f44336',
//                       '&:hover': {
//                         borderColor: '#d32f2f',
//                         backgroundColor: 'rgba(244, 67, 54, 0.1)'
//                       }
//                     }}
//                   >
//                     Delete
//                   </Button>
//                 </Box>
//               </GlassPaper>
//             )}
//           </Box>
//         </Grid>
//       </Grid>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteConfirmOpen}
//         onClose={() => setDeleteConfirmOpen(false)}
//         maxWidth="xs"
//         fullWidth
//       >
//         <DialogTitle sx={{ fontWeight: 700 }}>
//           Confirm Delete
//         </DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to delete this property? This action cannot be undone.
//           </Typography>
//           {deleteError && (
//             <Alert severity="error" sx={{ mt: 2 }}>
//               {deleteError}
//             </Alert>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button 
//             onClick={() => setDeleteConfirmOpen(false)}
//             disabled={deleting}
//             color="primary"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleDelete}
//             color="error"
//             disabled={deleting}
//             startIcon={deleting ? <CircularProgress size={20} /> : <Delete />}
//           >
//             {deleting ? 'Deleting...' : 'Delete'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Contact Dialog */}
//       <Dialog 
//         open={contactOpen} 
//         onClose={() => {
//           setContactOpen(false);
//           setContactSuccess(false);
//         }} 
//         maxWidth="md" 
//         fullWidth
//       >
//         <DialogTitle sx={{ fontWeight: 700 }}>
//           Contact Agent
//         </DialogTitle>
//         <DialogContent>
//           {contactSuccess ? (
//             <Alert severity="success" sx={{ mb: 3 }}>
//               Your contact request has been sent successfully!
//             </Alert>
//           ) : (
//             <>
//               <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
//                 <RadioGroup
//                   value={contactMethod}
//                   onChange={(e) => setContactMethod(e.target.value)}
//                   row
//                   sx={{ justifyContent: 'space-between', gap: 2 }}
//                 >
//                   <FormControlLabel 
//                     value="email" 
//                     control={<Radio color="primary" />} 
//                     label="Email" 
//                   />
//                   <FormControlLabel 
//                     value="whatsapp" 
//                     control={<Radio color="primary" />} 
//                     label="WhatsApp" 
//                   />
//                   <FormControlLabel 
//                     value="phone" 
//                     control={<Radio color="primary" />} 
//                     label="Phone Call" 
//                   />
//                 </RadioGroup>
//               </FormControl>

//               {(contactMethod === 'email' || contactMethod === 'whatsapp') && (
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={8}
//                   label={contactMethod === 'whatsapp' ? 'WhatsApp Message' : 'Email Content'}
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   sx={{ mb: 3 }}
//                 />
//               )}

//               {contactMethod === 'phone' && (
//                 <Alert severity="info" sx={{ mb: 3 }}>
//                   Clicking "Send Request" will initiate a phone call to the agent and create a contact record.
//                 </Alert>
//               )}
//             </>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button 
//             onClick={() => {
//               setContactOpen(false);
//               setContactSuccess(false);
//             }}
//             color="primary"
//           >
//             {contactSuccess ? 'Close' : 'Cancel'}
//           </Button>
//           {!contactSuccess && (
//             <PrimaryButton 
//               onClick={handleContactSubmit} 
//               disabled={contactLoading || ((contactMethod === 'email' || contactMethod === 'whatsapp') && !message.trim())}
//               startIcon={contactLoading ? <CircularProgress size={20} color="inherit" /> : null}
//             >
//               {contactMethod === 'phone' ? 'Call Agent' : 
//                contactMethod === 'whatsapp' ? 'Open WhatsApp' : 
//                'Send Email'}
//             </PrimaryButton>
//           )}
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default PropertyDetails;