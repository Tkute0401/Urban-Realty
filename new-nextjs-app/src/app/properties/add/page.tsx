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
import { useRouter } from 'next/navigation';

// Styled components
const PremiumPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#0B1011',
  color: '#fff',
  borderRadius: '16px',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
  border: `2px solid #78CADC`,
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
    backgroundColor: '#78CADC',
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
  const [sectionVisibility, setSectionVisibility] = useState({
    developer: true,
    projectDetails: true,
    approvals: true,
    floorPlans: true,
    brochure: true
  });

  const imagesInputRef = useRef<HTMLInputElement>(null);

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
        background: 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)'
      }}>
        <PremiumPaper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <Typography variant="h5" sx={{ color: '#78CADC', mb: 2 }}>
            Property Created Successfully!
          </Typography>
          <Typography variant="body1" sx={{ color: '#fff' }}>
            Redirecting to properties page...
          </Typography>
        </PremiumPaper>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ 
      py: { xs: 2, md: 3 },
      background: 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)',
      minHeight: '100vh'
    }}>
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          maxWidth: 1200, 
          mx: 'auto',
          p: { xs: 1, sm: 2, md: 3 },
          backgroundColor: '#0B1011',
          borderRadius: '16px',
          border: '2px solid #78CADC',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '1.5rem', sm: '2rem' },
            color: '#78CADC',
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700
          }}
        >
            Add New Property
          </Typography>

        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
          {/* Basic Information Section */}
              <Grid item xs={12}>
            <SectionHeader variant="h6">Basic Information</SectionHeader>
            <PremiumPaper>
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
                    color: '#fff',
                    fontFamily: '"Poppins", sans-serif'
                  },
                  '& .MuiInputLabel-root': {
                    color: '#78CADC',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#78CADC',
                    },
                    '&:hover fieldset': {
                      borderColor: '#78CADC',
                    },
                  }
                }}
              />

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
                    color: '#fff',
                    fontFamily: '"Poppins", sans-serif'
                  },
                  '& .MuiInputLabel-root': {
                    color: '#78CADC',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#78CADC',
                    },
                    '&:hover fieldset': {
                      borderColor: '#78CADC',
                    },
                  }
                }}
              />

              <Grid container spacing={2}>
                {/* Property Type */}
                <Grid item xs={12} sm={6} md={4}>
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
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
                        },
                      },
                      '& .MuiSelect-icon': {
                        color: '#78CADC'
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
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
                        },
                      },
                      '& .MuiSelect-icon': {
                        color: '#78CADC'
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
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
                        },
                      },
                      '& .MuiSelect-icon': {
                        color: '#78CADC'
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
                          color: '#78CADC',
                          '&.Mui-checked': {
                            color: '#78CADC',
                          },
                        }}
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center" sx={{ color: '#fff' }}>
                        <Star color={formData.featured ? "primary" : "inherit"} sx={{ mr: 1, color: formData.featured ? '#78CADC' : '#fff' }} />
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
                        <InputAdornment position="start" sx={{ color: '#78CADC' }}>₹</InputAdornment>
                      ),
                      inputProps: { min: 0 }
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
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
                        <InputAdornment position="start" sx={{ color: '#78CADC' }}>
                          <KingBed />
                        </InputAdornment>
                      ),
                      inputProps: { min: 0 }
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
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
                        <InputAdornment position="start" sx={{ color: '#78CADC' }}>
                          <Bathtub />
                        </InputAdornment>
                      ),
                      inputProps: { min: 0 }
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
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
                        <InputAdornment position="start" sx={{ color: '#78CADC' }}>
                          <SquareFoot />
                        </InputAdornment>
                      ),
                      inputProps: { min: 0 }
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
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
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
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
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
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
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
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
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
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
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
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
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
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
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
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
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
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
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
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
                      color: '#fff',
                      border: formData.amenities.includes(amenity.name) 
                        ? '1px solid #78CADC' 
                        : '1px solid rgba(255, 255, 255, 0.2)',
                      '& .MuiChip-icon': {
                        color: formData.amenities.includes(amenity.name) ? '#78CADC' : '#fff'
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
                      color: '#fff',
                      fontFamily: '"Poppins", sans-serif'
                    },
                    '& .MuiInputLabel-root': {
                      color: '#78CADC',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#78CADC',
                      },
                      '&:hover fieldset': {
                        borderColor: '#78CADC',
                      },
                    }
                  }}
                />
              ))}
            </PremiumPaper>
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
                        border: '2px solid #78CADC'
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
                  backgroundColor: '#78CADC',
                  color: '#0B1011',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#5fb4c9'
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
                startIcon={(loading || isSubmitting) ? <CircularProgress size={20} sx={{ color: '#0B1011' }} /> : null}
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
                  color: '#78CADC',
                  borderColor: '#78CADC',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(120, 202, 220, 0.1)',
                    borderColor: '#78CADC'
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
            backgroundColor: '#0B1011',
            color: '#fff',
            border: '2px solid #78CADC',
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
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return <AddPropertyPageContent />;
};

export default AddPropertyPage;
