import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, Typography, Grid, Divider, Chip, Button, Paper, 
  CircularProgress, Alert, Dialog, DialogActions, 
  DialogContent, DialogTitle, IconButton, useMediaQuery, 
  Stack, Avatar, FormControl, InputLabel, Select, MenuItem,
  TextField, RadioGroup, FormControlLabel, Radio, Collapse,
  Tabs, Tab, Container
} from '@mui/material';
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartFilled } from "@heroicons/react/24/solid";
import { ChevronRight, ChevronLeft, KeyboardArrowUp } from '@mui/icons-material';
import { 
  LocationOn, KingBed, Bathtub, SquareFoot, 
  Phone, Email, Delete, 
  WhatsApp, Apartment, Check, Close,
  School, LocalHospital, ShoppingCart, Park, DirectionsBus
} from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProperties } from '../../context/PropertiesContext';
import PropertyImageGallery from '../../components/property/PropertyImageGallery';
import PropertyMap from '../../components/property/PropertyMap';
import { formatPrice } from '../../utils/format';
import axios from '../../services/axios';
import { styled, keyframes } from '@mui/material/styles';
import { toast } from 'react-toastify';

// Import sub-components
import PropertyHeader from './PropertyHeader';
import PropertyNavigation from './PropertyNavigation';
import PropertyOverview from './PropertyOverview';
import PropertyHighlights from './PropertyHighlights';
import PropertyNearby from './PropertyNearby';
import PropertyMoreInfo from './PropertyMoreInfo';
import PropertyFloorPlan from './PropertyFloorPlan';
import PropertyAmenities from './PropertyAmenities';
import PropertyDeveloper from './PropertyDeveloper';
import PropertySimilar from './PropertySimilar';
import PropertySidebar from './PropertySidebar';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import ContactDialog from './ContactDialog';
import PremiumPaper from './PremiumPaper';
import SectionHeader from './SectionHeader';
import PremiumButton from './PremiumButton';

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
  
  const [property, setProperty] = useState(null);
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
  const [activeTab, setActiveTab] = useState('overview');
  const [isSticky, setIsSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
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

  // Safe property accessor
  const getAddressPart = (part) => {
    if (!property || !property.address) return '';
    return property.address[part] || property.location?.[part] || '';
  };

  // Calculate full address only when property exists
  const fullAddress = property ? [
    getAddressPart('line1'),
    getAddressPart('street'),
    getAddressPart('city'),
    getAddressPart('state'),
    getAddressPart('zipCode')
  ].filter(Boolean).join(', ') : '';

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getProperty(id);
        setProperty(data || null);
        
        // Check favorite status after property is loaded
        if (user && data?._id) {
          try {
            const response = await axios.get(`/auth/favorites/${data._id}/status`);
            setIsFavorite(response.data.isFavorite);
          } catch (err) {
            console.error('Error checking favorite status:', err);
          }
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
  }, [id, getProperty, user, clearProperty]);

  useEffect(() => {
    const calculateHeaderHeight = () => {
      const header = document.querySelector('.header') || document.querySelector('header');
      setHeaderHeight(header?.offsetHeight || 70);
    };

    calculateHeaderHeight();
    window.addEventListener('resize', calculateHeaderHeight);
    return () => window.removeEventListener('resize', calculateHeaderHeight);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowBackToTop(scrollPosition > 300);
      
      if (navRef.current) {
        const navOffset = navRef.current.offsetTop;
        setIsSticky(scrollPosition > (navOffset - headerHeight) && scrollPosition > 50);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerHeight]);
  const handleContactSubmit = async (e) => {
    
  }

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      toast.info('Please login to save favorites');
      return;
    }

    if (!property?._id) return;

    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        await axios.delete(`/auth/favorites/${property._id}`);
        toast.success('Removed from favorites');
      } else {
        await axios.put(`/auth/favorites/${property._id}`);
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error updating favorite:', err);
      toast.error(err.response?.data?.message || 'Failed to update favorites');
    } finally {
      setLoadingFavorite(false);
    }
  };

  const scrollToSection = (ref) => {
    if (!ref.current) return;
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
      navigate('/properties', { state: { message: 'Property deleted successfully' } });
    } catch (err) {
      console.error('Delete error:', err);
      setDeleteError(err.response?.data?.message || 'Failed to delete property');
    } finally {
      setDeleting(false);
    }
  };

  const handleContactOpen = () => {
    if (!property) return;
    
    const prefilledMessage = `Hello, I'm interested in your property "${property.title}" at ${fullAddress} (${formatPrice(property.price)}).\n\n${window.location.href}`;
    setMessage(prefilledMessage);
    setContactOpen(true);
  };

  if (loading || !property) {
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
          sx={{ color: '#78CADC', animation: `${pulse} 2s infinite` }} 
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
        <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          {error}
        </Alert>
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
      background: 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)',
      minHeight: '100vh'
    }}>
      <PropertyHeader 
        property={property} 
        fullAddress={fullAddress} 
        isFavorite={isFavorite}
        loadingFavorite={loadingFavorite}
        handleFavoriteClick={handleFavoriteClick}
      />

      <Box ref={galleryRef} sx={{ position: 'relative', mb: 4 }}>
        <PropertyImageGallery images={property.images || []} />
        
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
                {property.bedrooms} BHK {property.type || 'Property'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Price
              </Typography>
              <Typography variant="h6" sx={{ color: '#78CADC', fontWeight: 600 }}>
                {formatPrice(property.price)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Area
              </Typography>
              <Typography variant="h6" sx={{ color: '#78CADC', fontWeight: 600 }}>
                {property.area} sq.ft
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <PropertyNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSticky={isSticky}
        headerHeight={headerHeight}
        navRef={navRef}
        tabsRef={tabsRef}
        scrollToSection={scrollToSection}
        overviewRef={overviewRef}
        highlightsRef={highlightsRef}
        aroundRef={aroundRef}
        moreRef={moreRef}
        floorplanRef={floorplanRef}
        amenitiesRef={amenitiesRef}
        developerRef={developerRef}
        similarRef={similarRef}
      />

      <Container maxWidth="xl" sx={{ py: 6, pt: isSticky ? `${headerHeight + 100}px` : '40px' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <PropertyOverview property={property} fullAddress={fullAddress} overviewRef={overviewRef} />
            <PropertyHighlights property={property} highlightsRef={highlightsRef} />
            <PropertyNearby property={property} aroundRef={aroundRef} />
            <PropertyMoreInfo property={property} moreRef={moreRef} />
            <PropertyFloorPlan property={property} floorplanRef={floorplanRef} />
            <PropertyAmenities property={property} amenitiesRef={amenitiesRef} />
            <PropertyDeveloper property={property} developerRef={developerRef} />
            <PropertySimilar property={property} similarRef={similarRef} navigate={navigate} />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <PropertySidebar 
              property={property} 
              fullAddress={fullAddress} 
              isSticky={isSticky} 
              headerHeight={headerHeight} 
              handleContactOpen={handleContactOpen} 
            />
          </Grid>
        </Grid>
      </Container>

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

      <DeleteConfirmationDialog 
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        deleting={deleting}
        deleteError={deleteError}
        handleDelete={handleDelete}
      />

      <ContactDialog 
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        contactMethod={contactMethod}
        setContactMethod={setContactMethod}
        message={message}
        setMessage={setMessage}
        contactLoading={contactLoading}
        contactSuccess={contactSuccess}
        handleContactSubmit={handleContactSubmit}
        property={property}
      />
    </Box>
  );
};

export default PropertyDetails;