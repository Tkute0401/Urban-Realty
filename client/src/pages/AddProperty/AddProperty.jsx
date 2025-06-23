import { useState, useRef, useEffect } from 'react';
import { useProperties } from '../../context/PropertiesContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAgents } from '../../context/AgentsContext';
import { useDevelopers } from '../../context/DevelopersContext';
import { 
  Box, TextField, Button, Grid, MenuItem, Chip, Typography, Paper,
  CircularProgress, Alert, FormControlLabel, Checkbox, Container,
  FormHelperText, InputAdornment, IconButton, Autocomplete, Avatar,
  FormLabel, Snackbar, Divider, Tooltip
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

const AddPropertyPage = () => {
  const { createProperty, loading, error, clearErrors } = useProperties();
  const { developers, getDevelopers } = useDevelopers();
  const { user } = useAuth();
  const { agents, getAgents } = useAgents();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
    amenities: [],
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
    approvals: []
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [images, setImages] = useState([]);
  const [floorPlanPreviews, setFloorPlanPreviews] = useState([]);
  const [floorPlans, setFloorPlans] = useState([]);
  const [brochurePreview, setBrochurePreview] = useState(null);
  const [brochure, setBrochure] = useState(null);
  const [virtualTourPreview, setVirtualTourPreview] = useState(null);
  const [virtualTour, setVirtualTour] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const imagesInputRef = useRef(null);
  const floorPlansInputRef = useRef(null);
  const brochureInputRef = useRef(null);
  const virtualTourInputRef = useRef(null);

  const propertyTypes = Object.keys(propertyTypeIcons);
  const propertyStatuses = ['For Sale', 'For Rent'];

  useEffect(() => {
    if (user?.role === 'admin') {
      getAgents();
    }
    getDevelopers();
    console.log(developers);
  }, [user, getAgents, getDevelopers]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarOpen(true);
    }
  }, [error]);

  const validateForm = () => {
    const errors = {};
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    
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
      formDataToSend.append('featured', formData.featured);
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
        formDataToSend.append(`nearbyLocalities[${key}]`, value);
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

      // If admin is creating, add the selected agent
      if (user?.role === 'admin' && selectedAgent) {
        formDataToSend.append('agent', selectedAgent._id);
      } else {
        formDataToSend.append('agent', user.id);
      }

      // Append images
      images.forEach(file => {
        formDataToSend.append('images', file);
      });

      // Append floor plans
      floorPlans.forEach(file => {
        formDataToSend.append('floorPlans', file);
      });

      // Append brochure if exists
      if (brochure) {
        formDataToSend.append('brochure', brochure);
      }

      // Append virtual tour if exists
      if (virtualTour) {
        formDataToSend.append('virtualTour', virtualTour);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress({ percent: percentCompleted });
        }
      };

      await createProperty(formDataToSend, config);
      setSnackbarMessage('Property created successfully!');
      setSnackbarOpen(true);
      setTimeout(() => navigate('/properties'), 1500);
    } catch (err) {
      console.error('Submission error:', err);
      setSnackbarMessage(err.message || 'Failed to create property');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10); // Limit to 10 files
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
    setImages([...images, ...files]);
    if (imagesInputRef.current) imagesInputRef.current.value = '';
    
    // Clear image error if files were selected
    if (files.length > 0) {
      setFormErrors(prev => ({ ...prev, images: undefined }));
    }
  };

  const handleFloorPlanChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 files
    const previews = files.map(file => URL.createObjectURL(file));
    setFloorPlanPreviews([...floorPlanPreviews, ...previews]);
    setFloorPlans([...floorPlans, ...files]);
    if (floorPlansInputRef.current) floorPlansInputRef.current.value = '';
  };

  const handleBrochureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrochurePreview(URL.createObjectURL(file));
      setBrochure(file);
    }
    if (brochureInputRef.current) brochureInputRef.current.value = '';
  };

  const handleVirtualTourChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVirtualTourPreview(URL.createObjectURL(file));
      setVirtualTour(file);
    }
    if (virtualTourInputRef.current) virtualTourInputRef.current.value = '';
  };

  const handleRemoveImage = (index) => {
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

  const handleRemoveFloorPlan = (index) => {
    const newPreviews = [...floorPlanPreviews];
    const newFloorPlans = [...floorPlans];
    newPreviews.splice(index, 1);
    newFloorPlans.splice(index, 1);
    setFloorPlanPreviews(newPreviews);
    setFloorPlans(newFloorPlans);
  };

  const handleRemoveBrochure = () => {
    setBrochurePreview(null);
    setBrochure(null);
  };

  const handleRemoveVirtualTour = () => {
    setVirtualTourPreview(null);
    setVirtualTour(null);
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    if (name.includes('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
      
      // Clear address errors when editing
      if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: undefined }));
      }
    } else if (name.includes('projectDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        projectDetails: { ...prev.projectDetails, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddApproval = () => {
    setFormData(prev => ({
      ...prev,
      approvals: [...prev.approvals, { name: '', number: '', date: '' }]
    }));
  };

  const handleRemoveApproval = (index) => {
    setFormData(prev => {
      const newApprovals = [...prev.approvals];
      newApprovals.splice(index, 1);
      return { ...prev, approvals: newApprovals };
    });
  };

  const handleApprovalChange = (index, field, value) => {
    setFormData(prev => {
      const newApprovals = [...prev.approvals];
      newApprovals[index][field] = value;
      return { ...prev, approvals: newApprovals };
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
          {/* Agent Selection (for admin only) */}
          {user?.role === 'admin' && (
            <Grid item xs={12}>
              <SectionHeader variant="h6">
                Assign to Agent
              </SectionHeader>
              <PremiumPaper>
                <Autocomplete
                  options={agents}
                  getOptionLabel={(option) => `${option.name} (${option.email})`}
                  value={selectedAgent}
                  onChange={(e, newValue) => setSelectedAgent(newValue)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Select Agent" 
                      fullWidth 
                      size={isMobile ? 'small' : 'medium'}
                      error={!!formErrors.agent}
                      helperText={formErrors.agent}
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
                  )}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  renderOption={(props, option) => (
                    <li {...props} key={option._id}>
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          src={option.photo} 
                          sx={{ width: 24, height: 24, mr: 1 }}
                        />
                        <Box>
                          <Typography variant="body1" sx={{ color: '#fff' }}>{option.name}</Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {option.email}
                          </Typography>
                        </Box>
                      </Box>
                    </li>
                  )}
                />
              </PremiumPaper>
            </Grid>
          )}

          {/* Developer Selection */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Developer Information</SectionHeader>
            <PremiumPaper>
              {console.log(developers)}
              <Autocomplete
                options={developers || []}
                getOptionLabel={(option) => option.name}
                value={selectedDeveloper}
                onChange={(e, newValue) => {
                  setSelectedDeveloper(newValue);
                  setFormData({
                    ...formData,
                    developer: newValue?._id || ''
                  });
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Select Developer" 
                    fullWidth 
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
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box display="flex" alignItems="center">
                      {option.logo?.url && (
                        <Avatar 
                          src={option.logo.url} 
                          alt={option.name}
                          sx={{ width: 24, height: 24, mr: 1 }}
                        />
                      )}
                      <Typography>{option.name}</Typography>
                    </Box>
                  </Box>
                )}
              />
            </PremiumPaper>
          </Grid>

          {/* Basic Information Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Basic Information</SectionHeader>
            <PremiumPaper>
              <TextField
                fullWidth
                label="Property Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
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
                onChange={handleChange}
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
                    onChange={handleChange}
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
                        {propertyTypeIcons[type]}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                {(user?.role === 'admin' || user?.role === 'agent') && (
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
                )}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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

                {/* Possession Date */}
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Possession Date"
                    name="possessionDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.possessionDate}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: '#78CADC' }}>
                          <DateRange />
                        </InputAdornment>
                      )
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

                {/* Age of Property */}
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Age of Property (years)"
                    name="ageOfProperty"
                    type="number"
                    value={formData.ageOfProperty}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    inputProps={{ min: 0 }}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    required
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.country}
                    helperText={formErrors.country}
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

          {/* Nearby Localities Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Nearby Localities</SectionHeader>
            <PremiumPaper>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', mb: 2 }}>
                Check the facilities that are nearby and provide their names
              </Typography>
              
              {/* School */}
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.nearbyLocalities.hasSchool}
                      onChange={(e) => setFormData({
                        ...formData,
                        nearbyLocalities: {
                          ...formData.nearbyLocalities,
                          hasSchool: e.target.checked,
                          school: e.target.checked ? formData.nearbyLocalities.school : ''
                        }
                      })}
                      sx={{
                        color: '#78CADC',
                        '&.Mui-checked': {
                          color: '#78CADC',
                        },
                      }}
                    />
                  }
                  label="School Nearby"
                  sx={{ color: '#fff' }}
                />
                {formData.nearbyLocalities.hasSchool && (
                  <TextField
                    fullWidth
                    label="School Name"
                    value={formData.nearbyLocalities.school}
                    onChange={(e) => setFormData({
                      ...formData,
                      nearbyLocalities: {
                        ...formData.nearbyLocalities,
                        school: e.target.value
                      }
                    })}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      mt: 1,
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
                )}
              </Box>

              {/* Hospital */}
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.nearbyLocalities.hasHospital}
                      onChange={(e) => setFormData({
                        ...formData,
                        nearbyLocalities: {
                          ...formData.nearbyLocalities,
                          hasHospital: e.target.checked,
                          hospital: e.target.checked ? formData.nearbyLocalities.hospital : ''
                        }
                      })}
                      sx={{
                        color: '#78CADC',
                        '&.Mui-checked': {
                          color: '#78CADC',
                        },
                      }}
                    />
                  }
                  label="Hospital Nearby"
                  sx={{ color: '#fff' }}
                />
                {formData.nearbyLocalities.hasHospital && (
                  <TextField
                    fullWidth
                    label="Hospital Name"
                    value={formData.nearbyLocalities.hospital}
                    onChange={(e) => setFormData({
                      ...formData,
                      nearbyLocalities: {
                        ...formData.nearbyLocalities,
                        hospital: e.target.value
                      }
                    })}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      mt: 1,
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
                )}
              </Box>

              {/* Mall */}
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.nearbyLocalities.hasMall}
                      onChange={(e) => setFormData({
                        ...formData,
                        nearbyLocalities: {
                          ...formData.nearbyLocalities,
                          hasMall: e.target.checked,
                          mall: e.target.checked ? formData.nearbyLocalities.mall : ''
                        }
                      })}
                      sx={{
                        color: '#78CADC',
                        '&.Mui-checked': {
                          color: '#78CADC',
                        },
                      }}
                    />
                  }
                  label="Shopping Mall Nearby"
                  sx={{ color: '#fff' }}
                />
                {formData.nearbyLocalities.hasMall && (
                  <TextField
                    fullWidth
                    label="Mall Name"
                    value={formData.nearbyLocalities.mall}
                    onChange={(e) => setFormData({
                      ...formData,
                      nearbyLocalities: {
                        ...formData.nearbyLocalities,
                        mall: e.target.value
                      }
                    })}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      mt: 1,
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
                )}
              </Box>

              {/* Park */}
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.nearbyLocalities.hasPark}
                      onChange={(e) => setFormData({
                        ...formData,
                        nearbyLocalities: {
                          ...formData.nearbyLocalities,
                          hasPark: e.target.checked,
                          park: e.target.checked ? formData.nearbyLocalities.park : ''
                        }
                      })}
                      sx={{
                        color: '#78CADC',
                        '&.Mui-checked': {
                          color: '#78CADC',
                        },
                      }}
                    />
                  }
                  label="Park Nearby"
                  sx={{ color: '#fff' }}
                />
                {formData.nearbyLocalities.hasPark && (
                  <TextField
                    fullWidth
                    label="Park Name"
                    value={formData.nearbyLocalities.park}
                    onChange={(e) => setFormData({
                      ...formData,
                      nearbyLocalities: {
                        ...formData.nearbyLocalities,
                        park: e.target.value
                      }
                    })}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      mt: 1,
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
                )}
              </Box>

              {/* Transport */}
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.nearbyLocalities.hasTransport}
                      onChange={(e) => setFormData({
                        ...formData,
                        nearbyLocalities: {
                          ...formData.nearbyLocalities,
                          hasTransport: e.target.checked,
                          transport: e.target.checked ? formData.nearbyLocalities.transport : ''
                        }
                      })}
                      sx={{
                        color: '#78CADC',
                        '&.Mui-checked': {
                          color: '#78CADC',
                        },
                      }}
                    />
                  }
                  label="Public Transport Nearby"
                  sx={{ color: '#fff' }}
                />
                {formData.nearbyLocalities.hasTransport && (
                  <TextField
                    fullWidth
                    label="Transport Details"
                    value={formData.nearbyLocalities.transport}
                    onChange={(e) => setFormData({
                      ...formData,
                      nearbyLocalities: {
                        ...formData.nearbyLocalities,
                        transport: e.target.value
                      }
                    })}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      mt: 1,
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
                )}
              </Box>
            </PremiumPaper>
          </Grid>

          {/* Project Details Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Project Details</SectionHeader>
            <PremiumPaper>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', mb: 2 }}>
                Additional project information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Project Area (acres)"
                    value={formData.projectDetails.projectArea}
                    onChange={(e) => setFormData({
                      ...formData, 
                      projectDetails: {
                        ...formData.projectDetails,
                        projectArea: e.target.value
                      }
                    })}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Units in Project"
                    value={formData.projectDetails.totalUnits}
                    onChange={(e) => setFormData({
                      ...formData, 
                      projectDetails: {
                        ...formData.projectDetails,
                        totalUnits: e.target.value
                      }
                    })}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Project Launch Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.projectDetails.launchDate}
                    onChange={(e) => setFormData({
                      ...formData, 
                      projectDetails: {
                        ...formData.projectDetails,
                        launchDate: e.target.value
                      }
                    })}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="RERA ID"
                    value={formData.projectDetails.reraId}
                    onChange={(e) => setFormData({
                      ...formData, 
                      projectDetails: {
                        ...formData.projectDetails,
                        reraId: e.target.value
                      }
                    })}
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
                    label="Available Configurations"
                    value={formData.projectDetails.configurations}
                    onChange={(e) => setFormData({
                      ...formData, 
                      projectDetails: {
                        ...formData.projectDetails,
                        configurations: e.target.value
                      }
                    })}
                    size={isMobile ? 'small' : 'medium'}
                    helperText="List available configurations (e.g., 1BHK, 2BHK, 3BHK)"
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

          {/* Approvals Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Approvals & Certifications</SectionHeader>
            <PremiumPaper>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', mb: 2 }}>
                Add relevant approvals and certifications for this property
              </Typography>
              
              {formData.approvals.map((approval, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #78CADC', borderRadius: '8px' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Approval Name"
                        value={approval.name}
                        onChange={(e) => handleApprovalChange(index, 'name', e.target.value)}
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
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Approval Number"
                        value={approval.number}
                        onChange={(e) => handleApprovalChange(index, 'number', e.target.value)}
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
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Approval Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={approval.date}
                        onChange={(e) => handleApprovalChange(index, 'date', e.target.value)}
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
                    <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title="Remove approval">
                        <IconButton 
                          onClick={() => handleRemoveApproval(index)}
                          sx={{ color: '#ff6b6b' }}
                        >
                          <Remove />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddApproval}
                sx={{
                  color: '#78CADC',
                  borderColor: '#78CADC',
                  '&:hover': {
                    borderColor: '#78CADC',
                    backgroundColor: 'rgba(120, 202, 220, 0.1)'
                  }
                }}
              >
                Add Approval
              </Button>
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
              {uploadProgress.percent && (
                <Typography variant="body2" sx={{ mt: 1, color: '#78CADC' }}>
                  Uploading: {uploadProgress.percent}%
                </Typography>
              )}
            </PremiumPaper>
          </Grid>

          {/* Floor Plans Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Floor Plans</SectionHeader>
            <PremiumPaper>
              <FormHelperText sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                Upload up to 5 floor plan images (5MB each)
              </FormHelperText>
              
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2, 
                mb: 2,
                maxHeight: 300,
                overflowY: 'auto'
              }}>
                {floorPlanPreviews.map((preview, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={preview}
                      alt={`Floor Plan Preview ${index}`}
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
                      onClick={() => handleRemoveFloorPlan(index)}
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
                disabled={floorPlanPreviews.length >= 5}
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
          </Grid>

          {/* Brochure Section */}
          <Grid item xs={12} sm={6}>
            <SectionHeader variant="h6">Property Brochure</SectionHeader>
            <PremiumPaper>
              <FormHelperText sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                Upload a PDF brochure for this property (optional)
              </FormHelperText>
              
              {brochurePreview ? (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    p: 1,
                    border: '1px solid #78CADC',
                    borderRadius: '4px'
                  }}>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      {brochure.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={handleRemoveBrochure}
                      sx={{ color: '#ff6b6b' }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ) : null}

              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUpload />}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  backgroundColor: '#78CADC',
                  color: '#0B1011',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#5fb4c9'
                  }
                }}
              >
                Upload Brochure
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={handleBrochureChange}
                  ref={brochureInputRef}
                />
              </Button>
            </PremiumPaper>
          </Grid>

          {/* Virtual Tour Section */}
          <Grid item xs={12} sm={6}>
            <SectionHeader variant="h6">Virtual Tour</SectionHeader>
            <PremiumPaper>
              <FormHelperText sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                Upload a virtual tour video (optional)
              </FormHelperText>
              
              {virtualTourPreview ? (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    p: 1,
                    border: '1px solid #78CADC',
                    borderRadius: '4px'
                  }}>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      {virtualTour.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={handleRemoveVirtualTour}
                      sx={{ color: '#ff6b6b' }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ) : null}

              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUpload />}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  backgroundColor: '#78CADC',
                  color: '#0B1011',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#5fb4c9'
                  }
                }}
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
                onClick={() => navigate('/properties')}
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

export default AddPropertyPage;