'use client'

import { useState, useRef, useEffect } from 'react';
import { useProperties } from '@/contexts/PropertiesContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAgents } from '@/contexts/AgentsContext';
import { useDevelopers } from '@/contexts/DevelopersContext';
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
  backgroundColor: 'var(--color-bg-dark)',
  color: 'var(--color-text-inverse)',
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
    background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-bg-dark) 100%)',
  }
}));

const PremiumButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-bg-dark)',
  fontWeight: 600,
  padding: theme.spacing(1.8, 4),
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '16px',
  boxShadow: '0 8px 24px rgba(120, 202, 220, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'var(--color-primary-hover)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 32px rgba(120, 202, 220, 0.4)',
  },
  '&:disabled': {
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-muted)',
  }
}));

interface AddPropertyProps {
  __editMode?: boolean;
  initialValues?: any;
  onSubmitEdit?: (values: any) => Promise<any> | any;
}

const AddProperty: React.FC<AddPropertyProps> = ({ __editMode = false, initialValues, onSubmitEdit }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { addProperty, loading } = useProperties() as any;
  const { agents } = useAgents() as any;
  const { developers } = useDevelopers() as any;
  
  const [formData, setFormData] = useState<any>({
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
    agent: '',
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
    approvals: [] as Array<{ name: string; number: string; date?: string }>
  });

  // Prefill when editing
  useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({
        ...prev,
        title: initialValues.title ?? prev.title,
        description: initialValues.description ?? prev.description,
        type: initialValues.type ?? initialValues.propertyType ?? prev.type,
        status: initialValues.status ?? prev.status,
        price: initialValues.price?.toString?.() ?? prev.price,
        bedrooms: (initialValues.bedrooms ?? initialValues.beds ?? prev.bedrooms)?.toString?.() ?? prev.bedrooms,
        bathrooms: (initialValues.bathrooms ?? initialValues.baths ?? prev.bathrooms)?.toString?.() ?? prev.bathrooms,
        area: (initialValues.area ?? initialValues.sqft ?? prev.area)?.toString?.() ?? prev.area,
        buildingName: initialValues.buildingName ?? prev.buildingName,
        floorNumber: initialValues.floorNumber ?? prev.floorNumber,
        featured: !!initialValues.featured,
        developer: initialValues.developer?._id ?? initialValues.developer ?? prev.developer,
        agent: initialValues.agent?._id ?? initialValues.agent ?? prev.agent,
        possessionDate: initialValues.possessionDate ?? prev.possessionDate,
        constructionStatus: initialValues.constructionStatus ?? prev.constructionStatus,
        ageOfProperty: initialValues.ageOfProperty?.toString?.() ?? prev.ageOfProperty,
        address: {
          line1: initialValues.address?.line1 ?? prev.address.line1,
          street: initialValues.address?.street ?? prev.address.street,
          city: initialValues.address?.city ?? prev.address.city,
          locality: initialValues.address?.locality ?? prev.address.locality,
          state: initialValues.address?.state ?? prev.address.state,
          zipCode: initialValues.address?.zipCode ?? prev.address.zipCode,
          country: initialValues.address?.country ?? prev.address.country,
        },
        amenities: Array.isArray(initialValues.amenities) ? initialValues.amenities : prev.amenities,
        projectDetails: {
          projectArea: initialValues.projectDetails?.projectArea ?? prev.projectDetails.projectArea,
          totalUnits: initialValues.projectDetails?.totalUnits ?? prev.projectDetails.totalUnits,
          launchDate: initialValues.projectDetails?.launchDate ?? prev.projectDetails.launchDate,
          reraId: initialValues.projectDetails?.reraId ?? prev.projectDetails.reraId,
          configurations: initialValues.projectDetails?.configurations ?? prev.projectDetails.configurations,
        },
        highlights: Array.isArray(initialValues.highlights) ? initialValues.highlights : prev.highlights,
        nearbyLocalities: initialValues.nearbyLocalities ?? prev.nearbyLocalities,
        approvals: Array.isArray(initialValues.approvals) ? initialValues.approvals : prev.approvals,
      }));
    }
  }, [initialValues]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [floorPlanFiles, setFloorPlanFiles] = useState<File[]>([]);
  const [floorPlanPreviews, setFloorPlanPreviews] = useState<string[]>([]);
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [virtualTourFile, setVirtualTourFile] = useState<File | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'warning' | 'info' }>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const [sectionVisibility, setSectionVisibility] = useState<{
    developer: boolean;
    projectDetails: boolean;
    approvals: boolean;
    floorPlans: boolean;
    brochure: boolean;
  }>({
    developer: true,
    projectDetails: true,
    approvals: true,
    floorPlans: true,
    brochure: true
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const propertyTypes = [
    { value: 'House', label: 'House', icon: <Home /> },
    { value: 'Apartment', label: 'Apartment', icon: <Apartment /> },
    { value: 'Villa', label: 'Villa', icon: <Villa /> },
    { value: 'Condo', label: 'Condo', icon: <Cottage /> },
    { value: 'Townhouse', label: 'Townhouse', icon: <Home /> },
    { value: 'Land', label: 'Land', icon: <Landscape /> },
    { value: 'Commercial', label: 'Commercial', icon: <Factory /> },
    { value: 'PG', label: 'PG', icon: <Home /> }
  ];

  const amenityOptions = [
    { value: 'Parking', label: 'Parking', icon: <LocalParking /> },
    { value: 'Swimming Pool', label: 'Swimming Pool', icon: <Pool /> },
    { value: 'Gym', label: 'Gym', icon: <FitnessCenter /> },
    { value: 'Security', label: 'Security', icon: <Security /> },
    { value: 'Garden', label: 'Garden', icon: <Spa /> },
    { value: 'Balcony', label: 'Balcony', icon: <Balcony /> },
    { value: 'WiFi', label: 'WiFi', icon: <Wifi /> },
    { value: 'Air Conditioning', label: 'Air Conditioning', icon: <AcUnit /> },
    { value: 'Furnished', label: 'Furnished', icon: <Chair /> },
    { value: 'Pet Friendly', label: 'Pet Friendly', icon: <Pets /> },
    { value: 'Elevator', label: 'Elevator', icon: <Elevator /> },
    { value: 'Laundry', label: 'Laundry', icon: <LocalLaundryService /> },
    { value: 'Storage', label: 'Storage', icon: <Storage /> },
    { value: 'Conference Room', label: 'Conference Room', icon: <MeetingRoom /> },
    { value: 'Kitchen', label: 'Kitchen', icon: <Kitchen /> }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'individual_seller') {
      setSectionVisibility({
        developer: false,
        projectDetails: false,
        approvals: false,
        floorPlans: false,
        brochure: false
      });
    } else {
      setSectionVisibility({
        developer: true,
        projectDetails: true,
        approvals: true,
        floorPlans: true,
        brochure: true
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).slice(0, 10 - imageFiles.length);
    const newImageFiles = [...imageFiles, ...files];
    const newImagePreviews = [...imagePreviews, ...files.map(file => URL.createObjectURL(file as Blob))];
    
    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);
  };

  const removeImage = (index) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
    
    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.bedrooms) newErrors.bedrooms = 'Bedrooms count is required';
    if (!formData.bathrooms) newErrors.bathrooms = 'Bathrooms count is required';
    if (!formData.area) newErrors.area = 'Area is required';
    if (!formData.address?.street?.trim()) newErrors.street = 'Street address is required';
    if (!formData.address?.city?.trim()) newErrors.city = 'City is required';
    if (!formData.address?.locality?.trim()) newErrors.locality = 'Locality is required';
    if (!formData.address?.state?.trim()) newErrors.state = 'State is required';
    if (!formData.address?.zipCode?.trim()) newErrors.zipCode = 'Zip code is required';
    if (imagePreviews.length === 0) newErrors.images = 'At least one image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    try {
      const propertyData: any = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseInt(formData.area),
      };

      if (user?.role === 'admin' && selectedAgent?._id) {
        propertyData.agent = selectedAgent._id;
      } else if (user?.id) {
        propertyData.agent = user.id;
      }

      if (selectedDeveloper?._id) {
        propertyData.developer = selectedDeveloper._id;
      }

      if (__editMode && onSubmitEdit) {
        propertyData.images = imageFiles as any;
        propertyData.floorPlans = floorPlanFiles as any;
        if (brochureFile) propertyData.brochure = brochureFile as any;
        if (virtualTourFile) propertyData.virtualTour = virtualTourFile as any;
        await onSubmitEdit(propertyData);
        setSnackbar({ open: true, message: 'Property updated successfully!', severity: 'success' });
      } else {
        await addProperty(propertyData, imageFiles, { floorPlans: floorPlanFiles, brochure: brochureFile, virtualTour: virtualTourFile });
        setSnackbar({ open: true, message: 'Property added successfully!', severity: 'success' });
      }
      
      setTimeout(() => {
        router.push('/properties');
      }, 1200);
      
    } catch (error) {
      console.error('Error submitting property:', error);
      setSnackbar({
        open: true,
        message: 'Failed to submit property. Please try again.',
        severity: 'error'
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, bgcolor: 'var(--color-bg-dark)', minHeight: '100vh' }}>
      <PremiumPaper>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'var(--color-primary)', textAlign: 'center', mb: 4 }}>
          {__editMode ? 'Edit Property' : 'Add New Property'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Agent (Admin only) */}
            {user?.role === 'admin' && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)', mb: 2 }}>
                  Assign to Agent
                </Typography>
                <Autocomplete
                  options={agents || []}
                  getOptionLabel={(option: any) => `${option.name} (${option.email})`}
                  value={selectedAgent}
                  onChange={(e, val) => setSelectedAgent(val)}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Agent" fullWidth />
                  )}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  renderOption={(props, option: any) => (
                    <li {...props} key={option._id}>
                      <Box display="flex" alignItems="center">
                        <Avatar src={option.photo} sx={{ width: 24, height: 24, mr: 1 }} />
                        <Box>
                          <Typography variant="body1">{option.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{option.email}</Typography>
                        </Box>
                      </Box>
                    </li>
                  )}
                />
              </Grid>
            )}

            {/* Developer */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)', mb: 2 }}>
                  Developer Information
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sectionVisibility.developer}
                      onChange={(e) => setSectionVisibility(prev => ({ ...prev, developer: e.target.checked }))}
                      sx={{ color: 'var(--color-primary)', '&.Mui-checked': { color: 'var(--color-primary)' } }}
                    />
                  }
                  label={<Typography sx={{ color: 'var(--color-text-inverse)' }}>Include Developer</Typography>}
                />
              </Box>
              {(user?.role !== 'individual_seller' || sectionVisibility.developer) && (
                <Autocomplete
                  options={developers || []}
                  getOptionLabel={(option: any) => option.name}
                  value={selectedDeveloper}
                  onChange={(e, val) => setSelectedDeveloper(val)}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Developer" fullWidth />
                  )}
                  renderOption={(props, option: any) => (
                    <li {...props} key={option._id}>
                      <Box display="flex" alignItems="center">
                        {option.logo?.url ? <Avatar src={option.logo.url} sx={{ width: 24, height: 24, mr: 1 }} /> : null}
                        <Typography>{option.name}</Typography>
                      </Box>
                    </li>
                  )}
                />
              )}
            </Grid>

            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)', mb: 2 }}>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Property Title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '& fieldset': { borderColor: 'var(--color-primary)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-primary)' },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Property Type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '& fieldset': { borderColor: 'var(--color-primary)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-primary)' },
                }}
              >
                {propertyTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {type.icon}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '& fieldset': { borderColor: 'var(--color-primary)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-primary)' },
                }}
              />
            </Grid>

            {/* Property Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)', mb: 2, mt: 2 }}>
                Property Details
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '& fieldset': { borderColor: 'var(--color-primary)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-primary)' },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '& fieldset': { borderColor: 'var(--color-primary)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-primary)' },
                }}
              >
                <MenuItem value="For Sale">For Sale</MenuItem>
                <MenuItem value="For Rent">For Rent</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleChange('bedrooms', e.target.value)}
                error={!!errors.bedrooms}
                helperText={errors.bedrooms}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '& fieldset': { borderColor: 'var(--color-primary)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-primary)' },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => handleChange('bathrooms', e.target.value)}
                error={!!errors.bathrooms}
                helperText={errors.bathrooms}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '& fieldset': { borderColor: 'var(--color-primary)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-primary)' },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Area (sqft)"
                type="number"
                value={formData.area}
                onChange={(e) => handleChange('area', e.target.value)}
                error={!!errors.area}
                helperText={errors.area}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '& fieldset': { borderColor: 'var(--color-primary)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-primary)' },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Building Name (optional)"
                value={formData.buildingName}
                onChange={(e) => handleChange('buildingName', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '& fieldset': { borderColor: 'var(--color-primary)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-primary)' },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Floor Number (optional)"
                value={formData.floorNumber}
                onChange={(e) => handleChange('floorNumber', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '& fieldset': { borderColor: 'var(--color-primary)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-primary)' },
                }}
              />
            </Grid>

            {/* Amenities */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)', mb: 2, mt: 2 }}>
                Amenities
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {amenityOptions.map((amenity) => (
                  <Chip
                    key={amenity.value}
                    label={amenity.label}
                    icon={amenity.icon}
                    onClick={() => handleAmenityToggle(amenity.value)}
                    color={formData.amenities.includes(amenity.value) ? 'primary' : 'default'}
                    sx={{
                      bgcolor: formData.amenities.includes(amenity.value) ? '#78CADC' : '#1a1a1a',
                      color: formData.amenities.includes(amenity.value) ? '#0c0d0e' : 'white',
                      border: '1px solid #78CADC',
                      '&:hover': {
                        bgcolor: formData.amenities.includes(amenity.value) ? 'var(--color-primary)' : 'var(--color-surface)',
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)', mb: 2, mt: 2 }}>
                Property Images
              </Typography>
              <Box
                sx={{
                  border: '2px dashed #78CADC',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: 'var(--color-primary-hover)' }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUpload sx={{ fontSize: 48, color: 'var(--color-primary)', mb: 2 }} />
                <Typography variant="body1" sx={{ color: 'var(--color-primary)', mb: 1 }}>
                  Click to upload images
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  PNG, JPG, JPEG up to 10MB each
                </Typography>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </Box>
              
              {imagePreviews.length > 0 && (
                <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                  {imagePreviews.map((preview, index) => (
                    <Box key={index} position="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '2px solid #78CADC'
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeImage(index)}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: '#ff6b6b',
                          color: 'white',
                          '&:hover': { bgcolor: '#ff5252' }
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>

            {/* Address Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)', mb: 2, mt: 2 }}>
                Address Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Apartment/Room Details (optional)" value={formData.address.line1} onChange={(e) => setFormData((p:any)=>({ ...p, address: { ...p.address, line1: e.target.value } }))} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Street Address" value={formData.address.street} onChange={(e) => setFormData((p:any)=>({ ...p, address: { ...p.address, street: e.target.value } }))} error={!!errors.street} helperText={errors.street} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="City" value={formData.address.city} onChange={(e) => setFormData((p:any)=>({ ...p, address: { ...p.address, city: e.target.value } }))} error={!!errors.city} helperText={errors.city} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Locality" value={formData.address.locality} onChange={(e) => setFormData((p:any)=>({ ...p, address: { ...p.address, locality: e.target.value } }))} error={!!errors.locality} helperText={errors.locality} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="State" value={formData.address.state} onChange={(e) => setFormData((p:any)=>({ ...p, address: { ...p.address, state: e.target.value } }))} error={!!errors.state} helperText={errors.state} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Zip Code" value={formData.address.zipCode} onChange={(e) => setFormData((p:any)=>({ ...p, address: { ...p.address, zipCode: e.target.value } }))} error={!!errors.zipCode} helperText={errors.zipCode} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Country" value={formData.address.country} onChange={(e) => setFormData((p:any)=>({ ...p, address: { ...p.address, country: e.target.value } }))} />
                </Grid>
              </Grid>
            </Grid>

            {/* Possession / Age / Construction */}
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="date" label="Possession Date" InputLabelProps={{ shrink: true }} value={formData.possessionDate} onChange={(e)=> handleChange('possessionDate', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Age of Property (years)" value={formData.ageOfProperty} onChange={(e)=> handleChange('ageOfProperty', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth select label="Construction Status" value={formData.constructionStatus} onChange={(e)=> handleChange('constructionStatus', e.target.value)}>
                {['Under Construction','Ready to Move','New Launch','Almost Ready'].map(s => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
              </TextField>
            </Grid>

            {/* Highlights */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)', mb: 2, mt: 2 }}>
                Property Highlights
              </Typography>
              {Array.from({ length: 5 }).map((_, idx) => (
                <Box key={idx} mb={2}>
                  <TextField fullWidth label={`Highlight ${idx + 1}`} value={formData.highlights[idx] || ''} onChange={(e) => {
                    const next = [...formData.highlights]; next[idx] = e.target.value; setFormData((p:any)=>({ ...p, highlights: next }));
                  }} />
                </Box>
              ))}
            </Grid>

            {/* Nearby Localities */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)', mb: 2, mt: 2 }}>
                Nearby Localities
              </Typography>
              {[
                { flag: 'hasSchool', field: 'school', label: 'School Nearby', input: 'School Name' },
                { flag: 'hasHospital', field: 'hospital', label: 'Hospital Nearby', input: 'Hospital Name' },
                { flag: 'hasMall', field: 'mall', label: 'Shopping Mall Nearby', input: 'Mall Name' },
                { flag: 'hasPark', field: 'park', label: 'Park Nearby', input: 'Park Name' },
                { flag: 'hasTransport', field: 'transport', label: 'Public Transport Nearby', input: 'Transport Details' },
              ].map((cfg) => (
                <Box key={cfg.flag} mb={2}>
                  <FormControlLabel control={<Checkbox checked={formData.nearbyLocalities[cfg.flag]} onChange={(e)=> setFormData((p:any)=> ({ ...p, nearbyLocalities: { ...p.nearbyLocalities, [cfg.flag]: e.target.checked, [cfg.field]: e.target.checked ? p.nearbyLocalities[cfg.field] : '' } }))} />} label={cfg.label} />
                  {formData.nearbyLocalities[cfg.flag] && (
                    <TextField fullWidth label={cfg.input} value={formData.nearbyLocalities[cfg.field]} onChange={(e)=> setFormData((p:any)=> ({ ...p, nearbyLocalities: { ...p.nearbyLocalities, [cfg.field]: e.target.value } }))} sx={{ mt: 1 }} />
                  )}
                </Box>
              ))}
            </Grid>

            {/* Project Details */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)', mb: 2, mt: 2 }}>
                  Project Details
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sectionVisibility.projectDetails}
                      onChange={(e) => setSectionVisibility(prev => ({ ...prev, projectDetails: e.target.checked }))}
                      sx={{ color: 'var(--color-primary)', '&.Mui-checked': { color: 'var(--color-primary)' } }}
                    />
                  }
                  label={<Typography sx={{ color: 'var(--color-text-inverse)' }}>Show</Typography>}
                />
              </Box>
              {sectionVisibility.projectDetails && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Total Project Area (acres)" value={formData.projectDetails.projectArea} onChange={(e)=> setFormData((p:any)=> ({ ...p, projectDetails: { ...p.projectDetails, projectArea: e.target.value } }))} /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Total Units in Project" value={formData.projectDetails.totalUnits} onChange={(e)=> setFormData((p:any)=> ({ ...p, projectDetails: { ...p.projectDetails, totalUnits: e.target.value } }))} /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth type="date" InputLabelProps={{ shrink: true }} label="Project Launch Date" value={formData.projectDetails.launchDate} onChange={(e)=> setFormData((p:any)=> ({ ...p, projectDetails: { ...p.projectDetails, launchDate: e.target.value } }))} /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="RERA ID" value={formData.projectDetails.reraId} onChange={(e)=> setFormData((p:any)=> ({ ...p, projectDetails: { ...p.projectDetails, reraId: e.target.value } }))} /></Grid>
                  <Grid item xs={12}><TextField fullWidth label="Available Configurations" helperText="List available configurations (e.g., 1BHK, 2BHK, 3BHK)" value={formData.projectDetails.configurations} onChange={(e)=> setFormData((p:any)=> ({ ...p, projectDetails: { ...p.projectDetails, configurations: e.target.value } }))} /></Grid>
                </Grid>
              )}
            </Grid>

            {/* Approvals */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)', mb: 2, mt: 2 }}>
                  Approvals & Certifications
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sectionVisibility.approvals}
                      onChange={(e) => setSectionVisibility(prev => ({ ...prev, approvals: e.target.checked }))}
                      sx={{ color: 'var(--color-primary)', '&.Mui-checked': { color: 'var(--color-primary)' } }}
                    />
                  }
                  label={<Typography sx={{ color: 'var(--color-text-inverse)' }}>Show</Typography>}
                />
              </Box>
              {sectionVisibility.approvals && (
                <>
                  {formData.approvals.map((approval: any, index: number) => (
                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #78CADC', borderRadius: '8px' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}><TextField fullWidth label="Approval Name" value={approval.name} onChange={(e)=>{ const next=[...formData.approvals]; next[index]={...next[index], name:e.target.value}; setFormData((p:any)=>({...p, approvals: next})); }} /></Grid>
                        <Grid item xs={12} md={4}><TextField fullWidth label="Approval Number" value={approval.number} onChange={(e)=>{ const next=[...formData.approvals]; next[index]={...next[index], number:e.target.value}; setFormData((p:any)=>({...p, approvals: next})); }} /></Grid>
                        <Grid item xs={12} md={3}><TextField fullWidth type="date" InputLabelProps={{ shrink: true }} label="Approval Date" value={approval.date || ''} onChange={(e)=>{ const next=[...formData.approvals]; next[index]={...next[index], date:e.target.value}; setFormData((p:any)=>({...p, approvals: next})); }} /></Grid>
                        <Grid item xs={12} md={1}><IconButton onClick={()=>{ const next=[...formData.approvals]; next.splice(index,1); setFormData((p:any)=>({...p, approvals: next})); }} sx={{ color: '#ff6b6b' }}><Remove /></IconButton></Grid>
                      </Grid>
                    </Box>
                  ))}
                  <Button variant="outlined" startIcon={<Add />} onClick={()=> setFormData((p:any)=> ({ ...p, approvals: [...p.approvals, { name:'', number:'', date:'' }] }))} sx={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}>Add Approval</Button>
                </>
              )}
            </Grid>

            {/* Floor Plans */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)', mb: 2, mt: 2 }}>Floor Plans</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sectionVisibility.floorPlans}
                      onChange={(e) => setSectionVisibility(prev => ({ ...prev, floorPlans: e.target.checked }))}
                      sx={{ color: 'var(--color-primary)', '&.Mui-checked': { color: 'var(--color-primary)' } }}
                    />
                  }
                  label={<Typography sx={{ color: 'var(--color-text-inverse)' }}>Show</Typography>}
                />
              </Box>
              {sectionVisibility.floorPlans && (
                <>
                  <Box sx={{ border: '2px dashed var(--color-primary)', borderRadius: 2, p: 3, textAlign: 'center', cursor: 'pointer', '&:hover': { borderColor: 'var(--color-primary-hover)' } }} onClick={() => document.getElementById('floorPlanInput')?.click()}>
                    <CloudUpload sx={{ fontSize: 48, color: 'var(--color-primary)', mb: 2 }} />
                    <Typography variant="body1" sx={{ color: 'var(--color-primary)', mb: 1 }}>Upload floor plans</Typography>
                    <input id="floorPlanInput" type="file" multiple accept="image/*" onChange={(e:any)=>{
                      const files = Array.from(e.target.files || []).slice(0, 5 - floorPlanFiles.length) as File[];
                      setFloorPlanFiles(prev => [...prev, ...files]);
                      setFloorPlanPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
                    }} style={{ display: 'none' }} />
                  </Box>
                  {floorPlanPreviews.length > 0 && (
                    <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                      {floorPlanPreviews.map((preview, index) => (
                        <Box key={index} position="relative">
                          <img src={preview} alt={`Floor ${index+1}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '2px solid #78CADC' }} />
                          <IconButton size="small" onClick={()=>{ setFloorPlanPreviews(prev => prev.filter((_,i)=> i!==index)); setFloorPlanFiles(prev => prev.filter((_,i)=> i!==index)); }} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: '#ff6b6b', color: 'white' }}><Close fontSize="small" /></IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </>
              )}
            </Grid>

            {/* Brochure */}
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)', mb: 2, mt: 2 }}>Property Brochure</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sectionVisibility.brochure}
                      onChange={(e) => setSectionVisibility(prev => ({ ...prev, brochure: e.target.checked }))}
                      sx={{ color: 'var(--color-primary)', '&.Mui-checked': { color: 'var(--color-primary)' } }}
                    />
                  }
                  label={<Typography sx={{ color: 'var(--color-text-inverse)' }}>Show</Typography>}
                />
              </Box>
              {sectionVisibility.brochure && (
                <>
                  <Button variant="contained" component="label" startIcon={<CloudUpload />} sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-primary-contrast)' }}>
                    Upload Brochure
                    <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(e:any)=> setBrochureFile(e.target.files?.[0] || null)} />
                  </Button>
                  {brochureFile ? (
                    <Box mt={2} display="flex" alignItems="center" justifyContent="space-between" p={1} sx={{ border: '1px solid #78CADC', borderRadius: '4px' }}>
                      <Typography variant="body2" sx={{ color: '#fff' }}>{brochureFile.name}</Typography>
                      <IconButton size="small" onClick={()=> setBrochureFile(null)} sx={{ color: '#ff6b6b' }}><Delete fontSize="small" /></IconButton>
                    </Box>
                  ) : null}
                </>
              )}
            </Grid>

            {/* Virtual Tour */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: 'var(--color-primary)', mb: 2, mt: 2 }}>Virtual Tour</Typography>
              <Button variant="contained" component="label" startIcon={<CloudUpload />} sx={{ bgcolor: 'var(--color-primary)', color: 'var(--color-primary-contrast)' }}>
                Upload Virtual Tour
                <input type="file" hidden accept="video/*" onChange={(e:any)=> setVirtualTourFile(e.target.files?.[0] || null)} />
              </Button>
              {virtualTourFile ? (
                <Box mt={2} display="flex" alignItems="center" justifyContent="space-between" p={1} sx={{ border: '1px solid #78CADC', borderRadius: '4px' }}>
                  <Typography variant="body2" sx={{ color: '#fff' }}>{virtualTourFile.name}</Typography>
                  <IconButton size="small" onClick={()=> setVirtualTourFile(null)} sx={{ color: '#ff6b6b' }}><Delete fontSize="small" /></IconButton>
                </Box>
              ) : null}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={4}>
                <PremiumButton
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                >
                  {loading ? 'Adding Property...' : 'Add Property'}
                </PremiumButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </PremiumPaper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddProperty;