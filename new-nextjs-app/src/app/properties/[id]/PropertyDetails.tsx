'use client';

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
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PropertyImageGallery from '@/components/property/PropertyImageGallery';
import PropertyMap from '@/components/property/PropertyMap';
import { formatPrice } from '@/lib/utils/format';
import { api } from '@/lib/services/api';
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

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

// Styled components
const AnimatedBox = styled(Box)(({ theme }) => ({
  animation: `${fadeIn} 0.6s ease-out`,
}));

const SlideInBox = styled(Box)(({ theme }) => ({
  animation: `${slideIn} 0.5s ease-out`,
}));

const ScrollToTopButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
  minWidth: 'auto',
  width: 56,
  height: 56,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  boxShadow: theme.shadows[4],
}));

interface Property {
  _id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    locality: string;
    country: string;
  };
  location: {
    type: string;
    coordinates: [number, number];
  };
  images: Array<{
    url: string;
    publicId: string;
  }>;
  floorPlanImages?: Array<{
    url: string;
    publicId: string;
  }>;
  amenities: string[];
  highlights: string[];
  developer?: {
    _id: string;
    name: string;
    logo: string;
  };
  agent: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  views: number;
  createdAt: string;
  updatedAt: string;
  similarProperties?: Property[];
}

const PropertyDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  // State management
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    inquiryType: 'general'
  });

  // Refs
  const overviewRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const amenitiesRef = useRef<HTMLDivElement>(null);
  const nearbyRef = useRef<HTMLDivElement>(null);
  const moreInfoRef = useRef<HTMLDivElement>(null);
  const floorPlanRef = useRef<HTMLDivElement>(null);
  const developerRef = useRef<HTMLDivElement>(null);
  const similarRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery('(max-width:900px)');

  // Fetch property data
  const fetchProperty = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.properties.getById(id as string);
      
      if (response.success && response.data) {
        setProperty(response.data);
        
        // Check if property is in favorites
        if (isAuthenticated) {
          try {
            const favoriteResponse = await api.auth.getFavoriteStatus(response.data._id);
            setIsFavorite(favoriteResponse.data?.isFavorite || false);
          } catch (err) {
            console.log('Could not check favorite status:', err);
          }
        }
      } else {
        setError('Property not found');
      }
    } catch (err: any) {
      console.error('Error fetching property:', err);
      setError(err.message || 'Failed to load property');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  // Handle scroll to top
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle favorite toggle
  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to favorites');
      return;
    }

    if (!property) return;

    try {
      setLoadingFavorite(true);
      
      if (isFavorite) {
        await api.auth.removeFavorite(property._id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await api.auth.addFavorite(property._id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      toast.error('Failed to update favorites');
    } finally {
      setLoadingFavorite(false);
    }
  };

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!property) return;

    try {
      await api.inquiries.create({
        propertyId: property._id,
        agentId: property.agent._id,
        ...contactForm
      });
      
      toast.success('Inquiry sent successfully!');
      setShowContactDialog(false);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        message: '',
        inquiryType: 'general'
      });
    } catch (err: any) {
      console.error('Error sending inquiry:', err);
      toast.error('Failed to send inquiry');
    }
  };

  // Handle property deletion
  const handleDeleteProperty = async () => {
    if (!property) return;

    try {
      await api.properties.delete(property._id);
      toast.success('Property deleted successfully');
      router.push('/properties');
    } catch (err: any) {
      console.error('Error deleting property:', err);
      toast.error('Failed to delete property');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  // Navigation handlers
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load property on mount
  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id, fetchProperty]);

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Property not found'}
        </Alert>
        <Button variant="contained" onClick={() => router.push('/properties')}>
          Back to Properties
        </Button>
      </Container>
    );
  }

  const fullAddress = `${property.address.street}, ${property.address.locality}, ${property.address.city}, ${property.address.state} ${property.address.zipCode}`;

  return (
    <Box>
      {/* Property Header */}
      <PropertyHeader
        property={property}
        fullAddress={fullAddress}
        isFavorite={isFavorite}
        loadingFavorite={loadingFavorite}
        handleFavoriteClick={handleFavoriteClick}
      />

      {/* Property Navigation */}
      <PropertyNavigation
        scrollToSection={scrollToSection}
        overviewRef={overviewRef}
        highlightsRef={highlightsRef}
        amenitiesRef={amenitiesRef}
        nearbyRef={nearbyRef}
        moreInfoRef={moreInfoRef}
        floorPlanRef={floorPlanRef}
        developerRef={developerRef}
        similarRef={similarRef}
        isMobile={isMobile}
      />

      <Container maxWidth="xl">
        <Grid container spacing={4} sx={{ py: 4 }}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={4}>
              {/* Property Overview */}
              <AnimatedBox ref={overviewRef}>
                <PropertyOverview property={property} />
              </AnimatedBox>

              {/* Property Highlights */}
              <AnimatedBox ref={highlightsRef}>
                <PropertyHighlights property={property} />
              </AnimatedBox>

              {/* Property Amenities */}
              <AnimatedBox ref={amenitiesRef}>
                <PropertyAmenities property={property} />
              </AnimatedBox>

              {/* Property Nearby */}
              <AnimatedBox ref={nearbyRef}>
                <PropertyNearby property={property} />
              </AnimatedBox>

              {/* Property More Info */}
              <AnimatedBox ref={moreInfoRef}>
                <PropertyMoreInfo property={property} />
              </AnimatedBox>

              {/* Property Floor Plan */}
              <AnimatedBox ref={floorPlanRef}>
                <PropertyFloorPlan property={property} />
              </AnimatedBox>

              {/* Property Developer */}
              <AnimatedBox ref={developerRef}>
                <PropertyDeveloper property={property} />
              </AnimatedBox>

              {/* Property Similar */}
              <AnimatedBox ref={similarRef}>
                <PropertySimilar property={property} />
              </AnimatedBox>
            </Stack>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <SlideInBox>
              <PropertySidebar
                property={property}
                onContactClick={() => setShowContactDialog(true)}
                onDeleteClick={() => setShowDeleteDialog(true)}
                canEdit={isAuthenticated && user?.role === 'admin'}
                canDelete={isAuthenticated && (user?.role === 'admin' || user?.id === property.agent._id)}
              />
            </SlideInBox>
          </Grid>
        </Grid>
      </Container>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <ScrollToTopButton onClick={handleScrollToTop}>
          <KeyboardArrowUp />
        </ScrollToTopButton>
      )}

      {/* Contact Dialog */}
      <ContactDialog
        open={showContactDialog}
        onClose={() => setShowContactDialog(false)}
        contactForm={contactForm}
        setContactForm={setContactForm}
        onSubmit={handleContactSubmit}
        property={property}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteProperty}
        propertyTitle={property.title}
      />
    </Box>
  );
};

export default PropertyDetails;
