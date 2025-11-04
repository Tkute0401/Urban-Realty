'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Autocomplete,
  Avatar,
  FormHelperText,
  Snackbar,
  Divider,
  Tooltip
} from '@mui/material';
import { 
  CloudUpload, Delete, Star, Close,
  Home, Apartment, Villa, Cottage, Factory, Landscape,
  LocalParking, Pool, FitnessCenter, Security, Spa,
  Balcony, Wifi, AcUnit, Chair, Pets, Elevator,
  LocalLaundryService, Storage, MeetingRoom, Kitchen,
  Bathtub, KingBed, SquareFoot, DateRange, Add, Remove
} from '@mui/icons-material';
import { useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeProvider';
import { useProperties } from '@/contexts/PropertiesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAgents } from '@/contexts/AgentsContext';
import { useDevelopers } from '@/contexts/DevelopersContext';
import { useRouter } from 'next/navigation';
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

// Construction status options
const constructionStatuses = [
  'Under Construction',
  'Ready to Move',
  'New Launch',
  'Almost Ready'
];

const AddPropertyPageContent: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const { addProperty } = useProperties();
  const { user } = useAuth();
  const { agents, getAgents } = useAgents();
  const { developers, getDevelopers } = useDevelopers();
  const router = useRouter();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [floorPlanPreviews, setFloorPlanPreviews] = useState<string[]>([]);
  const [floorPlans, setFloorPlans] = useState<File[]>([]);
  const [brochureUrl, setBrochureUrl] = useState<string>('');
  const [virtualTourFile, setVirtualTourFile] = useState<File | null>(null);
  const [virtualTourPreview, setVirtualTourPreview] = useState<string | null>(null);
  const [sectionVisibility, setSectionVisibility] = useState({
    developer: true,
    projectDetails: true,
    approvals: true,
    floorPlans: true,
    brochure: true
  });

  const imagesInputRef = useRef<HTMLInputElement>(null);
  const floorPlansInputRef = useRef<HTMLInputElement>(null);
  const virtualTourInputRef = useRef<HTMLInputElement>(null);

  // Load agents and developers data
  useEffect(() => {
    if (user?.role === 'admin') {
      getAgents();
    }
    getDevelopers();
  }, [user?.role, getAgents, getDevelopers]);

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
    agent: '', // Added for admin assignment
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

  const propertyTypes = [...Object.keys(propertyTypeIcons), 'PG'];
  const propertyStatuses = ['For Sale', 'For Rent'];

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Basic information
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price) errors.price = 'Price is required';
    if (!formData.bedrooms) errors.bedrooms = 'Bedrooms count is required';
    if (!formData.bathrooms) errors.bathrooms = 'Bathrooms count is required';
    if (!formData.area) errors.area = 'Area is required';
    
    // Address validation
    if (!formData.address.street.trim()) errors.street = 'Street address is required';
    if (!formData.address.city.trim()) errors.city = 'City is required';
    if (!formData.address.locality.trim()) errors.locality = 'Locality is required';
    if (!formData.address.state.trim()) errors.state = 'State is required';
    if (!formData.address.zipCode.trim()) errors.zipCode = 'Zip code is required';
    
    // Image validation
    if (imagePreviews.length === 0) errors.images = 'At least one image is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    // Clear error when field is edited
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
      
      // Clear address errors when editing
      if (formErrors[child]) {
        setFormErrors(prev => ({ ...prev, [child]: undefined }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 10); // Limit to 10 files
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
    setImages([...images, ...files]);
    if (imagesInputRef.current) imagesInputRef.current.value = '';
    
    // Clear image error if files were selected
    if (files.length > 0) {
      setFormErrors(prev => ({ ...prev, images: undefined }));
    }
  };

  const handleRemoveImage = (index: number) => {
    const newPreviews = [...imagePreviews];
    const newImages = [...images];
    newPreviews.splice(index, 1);
    newImages.splice(index, 1);
    setImagePreviews(newPreviews);
    setImages(newImages);
    
    // Set image error if no images left
    if (newPreviews.length === 0) {
      setFormErrors(prev => ({ ...prev, images: 'At least one image is required' }));
    }
  };

  // Floor Plans handlers
  const handleFloorPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5); // Limit to 5 files
    const previews = files.map(file => URL.createObjectURL(file));
    setFloorPlanPreviews([...floorPlanPreviews, ...previews]);
    setFloorPlans([...floorPlans, ...files]);
    if (floorPlansInputRef.current) floorPlansInputRef.current.value = '';
  };

  const handleRemoveFloorPlan = (index: number) => {
    const newPreviews = [...floorPlanPreviews];
    const newFiles = [...floorPlans];
    newPreviews.splice(index, 1);
    newFiles.splice(index, 1);
    setFloorPlanPreviews(newPreviews);
    setFloorPlans(newFiles);
  };

  // Brochure URL handler
  const handleBrochureUrlChange = (url: string) => {
    setBrochureUrl(url);
  };

  // Virtual Tour handlers
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

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

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

      // Append images
      images.forEach(file => {
        formDataToSend.append('images', file);
      });

      // Append floor plans
      floorPlans.forEach(file => {
        formDataToSend.append('floorPlans', file);
      });

      // Append brochure URL
      if (brochureUrl.trim()) {
        formDataToSend.append('brochureUrl', brochureUrl.trim());
      }

      // Append virtual tour
      if (virtualTourFile) {
        formDataToSend.append('virtualTour', virtualTourFile);
      }

      await addProperty(formDataToSend);
      setSnackbarMessage('Property created successfully!');
      setSnackbarOpen(true);
      setTimeout(() => router.push('/properties'), 1500);
    } catch (err) {
      console.error('Submission error:', err);
      setSnackbarMessage(err instanceof Error ? err.message : 'Failed to create property');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-elevated) 100%)'
      }}>
        <PremiumPaper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <Typography variant="h5" sx={{ color: 'var(--color-primary)', mb: 2 }}>
            Property Created Successfully!
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--color-text-primary)' }}>
            Redirecting to properties page...
          </Typography>
        </PremiumPaper>
      </Box>
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
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '1.5rem', sm: '2rem' },
            color: 'var(--color-primary)',
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700
          }}
        >
            Add New Property
          </Typography>

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
                          '&:hover fieldset': {
                            borderColor: 'var(--color-primary-hover)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--color-primary)',
                          },
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'var(--color-primary)', color: 'var(--color-surface)' }}>
                        {option.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                          {option.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {option.email}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />
              </PremiumPaper>
            </Grid>
          )}

          {/* Developer Information Section */}
              <Grid item xs={12}>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <SectionHeader variant="h6">Developer Information</SectionHeader>
              {user?.role === 'individual_seller' && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sectionVisibility.developer}
                      onChange={(e) => setSectionVisibility(prev => ({ ...prev, developer: e.target.checked }))}
                      sx={{ color: 'var(--color-primary)' }}
                    />
                  }
                  label="Show this section"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                />
              )}
            </Box>
            {sectionVisibility.developer && (
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
                          '&:hover fieldset': {
                            borderColor: 'var(--color-primary-hover)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--color-primary)',
                          },
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {option.logo && (
                        <Avatar 
                          src={option.logo} 
                          sx={{ width: 32, height: 32 }}
                          alt={option.name}
                        />
                      )}
                      <Box>
                        <Typography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                          {option.name}
                </Typography>
                        {option.website && (
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {option.website}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                />
              </PremiumPaper>
            )}
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
                sx={{
                  mb: 2,
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
                    '&:hover fieldset': {
                      borderColor: 'var(--color-primary)',
                    },
                  }
                }}
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
                sx={{
                  mb: 2,
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
                    '&:hover fieldset': {
                      borderColor: 'var(--color-primary)',
                    },
                  }
                }}
              />

              <Grid container spacing={2}>
                {/* Property Type */}
                <Grid item xs={12} sm={6} md={4}>
                  <FieldIndicator required helperText="Select the type of property" />
                  <TextField
                    select
                    fullWidth
                    label="Property Type"
                    name="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    required
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
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiSelect-icon': {
                        color: 'var(--color-primary)'
                      }
                    }}
                  >
                    {propertyTypes.map(type => (
                      <MenuItem 
                        key={type} 
                        value={type}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontFamily: '"Poppins", sans-serif'
                        }}
                      >
                        {propertyTypeIcons[type as keyof typeof propertyTypeIcons]}
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
              </Grid>

                {/* Status */}
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    select
                  fullWidth
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  required
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
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiSelect-icon': {
                        color: 'var(--color-primary)'
                      }
                    }}
                  >
                    {propertyStatuses.map(status => (
                      <MenuItem 
                        key={status} 
                        value={status}
                        sx={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Construction Status */}
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Construction Status"
                    name="constructionStatus"
                    value={formData.constructionStatus}
                    onChange={(e) => handleInputChange('constructionStatus', e.target.value)}
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
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiSelect-icon': {
                        color: 'var(--color-primary)'
                      }
                    }}
                  >
                    {constructionStatuses.map(status => (
                      <MenuItem 
                        key={status} 
                        value={status}
                        sx={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Featured Property */}
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                        name="featured"
                        sx={{
                          color: 'var(--color-primary)',
                          '&.Mui-checked': {
                            color: 'var(--color-primary)',
                          },
                        }}
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center" sx={{ color: 'var(--color-text-primary)' }}>
                        <Star color={formData.featured ? "primary" : "inherit"} sx={{ mr: 1, color: formData.featured ? 'var(--color-primary)' : 'var(--color-text-primary)' }} />
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
                {/* Price */}
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
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      }
                    }}
                />
              </Grid>

                {/* Bedrooms */}
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
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      }
                    }}
                />
              </Grid>

                {/* Bathrooms */}
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
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      }
                    }}
                />
              </Grid>

                {/* Area */}
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
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      }
                    }}
                  />
              </Grid>

                {/* Building Name */}
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Building Name (optional)"
                    name="buildingName"
                    value={formData.buildingName}
                    onChange={(e) => handleInputChange('buildingName', e.target.value)}
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
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      }
                    }}
                  />
              </Grid>

                {/* Floor Number */}
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                    label="Floor Number (optional)"
                    name="floorNumber"
                    value={formData.floorNumber}
                    onChange={(e) => handleInputChange('floorNumber', e.target.value)}
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
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </PremiumPaper>
              </Grid>

          {/* Address Section */}
              <Grid item xs={12}>
            <SectionHeader variant="h6">Address Details</SectionHeader>
            <PremiumPaper>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Apartment/Room Details (optional)"
                    name="address.line1"
                    value={formData.address.line1}
                    onChange={(e) => handleInputChange('address.line1', e.target.value)}
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
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      }
                    }}
                  />
              </Grid>
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
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      }
                    }}
                />
              </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      }
                    }}
                />
              </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Locality"
                    name="address.locality"
                    value={formData.address.locality}
                    onChange={(e) => handleInputChange('address.locality', e.target.value)}
                    required
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.locality}
                    helperText={formErrors.locality}
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
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      }
                    }}
                />
              </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="address.country"
                    value={formData.address.country}
                    onChange={(e) => handleInputChange('address.country', e.target.value)}
                    required
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
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </PremiumPaper>
              </Grid>

          {/* Amenities */}
              <Grid item xs={12}>
            <SectionHeader variant="h6">Amenities</SectionHeader>
            <PremiumPaper>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {amenitiesConfig.map(amenity => (
                  <Chip
                    key={amenity.name}
                    label={amenity.name}
                    icon={amenity.icon}
                    clickable
                    size={isMobile ? 'small' : 'medium'}
                    color={formData.amenities.includes(amenity.name) ? 'primary' : 'default'}
                    onClick={() => handleAmenityToggle(amenity.name)}
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      backgroundColor: formData.amenities.includes(amenity.name) 
                        ? 'rgba(120, 202, 220, 0.2)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      color: 'var(--color-text-primary)',
                      border: formData.amenities.includes(amenity.name) 
                        ? '1px solid var(--color-primary)' 
                        : '1px solid rgba(255, 255, 255, 0.2)',
                      '& .MuiChip-icon': {
                        color: formData.amenities.includes(amenity.name) ? 'var(--color-primary)' : 'var(--color-text-primary)'
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(120, 202, 220, 0.3)'
                      }
                    }}
                  />
                ))}
              </Box>
            </PremiumPaper>
          </Grid>

          {/* Highlights Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Property Highlights</SectionHeader>
            <PremiumPaper>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', mb: 2 }}>
                Add 5 key highlights of this property
              </Typography>
              {Array.from({ length: 5 }).map((_, index) => (
                <TextField
                  key={index}
                  fullWidth
                  label={`Highlight ${index + 1}`}
                  value={formData.highlights[index] || ''}
                  onChange={(e) => {
                    const newHighlights = [...formData.highlights];
                    newHighlights[index] = e.target.value;
                    setFormData({...formData, highlights: newHighlights});
                  }}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    mb: 2,
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
                      '&:hover fieldset': {
                        borderColor: 'var(--color-primary)',
                      },
                    }
                  }}
                />
              ))}
            </PremiumPaper>
          </Grid>

          {/* Nearby Localities Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Nearby Localities</SectionHeader>
            <PremiumPaper>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', mb: 2 }}>
                Check the facilities that are nearby and provide their names
              </Typography>
              
              <Grid container spacing={2}>
                {/* School */}
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.nearbyLocalities.hasSchool}
                        onChange={(e) => handleInputChange('nearbyLocalities', {
                          ...formData.nearbyLocalities,
                          hasSchool: e.target.checked
                        })}
                        sx={{ color: 'var(--color-primary)' }}
                      />
                    }
                    label="School Nearby"
                    sx={{ color: 'rgba(255, 255, 255, 0.85)' }}
                  />
                  {formData.nearbyLocalities.hasSchool && (
                    <TextField
                      fullWidth
                      label="School Name"
                      value={formData.nearbyLocalities.school}
                      onChange={(e) => handleInputChange('nearbyLocalities', {
                        ...formData.nearbyLocalities,
                        school: e.target.value
                      })}
                      size={isMobile ? 'small' : 'medium'}
                      sx={{
                        mt: 1,
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
                          '&:hover fieldset': {
                            borderColor: 'var(--color-primary-hover)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--color-primary)',
                          },
                        },
                      }}
                    />
                  )}
                </Grid>

                {/* Hospital */}
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.nearbyLocalities.hasHospital}
                        onChange={(e) => handleInputChange('nearbyLocalities', {
                          ...formData.nearbyLocalities,
                          hasHospital: e.target.checked
                        })}
                        sx={{ color: 'var(--color-primary)' }}
                      />
                    }
                    label="Hospital Nearby"
                    sx={{ color: 'rgba(255, 255, 255, 0.85)' }}
                  />
                  {formData.nearbyLocalities.hasHospital && (
                    <TextField
                      fullWidth
                      label="Hospital Name"
                      value={formData.nearbyLocalities.hospital}
                      onChange={(e) => handleInputChange('nearbyLocalities', {
                        ...formData.nearbyLocalities,
                        hospital: e.target.value
                      })}
                      size={isMobile ? 'small' : 'medium'}
                      sx={{
                        mt: 1,
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
                          '&:hover fieldset': {
                            borderColor: 'var(--color-primary-hover)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--color-primary)',
                          },
                        },
                      }}
                    />
                  )}
                </Grid>

                {/* Mall */}
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.nearbyLocalities.hasMall}
                        onChange={(e) => handleInputChange('nearbyLocalities', {
                          ...formData.nearbyLocalities,
                          hasMall: e.target.checked
                        })}
                        sx={{ color: 'var(--color-primary)' }}
                      />
                    }
                    label="Mall Nearby"
                    sx={{ color: 'rgba(255, 255, 255, 0.85)' }}
                  />
                  {formData.nearbyLocalities.hasMall && (
                    <TextField
                      fullWidth
                      label="Mall Name"
                      value={formData.nearbyLocalities.mall}
                      onChange={(e) => handleInputChange('nearbyLocalities', {
                        ...formData.nearbyLocalities,
                        mall: e.target.value
                      })}
                      size={isMobile ? 'small' : 'medium'}
                      sx={{
                        mt: 1,
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
                          '&:hover fieldset': {
                            borderColor: 'var(--color-primary-hover)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--color-primary)',
                          },
                        },
                      }}
                    />
                  )}
                </Grid>

                {/* Park */}
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.nearbyLocalities.hasPark}
                        onChange={(e) => handleInputChange('nearbyLocalities', {
                          ...formData.nearbyLocalities,
                          hasPark: e.target.checked
                        })}
                        sx={{ color: 'var(--color-primary)' }}
                      />
                    }
                    label="Park Nearby"
                    sx={{ color: 'rgba(255, 255, 255, 0.85)' }}
                  />
                  {formData.nearbyLocalities.hasPark && (
                    <TextField
                      fullWidth
                      label="Park Name"
                      value={formData.nearbyLocalities.park}
                      onChange={(e) => handleInputChange('nearbyLocalities', {
                        ...formData.nearbyLocalities,
                        park: e.target.value
                      })}
                      size={isMobile ? 'small' : 'medium'}
                      sx={{
                        mt: 1,
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
                          '&:hover fieldset': {
                            borderColor: 'var(--color-primary-hover)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--color-primary)',
                          },
                        },
                      }}
                    />
                  )}
                </Grid>

                {/* Transport */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.nearbyLocalities.hasTransport}
                        onChange={(e) => handleInputChange('nearbyLocalities', {
                          ...formData.nearbyLocalities,
                          hasTransport: e.target.checked
                        })}
                        sx={{ color: 'var(--color-primary)' }}
                      />
                    }
                    label="Public Transport Nearby"
                    sx={{ color: 'rgba(255, 255, 255, 0.85)' }}
                  />
                  {formData.nearbyLocalities.hasTransport && (
                    <TextField
                      fullWidth
                      label="Transport Details (Metro/Bus Station)"
                      value={formData.nearbyLocalities.transport}
                      onChange={(e) => handleInputChange('nearbyLocalities', {
                        ...formData.nearbyLocalities,
                        transport: e.target.value
                      })}
                      size={isMobile ? 'small' : 'medium'}
                      sx={{
                        mt: 1,
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
                          '&:hover fieldset': {
                            borderColor: 'var(--color-primary-hover)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--color-primary)',
                          },
                        },
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </PremiumPaper>
          </Grid>

          {/* Project Details Section */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <SectionHeader variant="h6">Project Details</SectionHeader>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionVisibility.projectDetails}
                    onChange={(e) => setSectionVisibility(prev => ({ ...prev, projectDetails: e.target.checked }))}
                    sx={{ color: 'var(--color-primary)' }}
                  />
                }
                label="Show this section"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              />
            </Box>
            {sectionVisibility.projectDetails && (
              <PremiumPaper>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Project Area (sq ft)"
                      value={formData.projectDetails.projectArea}
                      onChange={(e) => handleInputChange('projectDetails', {
                        ...formData.projectDetails,
                        projectArea: e.target.value
                      })}
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
                          '&:hover fieldset': {
                            borderColor: 'var(--color-primary-hover)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--color-primary)',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Total Units"
                      value={formData.projectDetails.totalUnits}
                      onChange={(e) => handleInputChange('projectDetails', {
                        ...formData.projectDetails,
                        totalUnits: e.target.value
                      })}
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
                          '&:hover fieldset': {
                            borderColor: 'var(--color-primary-hover)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--color-primary)',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Launch Date"
                      type="date"
                      value={formData.projectDetails.launchDate}
                      onChange={(e) => handleInputChange('projectDetails', {
                        ...formData.projectDetails,
                        launchDate: e.target.value
                      })}
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
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'var(--color-primary)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--color-primary-hover)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--color-primary)',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="RERA ID"
                      value={formData.projectDetails.reraId}
                      onChange={(e) => handleInputChange('projectDetails', {
                        ...formData.projectDetails,
                        reraId: e.target.value
                      })}
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
                          '&:hover fieldset': {
                            borderColor: 'var(--color-primary-hover)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--color-primary)',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Available Configurations"
                      value={formData.projectDetails.configurations}
                      onChange={(e) => handleInputChange('projectDetails', {
                        ...formData.projectDetails,
                        configurations: e.target.value
                      })}
                      multiline
                      rows={3}
                      placeholder="e.g., 1BHK, 2BHK, 3BHK"
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
                          '&:hover fieldset': {
                            borderColor: 'var(--color-primary-hover)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--color-primary)',
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </PremiumPaper>
            )}
          </Grid>

          {/* Approvals & Certifications Section */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <SectionHeader variant="h6">Approvals & Certifications</SectionHeader>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionVisibility.approvals}
                    onChange={(e) => setSectionVisibility(prev => ({ ...prev, approvals: e.target.checked }))}
                    sx={{ color: 'var(--color-primary)' }}
                  />
                }
                label="Show this section"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              />
            </Box>
            {sectionVisibility.approvals && (
              <PremiumPaper>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', mb: 2 }}>
                  Add property approvals and certifications
                </Typography>
                
                {formData.approvals.map((approval, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid var(--color-primary)', borderRadius: '8px' }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Approval Name"
                          value={approval.name}
                          onChange={(e) => {
                            const newApprovals = [...formData.approvals];
                            newApprovals[index] = { ...approval, name: e.target.value };
                            handleInputChange('approvals', newApprovals);
                          }}
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
                              '&:hover fieldset': {
                                borderColor: 'var(--color-primary-hover)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'var(--color-primary)',
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Approval Number"
                          value={approval.number}
                          onChange={(e) => {
                            const newApprovals = [...formData.approvals];
                            newApprovals[index] = { ...approval, number: e.target.value };
                            handleInputChange('approvals', newApprovals);
                          }}
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
                              '&:hover fieldset': {
                                borderColor: 'var(--color-primary-hover)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'var(--color-primary)',
                              },
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
                          onChange={(e) => {
                            const newApprovals = [...formData.approvals];
                            newApprovals[index] = { ...approval, date: e.target.value };
                            handleInputChange('approvals', newApprovals);
                          }}
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
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'var(--color-primary)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'var(--color-primary-hover)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'var(--color-primary)',
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton
                          onClick={() => {
                            const newApprovals = formData.approvals.filter((_, i) => i !== index);
                            handleInputChange('approvals', newApprovals);
                          }}
                          sx={{ color: 'var(--color-danger)' }}
                        >
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                
                <Button
                  onClick={() => {
                    const newApprovals = [...formData.approvals, { name: '', number: '', date: '' }];
                    handleInputChange('approvals', newApprovals);
                  }}
                  startIcon={<Add />}
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
                  Add Approval
                </Button>
              </PremiumPaper>
            )}
          </Grid>

          {/* Images Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Property Images</SectionHeader>
            <PremiumPaper>
              <FormHelperText sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                Upload up to 10 images (5MB each). First image will be used as primary.
              </FormHelperText>
              
              {formErrors.images && (
                <FormHelperText error sx={{ mb: 1 }}>
                  {formErrors.images}
                </FormHelperText>
              )}
              
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2, 
                mb: 2,
                maxHeight: 300,
                overflowY: 'auto'
              }}>
                {imagePreviews.map((preview, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={preview}
                      alt={`Preview ${index}`}
                      sx={{ 
                        width: 120, 
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid var(--color-primary)'
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(index)}
                      sx={{ 
                        position: 'absolute', 
                        top: 4, 
                        right: 4, 
                        color: 'white', 
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.7)'
                        }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>

                  <Button
                variant="contained"
                component="label"
                startIcon={<CloudUpload />}
                size={isMobile ? 'small' : 'medium'}
                disabled={imagePreviews.length >= 10}
                sx={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-surface)',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)'
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(120, 202, 220, 0.5)'
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
                  disabled={imagePreviews.length >= 10}
                />
                  </Button>
            </PremiumPaper>
          </Grid>

          {/* Floor Plans Section */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <SectionHeader variant="h6">Floor Plans</SectionHeader>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionVisibility.floorPlans}
                    onChange={(e) => setSectionVisibility(prev => ({ ...prev, floorPlans: e.target.checked }))}
                    sx={{ color: 'var(--color-primary)' }}
                  />
                }
                label="Show this section"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              />
            </Box>
            {sectionVisibility.floorPlans && (
              <PremiumPaper>
                <FormHelperText sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                  Upload floor plan images (optional, up to 5 files)
                </FormHelperText>
                
                {/* Floor Plan Previews */}
                {floorPlanPreviews.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--color-text-primary)' }}>
                      Floor Plan Previews:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {floorPlanPreviews.map((preview, index) => (
                        <Box key={index} sx={{ position: 'relative', width: 100, height: 100 }}>
                          <img
                            src={preview}
                            alt={`Floor plan ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid var(--color-border)'
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveFloorPlan(index)}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
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
                      ))}
                    </Box>
                  </Box>
                )}
                
                <Button
                  component="label"
                  startIcon={<CloudUpload />}
                  disabled={floorPlanPreviews.length >= 5}
                  sx={{
                    color: 'var(--color-primary)',
                    borderColor: 'var(--color-primary)',
                    '&:hover': {
                      borderColor: 'var(--color-primary-hover)',
                      backgroundColor: 'rgba(120, 202, 220, 0.1)'
                    },
                    '&:disabled': {
                      borderColor: 'rgba(120, 202, 220, 0.3)',
                      color: 'rgba(120, 202, 220, 0.3)'
                    }
                  }}
                  variant="outlined"
                >
                  Upload Floor Plans
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleFloorPlanChange}
                    ref={floorPlansInputRef}
                    disabled={floorPlanPreviews.length >= 5}
                  />
                </Button>
              </PremiumPaper>
            )}
          </Grid>

          {/* Brochure Section */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <SectionHeader variant="h6">Property Brochure</SectionHeader>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sectionVisibility.brochure}
                    onChange={(e) => setSectionVisibility(prev => ({ ...prev, brochure: e.target.checked }))}
                    sx={{ color: 'var(--color-primary)' }}
                  />
                }
                label="Show this section"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              />
            </Box>
            {sectionVisibility.brochure && (
              <PremiumPaper>
                <FormHelperText sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                  Enter brochure URL (Google Drive, Dropbox, AWS S3, etc.)
                </FormHelperText>
                
                {/* URL Input */}
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
                        onClick={() => {
                          setBrochureUrl('');
                        }}
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
            )}
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
                        🎥 {virtualTourFile?.name}
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
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2
            }}>
              <PremiumButton
                    type="submit"
                size="large"
                disabled={loading || isSubmitting}
                startIcon={(loading || isSubmitting) ? <CircularProgress size={20} sx={{ color: 'var(--color-surface)' }} /> : null}
                    sx={{
                  flex: 1,
                  py: 1.5,
                  '&:disabled': {
                    backgroundColor: 'rgba(120, 202, 220, 0.5)'
                  }
                }}
              >
                {(loading || isSubmitting) ? 'Adding Property...' : 'Add Property'}
              </PremiumButton>
              
              <Button
                variant="outlined"
                size="large"
                sx={{ 
                  flex: 1,
                  py: 1.5,
                  color: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(120, 202, 220, 0.1)',
                    borderColor: 'var(--color-primary)'
                  }
                }}
                onClick={() => router.push('/properties')}
              >
                Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
    </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <Close fontSize="small" />
          </IconButton>
        }
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            border: '2px solid var(--color-primary)',
            fontFamily: '"Poppins", sans-serif'
          }
        }}
      />
    </Container>
  );
};

const AddPropertyPage: React.FC = () => {
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
        background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-accent) 100%)'
      }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return <AddPropertyPageContent />;
};

export default AddPropertyPage;
