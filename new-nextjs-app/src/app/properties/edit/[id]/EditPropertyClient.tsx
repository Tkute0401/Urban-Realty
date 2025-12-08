'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Autocomplete,
  Avatar,
  Snackbar,
  Divider,
  FormHelperText,
} from '@mui/material';
import {
  CloudUpload, Delete, Star, ArrowBack, Close, Add,
  Home, Apartment, Villa, Cottage, Factory, Landscape,
  LocalParking, Pool, FitnessCenter, Security, Spa,
  Balcony, Wifi, AcUnit, Chair, Pets, Elevator,
  LocalLaundryService, Storage, MeetingRoom, Kitchen,
  Bathtub, KingBed, SquareFoot,
} from '@mui/icons-material';
import { useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeProvider';
import { useProperties } from '@/contexts/PropertiesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAgents } from '@/contexts/AgentsContext';
import { useDevelopers } from '@/contexts/DevelopersContext';
import http from '@/lib/services/http';
import FieldIndicator from '@/components/ui/FieldIndicator';

// Styled components
const PremiumPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text-primary)',
  borderRadius: '16px',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
  border: `2px solid var(--color-primary)`,
  padding: theme.spacing(3),
  fontFamily: '"Poppins", sans-serif',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, var(--color-primary) 0%, var(--color-surface) 100%)`,
  }
}));

const PremiumButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-primary-contrast)',
  fontWeight: 600,
  padding: theme.spacing(1.8, 4),
  borderRadius: '12px',
  fontFamily: '"Poppins", sans-serif',
  textTransform: 'none',
  fontSize: '1rem',
  letterSpacing: '0.5px',
  '&:hover': {
    backgroundColor: 'var(--color-primary-hover)',
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 12px rgba(120, 202, 220, 0.4)',
  },
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  boxShadow: '0 4px 8px rgba(120, 202, 220, 0.2)',
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: 'var(--color-primary)',
  position: 'relative',
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(3),
  fontFamily: '"Poppins", sans-serif',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '60px',
    height: '3px',
    backgroundColor: 'var(--color-primary)',
    borderRadius: '3px'
  }
}));

// Amenities with icons mapping
const amenitiesConfig = [
  { name: 'Parking', icon: <LocalParking /> },
  { name: 'Swimming Pool', icon: <Pool /> },
  { name: 'Gym', icon: <FitnessCenter /> },
  { name: 'Security', icon: <Security /> },
  { name: 'Garden', icon: <Spa /> },
  { name: 'Balcony', icon: <Balcony /> },
  { name: 'WiFi', icon: <Wifi /> },
  { name: 'Air Conditioning', icon: <AcUnit /> },
  { name: 'Furnished', icon: <Chair /> },
  { name: 'Pet Friendly', icon: <Pets /> },
  { name: 'Elevator', icon: <Elevator /> },
  { name: 'Laundry', icon: <LocalLaundryService /> },
  { name: 'Storage', icon: <Storage /> },
  { name: 'Conference Room', icon: <MeetingRoom /> },
  { name: 'Kitchen', icon: <Kitchen /> }
];

// Property type icons mapping
const propertyTypeIcons = {
  'House': <Home />,
  'Apartment': <Apartment />,
  'Villa': <Villa />,
  'Condo': <Cottage />,
  'Townhouse': <Home />,
  'Land': <Landscape />,
  'Commercial': <Factory />
};

const propertyTypes = ['House', 'Apartment', 'Villa', 'Condo', 'Townhouse', 'Land', 'Commercial', 'PG'];
const propertyStatuses = ['For Sale', 'For Rent'];
const constructionStatuses = ['Under Construction', 'Ready to Move', 'New Launch', 'Almost Ready'];

interface EditPropertyClientProps {
  propertyId: string;
}

const EditPropertyClient: React.FC<EditPropertyClientProps> = ({ propertyId }) => {
  const { theme } = useContext(ThemeContext);
  const { getProperty } = useProperties();
  const { user } = useAuth();
  const { agents, getAgents } = useAgents();
  const { developers, getDevelopers } = useDevelopers();
  const router = useRouter();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const loadingPropertyIdRef = useRef<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [existingImages, setExistingImages] = useState<Array<{ url: string; publicId?: string }>>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [existingFloorPlans, setExistingFloorPlans] = useState<Array<{ url: string; publicId?: string }>>([]);
  const [floorPlanPreviews, setFloorPlanPreviews] = useState<string[]>([]);
  const [floorPlans, setFloorPlans] = useState<File[]>([]);
  const [brochureUrl, setBrochureUrl] = useState<string>('');
  const [virtualTourFile, setVirtualTourFile] = useState<File | null>(null);
  const [virtualTourPreview, setVirtualTourPreview] = useState<string | null>(null);
  
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const floorPlansInputRef = useRef<HTMLInputElement>(null);
  const virtualTourInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'House',
    status: 'For Sale',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    buildingName: '',
    floorNumber: '',
    featured: false,
    agent: '',
    developer: '',
    possessionDate: '',
    constructionStatus: 'Under Construction',
    ageOfProperty: '',
    address: {
      line1: '',
      street: '',
      city: '',
      locality: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    amenities: [] as string[],
    highlights: ['', '', '', '', ''],
    nearbyLocalities: {
      hasSchool: false,
      school: '',
      hasHospital: false,
      hospital: '',
      hasMall: false,
      mall: '',
      hasPark: false,
      park: '',
      hasTransport: false,
      transport: ''
    },
    projectDetails: {
      projectArea: '',
      totalUnits: '',
      launchDate: '',
      reraId: '',
      configurations: ''
    },
    approvals: [] as Array<{ name: string; number: string; date: string }>
  });

  // Load property data and dependencies
  useEffect(() => {
    if (!propertyId) {
      return;
    }

    // Prevent multiple loads for the same propertyId
    if (loadingPropertyIdRef.current === propertyId) {
      return;
    }

    const loadData = async () => {
      try {
        loadingPropertyIdRef.current = propertyId;
        setLoading(true);
        setError(null);

        // Load agents and developers
        if (user?.role === 'admin') {
          getAgents();
        }
        getDevelopers();

        // Load property data
        const property = await getProperty(propertyId);
        
        if (!property) {
          setError('Property not found');
          return;
        }

        // Pre-populate form with existing property data
        setFormData({
          title: property.title || '',
          description: property.description || '',
          type: property.type || 'House',
          status: property.status || 'For Sale',
          price: property.price?.toString() || '',
          bedrooms: property.bedrooms?.toString() || '',
          bathrooms: property.bathrooms?.toString() || '',
          area: property.area?.toString() || '',
          buildingName: property.buildingName || '',
          floorNumber: property.floorNumber?.toString() || '',
          featured: property.featured || false,
          agent: (property.agent as any)?._id || '',
          developer: (property.developer as any)?._id || '',
          possessionDate: property.possessionDate || '',
          constructionStatus: property.constructionStatus || 'Under Construction',
          ageOfProperty: property.ageOfProperty?.toString() || '',
          address: {
            line1: property.address?.line1 || property.address?.street || '',
            street: property.address?.street || property.address?.line1 || '',
            city: property.address?.city || '',
            locality: property.address?.locality || '',
            state: property.address?.state || '',
            zipCode: property.address?.zipCode || '',
            country: property.address?.country || 'India'
          },
          amenities: property.amenities || [],
          highlights: property.highlights && property.highlights.length > 0 
            ? [...property.highlights, ...Array(5 - property.highlights.length).fill('')].slice(0, 5)
            : ['', '', '', '', ''],
          nearbyLocalities: {
            hasSchool: property.nearbyLocalities?.hasSchool || false,
            school: property.nearbyLocalities?.school || '',
            hasHospital: property.nearbyLocalities?.hasHospital || false,
            hospital: property.nearbyLocalities?.hospital || '',
            hasMall: property.nearbyLocalities?.hasMall || false,
            mall: property.nearbyLocalities?.mall || '',
            hasPark: property.nearbyLocalities?.hasPark || false,
            park: property.nearbyLocalities?.park || '',
            hasTransport: property.nearbyLocalities?.hasTransport || false,
            transport: property.nearbyLocalities?.transport || ''
          },
          projectDetails: property.projectDetails ? {
            projectArea: property.projectDetails.projectArea || '',
            totalUnits: property.projectDetails.totalUnits || '',
            launchDate: property.projectDetails.launchDate || '',
            reraId: property.projectDetails.reraId || '',
            configurations: property.projectDetails.configurations || ''
          } : {
            projectArea: '',
            totalUnits: '',
            launchDate: '',
            reraId: '',
            configurations: ''
          },
          approvals: (property.approvals || []).map(approval => ({
            name: approval.name || '',
            number: approval.number || '',
            date: approval.date 
              ? (typeof approval.date === 'string' ? approval.date : approval.date.toISOString().split('T')[0])
              : ''
          }))
        });

        // Set existing images
        if (property.images && property.images.length > 0) {
          setExistingImages(property.images);
        }
        
        // Set existing floor plans
        if (property.floorPlanImages && property.floorPlanImages.length > 0) {
          setExistingFloorPlans(property.floorPlanImages);
        }
        
        // Set existing brochure and virtual tour
        setBrochureUrl(property.brochure?.url || '');
        if (property.virtualTour?.url) {
          setVirtualTourPreview(property.virtualTour.url);
        }
      } catch (err) {
        console.error('Error loading property:', err);
        setError(err instanceof Error ? err.message : 'Failed to load property');
        loadingPropertyIdRef.current = null; // Reset on error so user can retry
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Cleanup: reset ref when propertyId changes
    return () => {
      if (loadingPropertyIdRef.current === propertyId) {
        loadingPropertyIdRef.current = null;
      }
    };
  }, [propertyId]); // Only depend on propertyId - functions are stable from context

  const handleInputChange = (field: string, value: any) => {
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
    setImages([...images, ...files]);
  };

  const handleRemoveImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      const newImages = [...existingImages];
      newImages.splice(index, 1);
      setExistingImages(newImages);
    } else {
      const newPreviews = [...imagePreviews];
      const newImages = [...images];
      newPreviews.splice(index, 1);
      newImages.splice(index, 1);
      setImagePreviews(newPreviews);
      setImages(newImages);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleFloorPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - floorPlanPreviews.length);
    const previews = files.map(file => URL.createObjectURL(file));
    setFloorPlanPreviews([...floorPlanPreviews, ...previews]);
    setFloorPlans([...floorPlans, ...files]);
    if (floorPlansInputRef.current) floorPlansInputRef.current.value = '';
  };

  const handleRemoveFloorPlan = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      const newPlans = [...existingFloorPlans];
      newPlans.splice(index, 1);
      setExistingFloorPlans(newPlans);
    } else {
      const newPreviews = [...floorPlanPreviews];
      const newPlans = [...floorPlans];
      newPreviews.splice(index, 1);
      newPlans.splice(index, 1);
      setFloorPlanPreviews(newPreviews);
      setFloorPlans(newPlans);
    }
  };

  const handleBrochureUrlChange = (url: string) => {
    setBrochureUrl(url);
  };

  const handleVirtualTourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVirtualTourFile(file);
      setVirtualTourPreview(URL.createObjectURL(file));
      if (virtualTourInputRef.current) virtualTourInputRef.current.value = '';
    }
  };

  const handleRemoveVirtualTour = () => {
    setVirtualTourFile(null);
    setVirtualTourPreview(null);
  };

  const handleAddApproval = () => {
    setFormData(prev => ({
      ...prev,
      approvals: [...prev.approvals, { name: '', number: '', date: '' }]
    }));
  };

  const handleRemoveApproval = (index: number) => {
    setFormData(prev => {
      const newApprovals = [...prev.approvals];
      newApprovals.splice(index, 1);
      return { ...prev, approvals: newApprovals };
    });
  };

  const handleApprovalChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newApprovals = [...prev.approvals];
      newApprovals[index] = { ...newApprovals[index], [field]: value };
      return { ...prev, approvals: newApprovals };
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price) errors.price = 'Price is required';
    if (!formData.bedrooms) errors.bedrooms = 'Bedrooms count is required';
    if (!formData.bathrooms) errors.bathrooms = 'Bathrooms count is required';
    if (!formData.area) errors.area = 'Area is required';
    if (!formData.address.street.trim()) errors.street = 'Street address is required';
    if (!formData.address.city.trim()) errors.city = 'City is required';
    if (!formData.address.state.trim()) errors.state = 'State is required';
    if (!formData.address.zipCode.trim()) errors.zipCode = 'Zip code is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all simple fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('bedrooms', formData.bedrooms);
      formDataToSend.append('bathrooms', formData.bathrooms);
      formDataToSend.append('area', formData.area);
      formDataToSend.append('buildingName', formData.buildingName);
      formDataToSend.append('floorNumber', formData.floorNumber);
      formDataToSend.append('featured', formData.featured.toString());
      formDataToSend.append('constructionStatus', formData.constructionStatus);
      
      if (formData.developer) {
        formDataToSend.append('developer', formData.developer);
      }
      if (formData.agent && user?.role === 'admin') {
        formDataToSend.append('agent', formData.agent);
      }
      if (formData.possessionDate) {
        formDataToSend.append('possessionDate', formData.possessionDate);
      }
      if (formData.ageOfProperty) {
        formDataToSend.append('ageOfProperty', formData.ageOfProperty);
      }
      
      // Append address fields individually
      Object.entries(formData.address).forEach(([key, value]) => {
        formDataToSend.append(`address[${key}]`, value);
      });
      
      // Append amenities
      formData.amenities.forEach(amenity => {
        formDataToSend.append('amenities[]', amenity);
      });

      // Append highlights (filter out empty ones)
      formData.highlights
        .filter(h => h.trim() !== '')
        .forEach((highlight, index) => {
          formDataToSend.append(`highlights[${index}]`, highlight);
        });

      // Append nearby localities
      Object.entries(formData.nearbyLocalities).forEach(([key, value]) => {
        formDataToSend.append(`nearbyLocalities[${key}]`, value.toString());
      });

      // Append project details
      Object.entries(formData.projectDetails).forEach(([key, value]) => {
        if (value) formDataToSend.append(`projectDetails[${key}]`, value);
      });

      // Append approvals
      formData.approvals.forEach((approval, index) => {
        formDataToSend.append(`approvals[${index}][name]`, approval.name);
        formDataToSend.append(`approvals[${index}][number]`, approval.number);
        if (approval.date) {
          formDataToSend.append(`approvals[${index}][date]`, approval.date);
        }
      });

      // Append existing images (must be sent as JSON string for backend to parse)
      if (existingImages.length > 0) {
        formDataToSend.append('existingImages', JSON.stringify(existingImages));
      }

      // Append new images
      images.forEach(file => {
        formDataToSend.append('images', file);
      });

      // Append existing floor plans (if backend supports it)
      if (existingFloorPlans.length > 0) {
        formDataToSend.append('existingFloorPlans', JSON.stringify(existingFloorPlans));
      }

      // Append new floor plans
      floorPlans.forEach(file => {
        formDataToSend.append('floorPlans', file);
      });

      // Append brochure URL (only if it's a valid URL)
      const trimmedBrochureUrl = brochureUrl.trim();
      if (trimmedBrochureUrl && (trimmedBrochureUrl.startsWith('http://') || trimmedBrochureUrl.startsWith('https://'))) {
        formDataToSend.append('brochureUrl', trimmedBrochureUrl);
      }

      // Append virtual tour
      if (virtualTourFile) {
        formDataToSend.append('virtualTour', virtualTourFile);
      }

      // Update property using FormData
      await http.put(`/api/v1/properties/${propertyId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSnackbarMessage('Property updated successfully!');
      setSnackbarOpen(true);
      setTimeout(() => router.push(`/properties/${propertyId}`), 1500);
    } catch (err: any) {
      console.error('Error updating property:', err);
      const { extractErrorMessage } = await import('@/lib/utils/extractErrorMessage');
      const errorMessage = extractErrorMessage(err, 'Failed to update property');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--color-bg)'
      }}>
        <CircularProgress size={80} sx={{ color: 'var(--color-primary)' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => router.push('/properties')}
          startIcon={<ArrowBack />}
        >
          Back to Properties
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ 
      py: { xs: 2, md: 3 },
      background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-elevated) 100%)',
      minHeight: '100vh'
    }}>
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          maxWidth: 1200, 
          mx: 'auto',
          p: { xs: 1, sm: 2, md: 3 },
          backgroundColor: 'var(--color-surface)',
          borderRadius: '16px',
          border: '2px solid var(--color-primary)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem' },
              color: 'var(--color-primary)',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 700
            }}
          >
            Edit Property
          </Typography>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            sx={{ color: 'var(--color-text-primary)' }}
          >
            Back
          </Button>
        </Box>

        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
          {/* Agent Selection Section (Admin Only) */}
          {user?.role === 'admin' && (
            <Grid item xs={12}>
              <SectionHeader variant="h6">Assign to Agent</SectionHeader>
              <PremiumPaper>
                <Autocomplete
                  options={agents}
                  getOptionLabel={(option) => `${option.name} (${option.email})`}
                  value={agents.find(agent => agent._id === formData.agent) || null}
                  onChange={(_, newValue) => {
                    handleInputChange('agent', newValue?._id || '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Agent"
                      variant="outlined"
                      size={isMobile ? 'small' : 'medium'}
                      sx={{
                        '& .MuiInputBase-root': {
                          color: 'var(--color-text-primary)',
                          fontFamily: '"Poppins", sans-serif'
                        },
                        '& .MuiInputLabel-root': {
                          color: 'var(--color-primary)',
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'var(--color-primary)',
                          },
                        },
                      }}
                    />
                  )}
                />
              </PremiumPaper>
            </Grid>
          )}

          {/* Developer Information Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Developer Information</SectionHeader>
            <PremiumPaper>
              <Autocomplete
                options={developers}
                getOptionLabel={(option) => option.name}
                value={developers.find(dev => dev._id === formData.developer) || null}
                onChange={(_, newValue) => {
                  handleInputChange('developer', newValue?._id || '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Developer"
                    variant="outlined"
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-primary)',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                    }}
                  />
                )}
              />
            </PremiumPaper>
          </Grid>

          {/* Basic Information Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Basic Information</SectionHeader>
            <PremiumPaper>
              <FieldIndicator required helperText="Enter a descriptive title for your property" />
              <TextField
                fullWidth
                label="Property Title"
                name="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                size={isMobile ? 'small' : 'medium'}
                error={!!formErrors.title}
                helperText={formErrors.title}
                sx={{ mb: 2 }}
              />

              <FieldIndicator required helperText="Detailed description of the property" />
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                size={isMobile ? 'small' : 'medium'}
                error={!!formErrors.description}
                helperText={formErrors.description}
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Property Type"
                    name="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    required
                    SelectProps={{ native: true }}
                    size={isMobile ? 'small' : 'medium'}
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    required
                    SelectProps={{ native: true }}
                    size={isMobile ? 'small' : 'medium'}
                  >
                    {propertyStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Construction Status"
                    name="constructionStatus"
                    value={formData.constructionStatus}
                    onChange={(e) => handleInputChange('constructionStatus', e.target.value)}
                    SelectProps={{ native: true }}
                    size={isMobile ? 'small' : 'medium'}
                  >
                    {constructionStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                        name="featured"
                        sx={{ color: 'var(--color-primary)' }}
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center" sx={{ color: 'var(--color-text-primary)' }}>
                        <Star sx={{ mr: 1, color: formData.featured ? 'var(--color-primary)' : 'inherit' }} />
                        Featured Property
                      </Box>
                    }
                  />
                </Grid>
              </Grid>
            </PremiumPaper>
          </Grid>

          {/* Property Details Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Property Details</SectionHeader>
            <PremiumPaper>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.price}
                    helperText={formErrors.price}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: 'var(--color-primary)' }}>₹</InputAdornment>
                      ),
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    required
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.bedrooms}
                    helperText={formErrors.bedrooms}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: 'var(--color-primary)' }}>
                          <KingBed />
                        </InputAdornment>
                      ),
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Bathrooms"
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    required
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.bathrooms}
                    helperText={formErrors.bathrooms}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: 'var(--color-primary)' }}>
                          <Bathtub />
                        </InputAdornment>
                      ),
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Area (sqft)"
                    name="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    required
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.area}
                    helperText={formErrors.area}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: 'var(--color-primary)' }}>
                          <SquareFoot />
                        </InputAdornment>
                      ),
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Building Name"
                    name="buildingName"
                    value={formData.buildingName}
                    onChange={(e) => handleInputChange('buildingName', e.target.value)}
                    size={isMobile ? 'small' : 'medium'}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Floor Number"
                    name="floorNumber"
                    type="number"
                    value={formData.floorNumber}
                    onChange={(e) => handleInputChange('floorNumber', e.target.value)}
                    size={isMobile ? 'small' : 'medium'}
                  />
                </Grid>
              </Grid>
            </PremiumPaper>
          </Grid>

          {/* Address Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Address</SectionHeader>
            <PremiumPaper>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    name="address.street"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    required
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.street}
                    helperText={formErrors.street}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="address.city"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    required
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.city}
                    helperText={formErrors.city}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Locality"
                    name="address.locality"
                    value={formData.address.locality}
                    onChange={(e) => handleInputChange('address.locality', e.target.value)}
                    size={isMobile ? 'small' : 'medium'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    name="address.state"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    required
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.state}
                    helperText={formErrors.state}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Zip Code"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                    required
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.zipCode}
                    helperText={formErrors.zipCode}
                  />
                </Grid>
              </Grid>
            </PremiumPaper>
          </Grid>

          {/* Amenities Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Amenities</SectionHeader>
            <PremiumPaper>
              <Grid container spacing={2}>
                {amenitiesConfig.map((amenity) => (
                  <Grid item xs={6} sm={4} md={3} key={amenity.name}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.amenities.includes(amenity.name)}
                          onChange={() => handleAmenityToggle(amenity.name)}
                          sx={{ color: 'var(--color-primary)' }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-primary)' }}>
                          {amenity.icon}
                          {amenity.name}
                        </Box>
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </PremiumPaper>
          </Grid>

          {/* Highlights Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Key Highlights</SectionHeader>
            <PremiumPaper>
              <Grid container spacing={2}>
                {formData.highlights.map((highlight, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      fullWidth
                      label={`Highlight ${index + 1}`}
                      value={highlight}
                      onChange={(e) => {
                        const newHighlights = [...formData.highlights];
                        newHighlights[index] = e.target.value;
                        setFormData({ ...formData, highlights: newHighlights });
                      }}
                      size={isMobile ? 'small' : 'medium'}
                    />
                  </Grid>
                ))}
              </Grid>
            </PremiumPaper>
          </Grid>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <Grid item xs={12}>
              <SectionHeader variant="h6">Existing Images</SectionHeader>
              <PremiumPaper>
                <Grid container spacing={2}>
                  {existingImages.map((image, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <Box sx={{ position: 'relative' }}>
                        <img
                          src={image.url}
                          alt={`Property ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveImage(index, true)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255, 0, 0, 0.7)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 0, 0, 0.9)',
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </PremiumPaper>
            </Grid>
          )}

          {/* New Images Upload */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Add New Images</SectionHeader>
            <PremiumPaper>
              <FormHelperText sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                Upload up to 10 images (max {10 - imagePreviews.length} remaining)
              </FormHelperText>
              
              {imagePreviews.length > 0 && (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {imagePreviews.map((preview, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <Box sx={{ position: 'relative' }}>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveImage(index, false)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255, 0, 0, 0.7)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 0, 0, 0.9)',
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
              
              <Button
                component="label"
                startIcon={<CloudUpload />}
                variant="outlined"
                disabled={imagePreviews.length >= 10}
                sx={{
                  color: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  '&:hover': {
                    borderColor: 'var(--color-primary-hover)',
                    backgroundColor: 'rgba(120, 202, 220, 0.1)'
                  }
                }}
              >
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={imagesInputRef}
                />
              </Button>
            </PremiumPaper>
          </Grid>

          {/* Floor Plans Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Floor Plans</SectionHeader>
            <PremiumPaper>
              <FormHelperText sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                Upload up to 5 floor plan images
              </FormHelperText>
              
              {/* Existing Floor Plans */}
              {existingFloorPlans.length > 0 && (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {existingFloorPlans.map((plan, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <Box sx={{ position: 'relative' }}>
                        <img
                          src={plan.url}
                          alt={`Floor Plan ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFloorPlan(index, true)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255, 0, 0, 0.7)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 0, 0, 0.9)',
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
              
              {/* New Floor Plan Previews */}
              {floorPlanPreviews.length > 0 && (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {floorPlanPreviews.map((preview, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <Box sx={{ position: 'relative' }}>
                        <img
                          src={preview}
                          alt={`Floor Plan Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFloorPlan(index, false)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255, 0, 0, 0.7)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 0, 0, 0.9)',
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
              
              <Button
                component="label"
                startIcon={<CloudUpload />}
                variant="outlined"
                disabled={floorPlanPreviews.length >= 5}
                sx={{
                  color: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  '&:hover': {
                    borderColor: 'var(--color-primary-hover)',
                    backgroundColor: 'rgba(120, 202, 220, 0.1)'
                  }
                }}
              >
                Upload Floor Plans
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleFloorPlanChange}
                  ref={floorPlansInputRef}
                />
              </Button>
            </PremiumPaper>
          </Grid>

          {/* Approvals & Certifications Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Approvals & Certifications</SectionHeader>
            <PremiumPaper>
              <FormHelperText sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                Add property approvals and certifications
              </FormHelperText>
              
              {formData.approvals.map((approval, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid var(--color-primary)', borderRadius: '8px' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Approval Name"
                        value={approval.name}
                        onChange={(e) => handleApprovalChange(index, 'name', e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiInputBase-root': {
                            color: 'var(--color-text-primary)',
                            fontFamily: '"Poppins", sans-serif'
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--color-primary)',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Approval Number"
                        value={approval.number}
                        onChange={(e) => handleApprovalChange(index, 'number', e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiInputBase-root': {
                            color: 'var(--color-text-primary)',
                            fontFamily: '"Poppins", sans-serif'
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--color-primary)',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Date"
                        type="date"
                        value={approval.date}
                        onChange={(e) => handleApprovalChange(index, 'date', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiInputBase-root': {
                            color: 'var(--color-text-primary)',
                            fontFamily: '"Poppins", sans-serif'
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--color-primary)',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <IconButton
                        onClick={() => handleRemoveApproval(index)}
                        sx={{ color: 'var(--color-danger)' }}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddApproval}
                sx={{
                  color: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  '&:hover': {
                    borderColor: 'var(--color-primary-hover)',
                    backgroundColor: 'rgba(120, 202, 220, 0.1)'
                  }
                }}
              >
                Add Approval
              </Button>
            </PremiumPaper>
          </Grid>

          {/* Brochure Section */}
          <Grid item xs={12} sm={6}>
            <SectionHeader variant="h6">Property Brochure</SectionHeader>
            <PremiumPaper>
              <FormHelperText sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                Enter brochure URL (Google Drive, Dropbox, AWS S3, etc.)
              </FormHelperText>
              
              <TextField
                fullWidth
                size="small"
                placeholder="https://example.com/brochure.pdf"
                value={brochureUrl}
                onChange={(e) => handleBrochureUrlChange(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--color-text-primary)',
                    '& fieldset': {
                      borderColor: 'var(--color-border)',
                    },
                  },
                }}
              />
              
              {brochureUrl && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--color-text-primary)' }}>
                    Brochure URL:
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 2,
                    backgroundColor: 'rgba(120, 202, 220, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)'
                  }}>
                    <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', flex: 1, wordBreak: 'break-all' }}>
                      🔗 {brochureUrl}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setBrochureUrl('')}
                      sx={{
                        backgroundColor: 'var(--color-error)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'var(--color-error-hover)'
                        }
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </PremiumPaper>
          </Grid>

          {/* Virtual Tour Section */}
          <Grid item xs={12} sm={6}>
            <SectionHeader variant="h6">Virtual Tour</SectionHeader>
            <PremiumPaper>
              <FormHelperText sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                Upload a virtual tour video (optional)
              </FormHelperText>
              
              {/* Virtual Tour Preview */}
              {virtualTourPreview && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--color-text-primary)' }}>
                    Virtual Tour Preview:
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 2,
                    backgroundColor: 'rgba(120, 202, 220, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)'
                  }}>
                    <video
                      src={virtualTourPreview}
                      controls
                      style={{
                        width: '100px',
                        height: '60px',
                        borderRadius: '4px',
                        objectFit: 'cover'
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
                        🎥 {virtualTourFile?.name || 'Virtual Tour'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {(virtualTourFile?.size && (virtualTourFile.size / 1024 / 1024).toFixed(1)) || '0'} MB
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={handleRemoveVirtualTour}
                      sx={{
                        backgroundColor: 'var(--color-error)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'var(--color-error-hover)'
                        }
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}
              
              <Button
                component="label"
                startIcon={<CloudUpload />}
                sx={{
                  color: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  '&:hover': {
                    borderColor: 'var(--color-primary-hover)',
                    backgroundColor: 'rgba(120, 202, 220, 0.1)'
                  }
                }}
                variant="outlined"
              >
                Upload Virtual Tour
                <input
                  type="file"
                  hidden
                  accept="video/*"
                  onChange={handleVirtualTourChange}
                  ref={virtualTourInputRef}
                />
              </Button>
            </PremiumPaper>
          </Grid>

          {/* Submit Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.back()}
                disabled={saving}
                sx={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border)' }}
              >
                Cancel
              </Button>
              <PremiumButton
                type="submit"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : null}
              >
                {saving ? 'Updating...' : 'Update Property'}
              </PremiumButton>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarMessage.includes('success') ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditPropertyClient;

