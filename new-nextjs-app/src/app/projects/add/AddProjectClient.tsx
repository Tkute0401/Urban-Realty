'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/contexts/ProjectsContext';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Snackbar,
  Divider,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  LinearProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add,
  Delete,
  Save,
  Cancel,
  Business,
  LocationOn,
  AttachMoney,
  CalendarToday,
  Description,
  CloudUpload,
  Image,
  PictureAsPdf,
  VideoLibrary,
  Map,
  Apartment
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text-primary)',
  borderRadius: '16px',
  border: '2px solid var(--color-primary)',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: 'var(--color-primary)',
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-primary-contrast)',
  fontWeight: 600,
  borderRadius: '8px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'var(--color-primary-hover)',
  },
}));

const AddProjectClient = () => {
  const { user } = useAuth();
  const { createProject, loading, error } = useProjects();
  const router = useRouter();
  
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'warning' | 'info' }>({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    type: 'Residential',
    status: 'Planning',
    totalUnits: '',
    totalArea: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    launchDate: '',
    possessionDate: '',
    pricePerSqFt: '',
    startingPrice: '',
    amenities: [],
    features: [],
    keywords: [],
    configurations: []
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newConfiguration, setNewConfiguration] = useState({
    name: '',
    type: '2BHK',
    bedrooms: 2,
    bathrooms: 2,
    area: '',
    price: '',
    pricePerSqFt: '',
    description: '',
    isAvailable: true,
    unitsAvailable: ''
  });
  
  // File upload states
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedFloorPlans, setSelectedFloorPlans] = useState<File[]>([]);
  const [selectedBrochures, setSelectedBrochures] = useState<File[]>([]);
  const [selectedVirtualTours, setSelectedVirtualTours] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    if (user?.role !== 'developer') {
      router.push('/');
    }
  }, [user, router]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
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

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, { name: newAmenity.trim(), description: '' }]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, { name: newFeature.trim(), description: '' }]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const addConfiguration = () => {
    if (newConfiguration.name.trim() && newConfiguration.area && newConfiguration.price) {
      const config = {
        ...newConfiguration,
        area: parseFloat(newConfiguration.area),
        price: parseFloat(newConfiguration.price),
        pricePerSqFt: newConfiguration.pricePerSqFt ? parseFloat(newConfiguration.pricePerSqFt) : undefined,
        unitsAvailable: newConfiguration.unitsAvailable ? parseInt(newConfiguration.unitsAvailable) : undefined
      };
      
      setFormData(prev => ({
        ...prev,
        configurations: [...prev.configurations, config]
      }));
      
      setNewConfiguration({
        name: '',
        type: '2BHK',
        bedrooms: 2,
        bathrooms: 2,
        area: '',
        price: '',
        pricePerSqFt: '',
        description: '',
        isAvailable: true,
        unitsAvailable: ''
      });
    }
  };

  const removeConfiguration = (index) => {
    setFormData(prev => ({
      ...prev,
      configurations: prev.configurations.filter((_, i) => i !== index)
    }));
  };

  const updateConfiguration = (index, field, value) => {
    setNewConfiguration(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // File upload handlers
  const handleFileSelect = (files: FileList, type: 'images' | 'floorPlans' | 'brochures' | 'virtualTours') => {
    const fileArray = Array.from(files);
    switch (type) {
      case 'images':
        setSelectedImages(prev => [...prev, ...fileArray].slice(0, 10)); // Max 10 images
        break;
      case 'floorPlans':
        setSelectedFloorPlans(prev => [...prev, ...fileArray].slice(0, 5)); // Max 5 floor plans
        break;
      case 'brochures':
        setSelectedBrochures(prev => [...prev, ...fileArray].slice(0, 3)); // Max 3 brochures
        break;
      case 'virtualTours':
        setSelectedVirtualTours(prev => [...prev, ...fileArray].slice(0, 2)); // Max 2 virtual tours
        break;
    }
  };

  const removeFile = (index: number, type: 'images' | 'floorPlans' | 'brochures' | 'virtualTours') => {
    switch (type) {
      case 'images':
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        break;
      case 'floorPlans':
        setSelectedFloorPlans(prev => prev.filter((_, i) => i !== index));
        break;
      case 'brochures':
        setSelectedBrochures(prev => prev.filter((_, i) => i !== index));
        break;
      case 'virtualTours':
        setSelectedVirtualTours(prev => prev.filter((_, i) => i !== index));
        break;
    }
  };

  // Geocoding function using OpenStreetMap
  const geocodeAddress = async (address: string) => {
    if (!address.trim()) return null;
    
    setIsGeocoding(true);
    try {
      // Use OpenStreetMap Nominatim for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        {
          headers: {
            'User-Agent': 'UrbanRealty/1.0'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          return {
            type: 'Point',
            coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
          };
        }
      }
      
      // Fallback to city-based coordinates if API fails
      const cityCoordinates: { [key: string]: [number, number] } = {
        'delhi': [77.2090, 28.6139],
        'mumbai': [72.8777, 19.0760],
        'bangalore': [77.5946, 12.9716],
        'chennai': [80.2707, 13.0827],
        'kolkata': [88.3639, 22.5726],
        'hyderabad': [78.4867, 17.3850],
        'pune': [73.8567, 18.5204],
        'ahmedabad': [72.5714, 23.0225],
        'jaipur': [75.7873, 26.9124],
        'lucknow': [80.9462, 26.8467],
        'nashik': [73.7898, 19.9975]
      };
      
      const addressLower = address.toLowerCase();
      for (const [city, coords] of Object.entries(cityCoordinates)) {
        if (addressLower.includes(city)) {
          return {
            type: 'Point',
            coordinates: coords
          };
        }
      }
      
      // Default to Delhi if no city match found
      return {
        type: 'Point',
        coordinates: [77.2090, 28.6139]
      };
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsGeocoding(false);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      setSnackbar({
        open: true,
        message: 'Project name and description are required',
        severity: 'error'
      });
      return;
    }

    setSaving(true);
    setUploadProgress(0);
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'object' && formData[key] !== null) {
          if (Array.isArray(formData[key])) {
            formData[key].forEach((item, index) => {
              if (typeof item === 'object') {
                Object.keys(item).forEach(subKey => {
                  formDataToSend.append(`${key}[${index}][${subKey}]`, item[subKey]);
                });
              } else {
                formDataToSend.append(`${key}[${index}]`, item);
              }
            });
          } else {
            Object.keys(formData[key]).forEach(subKey => {
              formDataToSend.append(`${key}[${subKey}]`, formData[key][subKey]);
            });
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add files to FormData
      selectedImages.forEach((file, index) => {
        formDataToSend.append('images', file);
      });
      
      selectedFloorPlans.forEach((file, index) => {
        formDataToSend.append('floorPlans', file);
      });
      
      selectedBrochures.forEach((file, index) => {
        formDataToSend.append('brochures', file);
      });
      
      selectedVirtualTours.forEach((file, index) => {
        formDataToSend.append('virtualTours', file);
      });

      // Geocode address if provided
      if (formData.location.address) {
        const coordinates = await geocodeAddress(formData.location.address);
        if (coordinates) {
          formDataToSend.append('location[coordinates][type]', coordinates.type);
          formDataToSend.append('location[coordinates][coordinates][0]', coordinates.coordinates[0].toString());
          formDataToSend.append('location[coordinates][coordinates][1]', coordinates.coordinates[1].toString());
        }
      }

      setUploadProgress(50);
      await createProject(formDataToSend);
      setUploadProgress(100);
      
      setSnackbar({
        open: true,
        message: 'Project created successfully!',
        severity: 'success'
      });
      setTimeout(() => router.push('/projects'), 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to create project',
        severity: 'error'
      });
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  if (user?.role !== 'developer') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. This page is only available for developer users.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'var(--color-primary)', mb: 1 }}>
          Add New Project
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
          Create a new development project to showcase your work
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <StyledPaper>
          <SectionHeader variant="h5">
            <Business />
            Basic Information
          </SectionHeader>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--color-text-primary)',
                    '& fieldset': { borderColor: 'var(--color-border)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'var(--color-text-muted)' }}>Project Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  label="Project Type"
                  sx={{
                    color: 'var(--color-text-primary)',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-border)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-primary)' },
                  }}
                >
                  <MenuItem value="Residential">Residential</MenuItem>
                  <MenuItem value="Commercial">Commercial</MenuItem>
                  <MenuItem value="Mixed-Use">Mixed-Use</MenuItem>
                  <MenuItem value="Industrial">Industrial</MenuItem>
                  <MenuItem value="Hospitality">Hospitality</MenuItem>
                  <MenuItem value="Retail">Retail</MenuItem>
                  <MenuItem value="Office">Office</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'var(--color-text-muted)' }}>Project Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  label="Project Status"
                  sx={{
                    color: 'var(--color-text-primary)',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-border)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-primary)' },
                  }}
                >
                  <MenuItem value="Planning">Planning</MenuItem>
                  <MenuItem value="Under Construction">Under Construction</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Project Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--color-text-primary)',
                    '& fieldset': { borderColor: 'var(--color-border)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Short Description (for cards)"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--color-text-primary)',
                    '& fieldset': { borderColor: 'var(--color-border)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                }}
              />
            </Grid>
          </Grid>
        </StyledPaper>

        <StyledPaper>
          <SectionHeader variant="h5">
            <LocationOn />
            Location Information
          </SectionHeader>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Address"
                value={formData.location.address}
                onChange={(e) => handleInputChange('location.address', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--color-text-primary)',
                    '& fieldset': { borderColor: 'var(--color-border)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                value={formData.location.city}
                onChange={(e) => handleInputChange('location.city', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--color-text-primary)',
                    '& fieldset': { borderColor: 'var(--color-border)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State"
                value={formData.location.state}
                onChange={(e) => handleInputChange('location.state', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--color-text-primary)',
                    '& fieldset': { borderColor: 'var(--color-border)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Pincode"
                value={formData.location.pincode}
                onChange={(e) => handleInputChange('location.pincode', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--color-text-primary)',
                    '& fieldset': { borderColor: 'var(--color-border)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                }}
              />
            </Grid>
          </Grid>
        </StyledPaper>

        <StyledPaper>
          <SectionHeader variant="h5">
            <AttachMoney />
            Pricing Information
          </SectionHeader>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Starting Price (₹)"
                type="number"
                value={formData.startingPrice}
                onChange={(e) => handleInputChange('startingPrice', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--color-text-primary)',
                    '& fieldset': { borderColor: 'var(--color-border)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price per Sq Ft (₹)"
                type="number"
                value={formData.pricePerSqFt}
                onChange={(e) => handleInputChange('pricePerSqFt', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--color-text-primary)',
                    '& fieldset': { borderColor: 'var(--color-border)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Units"
                type="number"
                value={formData.totalUnits}
                onChange={(e) => handleInputChange('totalUnits', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--color-text-primary)',
                    '& fieldset': { borderColor: 'var(--color-border)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Area (Sq Ft)"
                type="number"
                value={formData.totalArea}
                onChange={(e) => handleInputChange('totalArea', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--color-text-primary)',
                    '& fieldset': { borderColor: 'var(--color-border)' },
                    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                }}
              />
            </Grid>
          </Grid>
        </StyledPaper>

        {/* Project Configurations Section */}
        <StyledPaper>
          <SectionHeader variant="h5">
            <Apartment />
            Project Configurations
          </SectionHeader>
          
          <Typography variant="body2" sx={{ mb: 3, color: 'var(--color-text-muted)' }}>
            Add different unit configurations (e.g., 2BHK, 3BHK) with their specific details
          </Typography>

          {/* Add Configuration Form */}
          <Box sx={{ mb: 3, p: 2, border: '1px dashed var(--color-border)', borderRadius: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
              Add New Configuration
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Configuration Name"
                  value={newConfiguration.name}
                  onChange={(e) => updateConfiguration(0, 'name', e.target.value)}
                  placeholder="e.g., Premium 2BHK"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'var(--color-text-primary)',
                      '& fieldset': { borderColor: 'var(--color-border)' },
                      '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                    },
                    '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'var(--color-text-muted)' }}>Unit Type</InputLabel>
                  <Select
                    value={newConfiguration.type}
                    onChange={(e) => updateConfiguration(0, 'type', e.target.value)}
                    sx={{
                      color: 'var(--color-text-primary)',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-border)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-primary)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-primary)' },
                    }}
                  >
                    <MenuItem value="1BHK">1BHK</MenuItem>
                    <MenuItem value="2BHK">2BHK</MenuItem>
                    <MenuItem value="3BHK">3BHK</MenuItem>
                    <MenuItem value="4BHK">4BHK</MenuItem>
                    <MenuItem value="5BHK">5BHK</MenuItem>
                    <MenuItem value="Studio">Studio</MenuItem>
                    <MenuItem value="Penthouse">Penthouse</MenuItem>
                    <MenuItem value="Villa">Villa</MenuItem>
                    <MenuItem value="Duplex">Duplex</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  label="Bedrooms"
                  type="number"
                  value={newConfiguration.bedrooms}
                  onChange={(e) => updateConfiguration(0, 'bedrooms', parseInt(e.target.value) || 0)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'var(--color-text-primary)',
                      '& fieldset': { borderColor: 'var(--color-border)' },
                      '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                    },
                    '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                  }}
                />
              </Grid>
              
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  label="Bathrooms"
                  type="number"
                  value={newConfiguration.bathrooms}
                  onChange={(e) => updateConfiguration(0, 'bathrooms', parseInt(e.target.value) || 0)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'var(--color-text-primary)',
                      '& fieldset': { borderColor: 'var(--color-border)' },
                      '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                    },
                    '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Area (Sq Ft)"
                  type="number"
                  value={newConfiguration.area}
                  onChange={(e) => updateConfiguration(0, 'area', e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'var(--color-text-primary)',
                      '& fieldset': { borderColor: 'var(--color-border)' },
                      '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                    },
                    '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Price (₹)"
                  type="number"
                  value={newConfiguration.price}
                  onChange={(e) => updateConfiguration(0, 'price', e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'var(--color-text-primary)',
                      '& fieldset': { borderColor: 'var(--color-border)' },
                      '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                    },
                    '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Price per Sq Ft (₹)"
                  type="number"
                  value={newConfiguration.pricePerSqFt}
                  onChange={(e) => updateConfiguration(0, 'pricePerSqFt', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'var(--color-text-primary)',
                      '& fieldset': { borderColor: 'var(--color-border)' },
                      '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                    },
                    '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Units Available"
                  type="number"
                  value={newConfiguration.unitsAvailable}
                  onChange={(e) => updateConfiguration(0, 'unitsAvailable', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'var(--color-text-primary)',
                      '& fieldset': { borderColor: 'var(--color-border)' },
                      '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                    },
                    '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newConfiguration.isAvailable}
                      onChange={(e) => updateConfiguration(0, 'isAvailable', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: 'var(--color-primary)',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'var(--color-primary)',
                        },
                      }}
                    />
                  }
                  label="Available for Sale"
                  sx={{ color: 'var(--color-text-primary)' }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description (Optional)"
                  multiline
                  rows={2}
                  value={newConfiguration.description}
                  onChange={(e) => updateConfiguration(0, 'description', e.target.value)}
                  placeholder="Brief description of this configuration..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'var(--color-text-primary)',
                      '& fieldset': { borderColor: 'var(--color-border)' },
                      '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                    },
                    '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={addConfiguration}
                  startIcon={<Add />}
                  sx={{
                    backgroundColor: 'var(--color-primary)',
                    '&:hover': {
                      backgroundColor: 'var(--color-primary-hover)',
                    }
                  }}
                >
                  Add Configuration
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Display Added Configurations */}
          {formData.configurations.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                Added Configurations ({formData.configurations.length})
              </Typography>
              
              {formData.configurations.map((config, index) => (
                <Card key={index} sx={{ mb: 2, border: '1px solid var(--color-border)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ color: 'var(--color-primary)', mb: 1 }}>
                          {config.name}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                              Type
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'var(--color-text-primary)' }}>
                              {config.type}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                              Bedrooms
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'var(--color-text-primary)' }}>
                              {config.bedrooms}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                              Bathrooms
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'var(--color-text-primary)' }}>
                              {config.bathrooms}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                              Area
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'var(--color-text-primary)' }}>
                              {config.area} sq ft
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                              Price
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                              ₹{config.price.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                              Price/Sq Ft
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'var(--color-text-primary)' }}>
                              {config.pricePerSqFt ? `₹${config.pricePerSqFt}` : 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                              Available
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'var(--color-text-primary)' }}>
                              {config.isAvailable ? 'Yes' : 'No'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                              Units
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'var(--color-text-primary)' }}>
                              {config.unitsAvailable || 'N/A'}
                            </Typography>
                          </Grid>
                        </Grid>
                        {config.description && (
                          <Typography variant="body2" sx={{ mt: 1, color: 'var(--color-text-muted)' }}>
                            {config.description}
                          </Typography>
                        )}
                      </Box>
                      <IconButton
                        onClick={() => removeConfiguration(index)}
                        sx={{ color: 'var(--color-error)' }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </StyledPaper>

        {/* File Upload Section */}
        <StyledPaper>
          <SectionHeader variant="h5">
            <CloudUpload />
            Media & Documents
          </SectionHeader>
          
          <Grid container spacing={3}>
            {/* Images Upload */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                <Image sx={{ mr: 1, verticalAlign: 'middle' }} />
                Project Images (Max 10)
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="images-upload"
                multiple
                type="file"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files, 'images')}
              />
              <label htmlFor="images-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  sx={{
                    borderColor: 'var(--color-primary)',
                    color: 'var(--color-primary)',
                    '&:hover': {
                      borderColor: 'var(--color-primary)',
                      bgcolor: 'var(--color-primary)',
                      color: 'var(--color-primary-contrast)'
                    }
                  }}
                >
                  Upload Images
                </Button>
              </label>
              
              {selectedImages.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {selectedImages.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => removeFile(index, 'images')}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              )}
            </Grid>

            {/* Floor Plans Upload */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                <Image sx={{ mr: 1, verticalAlign: 'middle' }} />
                Floor Plans (Max 5)
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="floorplans-upload"
                multiple
                type="file"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files, 'floorPlans')}
              />
              <label htmlFor="floorplans-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  sx={{
                    borderColor: 'var(--color-primary)',
                    color: 'var(--color-primary)',
                    '&:hover': {
                      borderColor: 'var(--color-primary)',
                      bgcolor: 'var(--color-primary)',
                      color: 'var(--color-primary-contrast)'
                    }
                  }}
                >
                  Upload Floor Plans
                </Button>
              </label>
              
              {selectedFloorPlans.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {selectedFloorPlans.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => removeFile(index, 'floorPlans')}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              )}
            </Grid>

            {/* Brochures Upload */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                <PictureAsPdf sx={{ mr: 1, verticalAlign: 'middle' }} />
                Brochures (Max 3)
              </Typography>
              <input
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                id="brochures-upload"
                multiple
                type="file"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files, 'brochures')}
              />
              <label htmlFor="brochures-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  sx={{
                    borderColor: 'var(--color-primary)',
                    color: 'var(--color-primary)',
                    '&:hover': {
                      borderColor: 'var(--color-primary)',
                      bgcolor: 'var(--color-primary)',
                      color: 'var(--color-primary-contrast)'
                    }
                  }}
                >
                  Upload Brochures
                </Button>
              </label>
              
              {selectedBrochures.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {selectedBrochures.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => removeFile(index, 'brochures')}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              )}
            </Grid>

            {/* Virtual Tours Upload */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                <VideoLibrary sx={{ mr: 1, verticalAlign: 'middle' }} />
                Virtual Tours (Max 2)
              </Typography>
              <input
                accept="video/*"
                style={{ display: 'none' }}
                id="virtualtours-upload"
                multiple
                type="file"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files, 'virtualTours')}
              />
              <label htmlFor="virtualtours-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  sx={{
                    borderColor: 'var(--color-primary)',
                    color: 'var(--color-primary)',
                    '&:hover': {
                      borderColor: 'var(--color-primary)',
                      bgcolor: 'var(--color-primary)',
                      color: 'var(--color-primary-contrast)'
                    }
                  }}
                >
                  Upload Virtual Tours
                </Button>
              </label>
              
              {selectedVirtualTours.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {selectedVirtualTours.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => removeFile(index, 'virtualTours')}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </StyledPaper>

        {/* Geocoding Section */}
        <StyledPaper>
          <SectionHeader variant="h5">
            <Map />
            Location Geocoding
          </SectionHeader>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Enter the complete address above to automatically get coordinates for better location services.
              </Alert>
              {isGeocoding && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">Geocoding address...</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </StyledPaper>

        {/* Upload Progress */}
        {uploadProgress > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Uploading files... {uploadProgress}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/projects')}
            sx={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              '&:hover': {
                borderColor: 'var(--color-primary)',
                bgcolor: 'var(--color-primary)',
                color: 'var(--color-primary-contrast)'
              }
            }}
          >
            Cancel
          </Button>
          
          <ActionButton
            type="submit"
            startIcon={<Save />}
            disabled={saving}
          >
            {saving ? <CircularProgress size={20} /> : 'Create Project'}
          </ActionButton>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddProjectClient;
