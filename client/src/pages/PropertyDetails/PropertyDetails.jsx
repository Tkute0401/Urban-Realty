import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, Typography, Grid, Divider, Chip, Button, Paper, 
  CircularProgress, Alert, Dialog, DialogActions, 
  DialogContent, DialogTitle, IconButton, useMediaQuery, 
  Stack, Avatar, FormControl, InputLabel, Select, MenuItem,
  TextField, RadioGroup, FormControlLabel, Radio, Collapse,
  Tabs, Tab, Container
} from '@mui/material';
import { 
  LocationOn, KingBed, Bathtub, SquareFoot, 
  Phone, Email, Edit, Delete, ArrowBack,
  WhatsApp, Apartment, MeetingRoom, Check, Close,
  KeyboardArrowDown, KeyboardArrowUp,
  Share, Bookmark, ChevronLeft, ChevronRight
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

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#78CADC',
  position: 'relative',
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(4),
  fontFamily: '"Poppins", sans-serif',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '60px',
    height: '3px',
    backgroundColor: '#78CADC',
    borderRadius: '3px'
  }
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
  const [activeTab, setActiveTab] = useState('overview');
  const [isSticky, setIsSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [originalNavPosition, setOriginalNavPosition] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');
  
  // Refs for section navigation
  const overviewRef = useRef(null);
  const highlightsRef = useRef(null);
  const aroundRef = useRef(null);
  const moreRef = useRef(null);
  const floorplanRef = useRef(null);
  const amenitiesRef = useRef(null);
  const developerRef = useRef(null);
  const similarRef = useRef(null);
  const galleryRef = useRef(null);
  const navRef = useRef(null);

  const tabsRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const handleScroll = useCallback((direction) => {
  if (tabsRef.current) {
    const scrollableElement = tabsRef.current.querySelector('.MuiTabs-scroller');
    if (scrollableElement) {
      const scrollAmount = 200; // Adjust this value to control how much to scroll
      const currentScroll = scrollableElement.scrollLeft;
      const newScroll = direction === 'left' 
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;
      
      scrollableElement.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });

      // Update button visibility after scroll completes
      setTimeout(() => {
        checkScrollButtons();
      }, 300);
    }
  }
}, []);

const checkScrollButtons = useCallback(() => {
  if (tabsRef.current) {
    const scrollableElement = tabsRef.current.querySelector('.MuiTabs-scroller');
    if (scrollableElement) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollableElement;
      const tolerance = 5;
      
      setShowLeftScroll(scrollLeft > tolerance);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - tolerance);
    }
  }
}, []);
useEffect(() => {
  const tabsElement = tabsRef.current;
  let scrollableElement = null;
  
  if (tabsElement) {
    scrollableElement = tabsElement.querySelector('.MuiTabs-scroller');
  }
  
  if (scrollableElement) {
    // Initial check
    checkScrollButtons();
    
    // Add scroll event listener to the actual scrollable element
    scrollableElement.addEventListener('scroll', checkScrollButtons);
    
    // Add resize observer for responsive behavior
    const resizeObserver = new ResizeObserver(() => {
      checkScrollButtons();
    });
    resizeObserver.observe(scrollableElement);
    
    return () => {
      scrollableElement.removeEventListener('scroll', checkScrollButtons);
      resizeObserver.disconnect();
    };
  }
}, [checkScrollButtons]);

  useEffect(() => {
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      tabsElement.addEventListener('scroll', checkScrollButtons);
      return () => tabsElement.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

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

  // Calculate header height on mount and resize
  useEffect(() => {
    const calculateHeaderHeight = () => {
      const header = document.querySelector('.header') || document.querySelector('header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      } else {
        // Fallback if header class isn't found
        setHeaderHeight(70); // Approximate header height
      }
    };

    calculateHeaderHeight();
    window.addEventListener('resize', calculateHeaderHeight);
    
    return () => window.removeEventListener('resize', calculateHeaderHeight);
  }, []);

  useEffect(() => {
    const tabsElement = tabsRef.current;
    if (!tabsElement) return;

    const handleResize = () => {
      checkScrollButtons();
    };

    checkScrollButtons();

    tabsElement.addEventListener('scroll', checkScrollButtons);
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(tabsElement);

    return () => {
      tabsElement.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [checkScrollButtons]);

  useEffect(() => {
    const calculateOriginalPosition = () => {
      if (navRef.current && galleryRef.current) {
        const galleryBottom = galleryRef.current.offsetTop + galleryRef.current.offsetHeight;
        setOriginalNavPosition(galleryBottom);
      }
    };

    // Calculate on mount and window resize
    calculateOriginalPosition();
    window.addEventListener('resize', calculateOriginalPosition);
    
    return () => window.removeEventListener('resize', calculateOriginalPosition);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollPosition / documentHeight) * 100;
      setScrollProgress(progress);
      setShowBackToTop(scrollPosition > 300);
      
      if (navRef.current) {
        const navOffset = navRef.current.offsetTop;
        const shouldBeSticky = scrollPosition > (navOffset - headerHeight) && scrollPosition > 50;
        
        setIsSticky(shouldBeSticky);
      }
      
      updateActiveTab(scrollPosition);
    };
    
    const updateActiveTab = (scrollPosition) => {
      const offset = isSticky ? headerHeight + 100 : 150;
      const scrollPositionWithOffset = scrollPosition + offset;
      
      if (similarRef.current && scrollPositionWithOffset >= similarRef.current.offsetTop) {
        setActiveTab('similar');
      } else if (developerRef.current && scrollPositionWithOffset >= developerRef.current.offsetTop) {
        setActiveTab('developer');
      } else if (amenitiesRef.current && scrollPositionWithOffset >= amenitiesRef.current.offsetTop) {
        setActiveTab('amenities');
      } else if (floorplanRef.current && scrollPositionWithOffset >= floorplanRef.current.offsetTop) {
        setActiveTab('floorplan');
      } else if (moreRef.current && scrollPositionWithOffset >= moreRef.current.offsetTop) {
        setActiveTab('more');
      } else if (aroundRef.current && scrollPositionWithOffset >= aroundRef.current.offsetTop) {
        setActiveTab('around');
      } else if (highlightsRef.current && scrollPositionWithOffset >= highlightsRef.current.offsetTop) {
        setActiveTab('highlights');
      } else if (overviewRef.current && scrollPositionWithOffset >= overviewRef.current.offsetTop) {
        setActiveTab('overview');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headerHeight, isSticky]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (ref) => {
    const offset = isSticky ? headerHeight + 80 : 150;
    window.scrollTo({
      top: ref.current.offsetTop - offset,
      behavior: 'smooth'
    });
  };

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

  if (error || !property) {
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
          {error || 'Property not found'}
        </Alert>
        <PremiumButton 
          onClick={() => error ? window.location.reload() : navigate('/properties')}
          sx={{ mt: 2 }}
        >
          {error ? 'Retry' : 'Browse Properties'}
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
      background: 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)',
      minHeight: '100vh'
    }}>
      {/* Property Header Section */}
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700,
            color: '#78CADC',
            mb: 1
          }}>
            {property.title}
          </Typography>
          
          <Typography variant="body1" sx={{ 
            color: 'rgba(255, 255, 255, 0.85)',
            mb: 2,
            fontSize: '1.1rem'
          }}>
            By {property.developer?.name || 'N/A'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LocationOn sx={{ color: '#78CADC', mr: 1 }} />
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              {fullAddress}
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Image gallery with action buttons */}
      <Box ref={galleryRef} sx={{ position: 'relative', mb: 4 }}>
        <PropertyImageGallery images={property.images || []} />
        
        {/* Action buttons overlay */}
        <Box sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 2,
          display: 'flex',
          gap: 1
        }}>
          <IconButton sx={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }
          }}>
            <Share />
          </IconButton>
          <IconButton sx={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }
          }}>
            <Bookmark />
          </IconButton>
        </Box>
        
        {/* Property stats below image */}
        <Container maxWidth="xl">
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            mt: 3,
            mb: 4,
            p: 3,
            backgroundColor: 'rgba(120, 202, 220, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(120, 202, 220, 0.3)'
          }}>
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Configurations
              </Typography>
              <Typography variant="h6" sx={{ color: '#78CADC', fontWeight: 600 }}>
                {property.bedrooms} BHK Apartments
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Possession Starts
              </Typography>
              <Typography variant="h6" sx={{ color: '#78CADC', fontWeight: 600 }}>
                {property.possessionStatus || 'Dec 2031'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Avg. Price
              </Typography>
              <Typography variant="h6" sx={{ color: '#78CADC', fontWeight: 600 }}>
                {formatPrice(property.price / property.area)}/sq.ft
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Sizes
              </Typography>
              <Typography variant="h6" sx={{ color: '#78CADC', fontWeight: 600 }}>
                {property.area} sq.ft (Carpet Area)
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Navigation Bar - Positioned below images */}
      <Box 
        ref={navRef}
        sx={{
          backgroundColor: '#0B1011',
          borderBottom: '2px solid #78CADC',
          borderTop: '2px solid #78CADC',
          position: isSticky ? 'fixed' : 'static',
          top: isSticky ? `${headerHeight}px` : 'auto',
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          boxShadow: isSticky ? '0 2px 20px rgba(0, 0, 0, 0.5)' : 'none',
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px'
        }}
      >
        <Container maxWidth="xl" sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          px: 0
        }}>

          {/* Scrollable Tabs */}
          <Box
            ref={tabsRef}
            sx={{
              flex: 1,
              overflowX: 'hidden',
              position: 'relative',
              display: 'flex'
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => {
                setActiveTab(newValue);
                const refMap = {
                  overview: overviewRef,
                  highlights: highlightsRef,
                  around: aroundRef,
                  more: moreRef,
                  floorplan: floorplanRef,
                  amenities: amenitiesRef,
                  developer: developerRef,
                  similar: similarRef
                };
                if (refMap[newValue]) {
                  scrollToSection(refMap[newValue]);
                }
              }}
              variant="scrollable"
              scrollButtons={false}
              sx={{
                flex: 1,
                '& .MuiTabs-scroller': {
                  overflowX: 'auto !important',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#78CADC',
                  height: '4px'
                },
                '& .MuiTab-root': {
                  color: '#fff',
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  minWidth: 'unset',
                  px: 3,
                  '&.Mui-selected': {
                    color: '#78CADC'
                  }
                }
              }}
            >
              <Tab label="Overview" value="overview" />
              <Tab label="Highlights" value="highlights" />
              <Tab label="Around This Project" value="around" />
              <Tab label="More About Project" value="more" />
              <Tab label="Floor Plan" value="floorplan" />
              <Tab label="Amenities" value="amenities" />
              <Tab label="About Developer" value="developer" />
              <Tab label="Similar Projects" value="similar" />
            </Tabs>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6, pt: isSticky ? `${headerHeight + 100}px` : '40px' }}>
        <Grid container spacing={4}>
          {/* Left Column - Main Content */}
          <Grid item xs={12} md={8}>
            {/* Overview Section */}
            <Box ref={overviewRef} sx={{ mb: 6 }}>
              <SectionHeader variant="h4">Overview</SectionHeader>
              <PremiumPaper>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                  color: '#78CADC'
                }}>
                  {property.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <LocationOn sx={{ color: '#78CADC', mr: 1 }} />
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                    {fullAddress}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                  <Chip 
                    icon={<SquareFoot sx={{ color: '#78CADC' }} />} 
                    label={`${property.area} sqft`} 
                    sx={{ 
                      backgroundColor: 'rgba(120, 202, 220, 0.15)',
                      border: '1px solid #78CADC',
                      color: '#fff',
                      fontFamily: '"Poppins", sans-serif'
                    }}
                  />
                  <Chip 
                    icon={<KingBed sx={{ color: '#78CADC' }} />} 
                    label={`${property.bedrooms} BHK`} 
                    sx={{ 
                      backgroundColor: 'rgba(120, 202, 220, 0.15)',
                      border: '1px solid #78CADC',
                      color: '#fff',
                      fontFamily: '"Poppins", sans-serif'
                    }}
                  />
                  <Chip 
                    icon={<Bathtub sx={{ color: '#78CADC' }} />} 
                    label={`${property.bathrooms} Bath`} 
                    sx={{ 
                      backgroundColor: 'rgba(120, 202, 220, 0.15)',
                      border: '1px solid #78CADC',
                      color: '#fff',
                      fontFamily: '"Poppins", sans-serif'
                    }}
                  />
                  {property.type && (
                    <Chip 
                      icon={<Apartment sx={{ color: '#78CADC' }} />} 
                      label={property.type} 
                      sx={{ 
                        backgroundColor: 'rgba(120, 202, 220, 0.15)',
                        border: '1px solid #78CADC',
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      }}
                    />
                  )}
                </Box>
                
                <Divider sx={{ my: 3, borderColor: 'rgba(120, 202, 220, 0.3)' }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#78CADC' }}>
                    {formatPrice(property.price || 0)}
                  </Typography>
                  <Chip 
                    label={property.status} 
                    sx={{ 
                      fontWeight: 700,
                      backgroundColor: property.status === 'For Sale' ? '#78CADC' : '#e74c3c',
                      color: '#0B1011',
                      fontFamily: '"Poppins", sans-serif'
                    }}
                  />
                </Box>
              </PremiumPaper>
            </Box>

            {/* Highlights Section */}
            <Box ref={highlightsRef} sx={{ mb: 6 }}>
              <SectionHeader variant="h4">Highlights</SectionHeader>
              <PremiumPaper>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#78CADC' }}>
                  Why {property.title}?
                </Typography>
                <Box component="ul" sx={{ pl: 3 }}>
                  {property.highlights?.map((highlight, index) => (
                    <Typography 
                      key={index} 
                      component="li" 
                      sx={{ 
                        mb: 2, 
                        fontSize: '1.1rem', 
                        lineHeight: 1.7,
                        color: 'rgba(255, 255, 255, 0.85)'
                      }}
                    >
                      {highlight}
                    </Typography>
                  )) || (
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      No highlights available
                    </Typography>
                  )}
                </Box>
              </PremiumPaper>
            </Box>

            {/* Around This Project Section */}
            <Box ref={aroundRef} sx={{ mb: 6 }}>
              <SectionHeader variant="h4">Around This Project</SectionHeader>
              <PremiumPaper>
                <Typography variant="body1" sx={{ 
                  color: 'rgba(255, 255, 255, 0.85)',
                  mb: 3,
                  fontSize: '1.1rem',
                  lineHeight: 1.8
                }}>
                  {property.aroundProject || 'Information about the neighborhood and nearby amenities will be displayed here.'}
                </Typography>
                <PropertyMap 
                  location={property.location} 
                  address={property.address || {}} 
                  height="400px"
                  showNearby={true}
                  darkMode={true}
                />
              </PremiumPaper>
            </Box>

            {/* More About Project Section */}
            <Box ref={moreRef} sx={{ mb: 6 }}>
              <SectionHeader variant="h4">More About Project</SectionHeader>
              <PremiumPaper>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-line',
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    color: 'rgba(255, 255, 255, 0.85)'
                  }}
                >
                  {property.description}
                </Typography>
              </PremiumPaper>
            </Box>

            {/* Floor Plan Section */}
            <Box ref={floorplanRef} sx={{ mb: 6 }}>
              <SectionHeader variant="h4">Floor Plan</SectionHeader>
              <PremiumPaper>
                {property.floorPlan ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <img 
                      src={property.floorPlan} 
                      alt="Floor Plan" 
                      style={{ 
                        maxWidth: '100%', 
                        height: 'auto',
                        borderRadius: '8px',
                        border: '1px solid rgba(120, 202, 220, 0.3)'
                      }} 
                    />
                  </Box>
                ) : (
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Floor plan images will be displayed here when available.
                  </Typography>
                )}
              </PremiumPaper>
            </Box>

            {/* Amenities Section */}
            <Box ref={amenitiesRef} sx={{ mb: 6 }}>
              <SectionHeader variant="h4">Amenities</SectionHeader>
              <PremiumPaper>
                <Grid container spacing={3}>
                  {property.amenities?.map((amenity, index) => (
                    <Grid item xs={6} sm={4} key={index}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 1.5,
                        borderRadius: '8px',
                        backgroundColor: 'rgba(120, 202, 220, 0.1)',
                        border: '1px solid rgba(120, 202, 220, 0.3)',
                        '&:hover': {
                          backgroundColor: 'rgba(120, 202, 220, 0.2)'
                        }
                      }}>
                        <Check sx={{ color: '#78CADC', mr: 1.5 }} fontSize="small" />
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>{amenity}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </PremiumPaper>
            </Box>

            {/* About Developer Section */}
            <Box ref={developerRef} sx={{ mb: 6 }}>
              <SectionHeader variant="h4">About Developer</SectionHeader>
              <PremiumPaper>
                {property.developer ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar 
                        src={property.developer.logo}
                        sx={{ 
                          width: 64, 
                          height: 64,
                          mr: 3,
                          backgroundColor: '#78CADC',
                          color: '#0B1011'
                        }}
                      >
                        {property.developer.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#78CADC' }}>
                          {property.developer.name}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {property.developer.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ 
                      whiteSpace: 'pre-line',
                      color: 'rgba(255, 255, 255, 0.85)'
                    }}>
                      {property.developer.details}
                    </Typography>
                  </>
                ) : (
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Developer information will be displayed here when available.
                  </Typography>
                )}
              </PremiumPaper>
            </Box>
{/* Similar Projects Section */}
<Box ref={similarRef} sx={{ mb: 6 }}>
  <SectionHeader variant="h4">Similar Projects Nearby</SectionHeader>
  <PremiumPaper>
    <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#78CADC' }}>
      Properties Similar to {property.title} within 20km
    </Typography>
    
    {property.similarProperties?.length > 0 ? (
      <Grid container spacing={3}>
        {property.similarProperties.map((similarProp) => (
          <Grid item xs={12} key={similarProp._id}>
            <Box 
              onClick={() => navigate(`/properties/${similarProp._id}`)}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                p: 3,
                backgroundColor: 'rgba(120, 202, 220, 0.1)',
                border: '1px solid rgba(120, 202, 220, 0.3)',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(120, 202, 220, 0.2)',
                  backgroundColor: 'rgba(120, 202, 220, 0.2)'
                }
              }}
            >
              <Box sx={{
                width: { xs: '100%', sm: '200px' },
                height: '150px',
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {similarProp.images?.[0]?.url ? (
                  <img 
                    src={similarProp.images[0].url} 
                    alt={similarProp.title} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                ) : (
                  <Box sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(120, 202, 220, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Apartment sx={{ fontSize: 60, color: 'rgba(120, 202, 220, 0.5)' }} />
                  </Box>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#78CADC', mb: 1 }}>
                  {similarProp.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                  <LocationOn sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                  {[
                    similarProp.address?.line1,
                    similarProp.address?.street,
                    similarProp.address?.city,
                    similarProp.address?.state,
                    similarProp.address?.zipCode
                  ].filter(Boolean).join(', ')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<SquareFoot sx={{ color: '#78CADC' }} />}
                    label={`${similarProp.area} sqft`}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(120, 202, 220, 0.15)',
                      color: '#fff',
                      fontFamily: '"Poppins", sans-serif'
                    }}
                  />
                  <Chip 
                    icon={<KingBed sx={{ color: '#78CADC' }} />}
                    label={`${similarProp.bedrooms} BHK`}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(120, 202, 220, 0.15)',
                      color: '#fff',
                      fontFamily: '"Poppins", sans-serif'
                    }}
                  />
                  {similarProp.type && (
                    <Chip 
                      icon={<Apartment sx={{ color: '#78CADC' }} />}
                      label={similarProp.type}
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(120, 202, 220, 0.15)',
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      }}
                    />
                  )}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#78CADC' }}>
                  {formatPrice(similarProp.price)}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  mt: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    ) : (
      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', py: 4 }}>
        No similar properties found within 20km radius.
      </Typography>
    )}
  </PremiumPaper>
</Box>
          </Grid>

          {/* Right Column - Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              position: 'sticky', 
              top: isSticky ? `${headerHeight + 100}px` : '40px',
              transition: 'top 0.3s ease'
            }}>
              {/* Price and Status Card */}
              <PremiumPaper sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#78CADC' }}>
                  Price Details
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Price
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#78CADC' }}>
                    {formatPrice(property.price || 0)}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Price per sqft
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#78CADC' }}>
                    {formatPrice(property.price / property.area)}/sqft
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Possession Status
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#78CADC' }}>
                    {property.possessionStatus || 'Ready to Move'}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 3, borderColor: 'rgba(120, 202, 220, 0.3)' }} />
                
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
              </PremiumPaper>

              {/* Contact Agent Card */}
              <PremiumPaper sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#78CADC' }}>
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
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#fff' }}>
                      {property.agent?.name || 'N/A'}
                    </Typography>
                    {property.agent?.company && (
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {property.agent.company}
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Phone />}
                  onClick={() => {
                    setContactMethod('phone');
                    handleContactOpen();
                  }}
                  sx={{
                    mb: 2,
                    backgroundColor: '#4CAF50',
                    '&:hover': {
                      backgroundColor: '#3e8e41'
                    }
                  }}
                >
                  Call Agent
                </Button>
                
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<WhatsApp />}
                  onClick={() => {
                    setContactMethod('whatsapp');
                    handleContactOpen();
                  }}
                  sx={{
                    backgroundColor: '#25D366',
                    '&:hover': {
                      backgroundColor: '#1da851'
                    }
                  }}
                >
                  WhatsApp
                </Button>
              </PremiumPaper>

              {/* Location Map */}
              {/* <PremiumPaper>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#78CADC' }}>
                  Location
                </Typography>
                <Box sx={{ 
                  height: 300,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(120, 202, 220, 0.3)',
                  mb: 2
                }}>
                  <PropertyMap 
                    location={property.location} 
                    address={property.address || {}} 
                    darkMode={true}
                  />
                </Box>
                <Typography variant="body1" sx={{ 
                  mt: 2,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'rgba(255, 255, 255, 0.85)'
                }}>
                  <LocationOn sx={{ color: '#78CADC', mr: 1.5 }} />
                  {fullAddress}
                </Typography>
              </PremiumPaper> */}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Back to Top Button */}
      {showBackToTop && (
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            backgroundColor: '#78CADC',
            color: '#0B1011',
            zIndex: 1001,
            '&:hover': {
              backgroundColor: '#5fb4c9',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <KeyboardArrowUp />
        </IconButton>
      )}

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
            borderRadius: '16px',
            border: '2px solid #78CADC',
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
            borderRadius: '16px',
            border: '2px solid #78CADC',
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
                  label={contactMethod === 'whatsapp' ? 'WhatsApp Message' : 'Email Content'}
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
              disabled={contactLoading || ((contactMethod === 'email' || contactMethod === 'whatsapp') && !message.trim())}
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