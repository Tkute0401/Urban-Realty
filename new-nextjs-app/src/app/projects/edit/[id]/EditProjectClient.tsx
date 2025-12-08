'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/contexts/ProjectsContext';
import { useDevelopers } from '@/contexts/DevelopersContext';
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
  CardContent,
  LinearProgress,
  Switch,
  FormControlLabel,
  Autocomplete
} from '@mui/material';
import {
  Add,
  Delete,
  Save,
  Cancel,
  Business,
  LocationOn,
  CurrencyRupee,
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
import FieldIndicator from '@/components/ui/FieldIndicator';

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

interface EditProjectClientProps {
  projectId: string;
}

const EditProjectClient: React.FC<EditProjectClientProps> = ({ projectId }) => {
  const { user, loading: authLoading } = useAuth();
  const { getProject, updateProject, loading, error } = useProjects();
  const { developers, getDevelopers, loading: developersLoading } = useDevelopers();
  const router = useRouter();
  
  const [saving, setSaving] = useState(false);
  const [loadingProject, setLoadingProject] = useState(true);
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
    pricePerSqFt: '',
    startingPrice: '',
    amenities: [] as Array<{ name: string; description: string }>,
    features: [] as Array<{ name: string; description: string }>,
    keywords: [] as string[],
    configurations: [] as Array<{
      name: string;
      type: string;
      bedrooms: number;
      bathrooms: number;
      area: number;
      price: number;
      pricePerSqFt?: number;
      description?: string;
      isAvailable: boolean;
      unitsAvailable?: number;
    }>,
    developers: [] as string[]
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
  const [selectedVirtualTours, setSelectedVirtualTours] = useState<File[]>([]);
  const [brochureUrls, setBrochureUrls] = useState<Array<{ url: string; name?: string }>>([]);
  const [newBrochureUrl, setNewBrochureUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Existing media states
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [existingFloorPlans, setExistingFloorPlans] = useState<any[]>([]);
  const [existingBrochures, setExistingBrochures] = useState<any[]>([]);
  const [existingVirtualTours, setExistingVirtualTours] = useState<any[]>([]);

  useEffect(() => {
    // Allow both admin and developer roles to access this page
    if (user && (user.role === 'admin' || user.role === 'developer')) {
      // Fetch developers list for multi-select
      getDevelopers();
    } else if (user) {
      // User is logged in but doesn't have the right role
      router.push('/');
    }
  }, [user, router, getDevelopers]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoadingProject(true);
        const projectData = await getProject(projectId);
        
        if (projectData) {
          // Populate form with existing project data
          setFormData({
            name: projectData.name || '',
            description: projectData.description || '',
            shortDescription: projectData.shortDescription || '',
            type: projectData.type || 'Residential',
            status: projectData.status || 'Planning',
            totalUnits: projectData.totalUnits?.toString() || '',
            totalArea: projectData.totalArea?.toString() || '',
            location: {
              address: projectData.location?.address || '',
              city: projectData.location?.city || '',
              state: projectData.location?.state || '',
              pincode: projectData.location?.pincode || '',
              country: projectData.location?.country || 'India'
            },
            pricePerSqFt: projectData.pricePerSqFt?.toString() || '',
            startingPrice: projectData.startingPrice?.toString() || '',
            amenities: (projectData.amenities || []).map((item: any) => ({
              name: item.name || '',
              description: item.description || ''
            })),
            features: (projectData.features || []).map((item: any) => ({
              name: item.name || '',
              description: item.description || ''
            })),
            keywords: projectData.keywords || [],
            configurations: projectData.configurations || [],
            developers: (projectData.developers || []).map((dev: any) => 
              typeof dev === 'string' ? dev : dev._id || dev
            )
          });

          // Set existing media
          setExistingImages(projectData.images || []);
          setExistingFloorPlans(projectData.floorPlans || []);
          setExistingBrochures(projectData.brochures || []);
          setExistingVirtualTours(projectData.virtualTours || []);
          
          // Set brochure URLs from existing brochures
          const existingBrochureUrls = (projectData.brochures || []).map((b: any) => ({
            url: b.url || '',
            name: b.name || 'Brochure'
          }));
          setBrochureUrls(existingBrochureUrls);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setSnackbar({
          open: true,
          message: 'Failed to load project details',
          severity: 'error'
        });
      } finally {
        setLoadingProject(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, getProject]);

  const handleInputChange = (field: string, value: any) => {
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

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, { name: newAmenity.trim(), description: '' }]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
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

  const removeFeature = (index: number) => {
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

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const addConfiguration = () => {
    if (newConfiguration.name.trim() && newConfiguration.area && newConfiguration.price) {
      const config = {
        name: newConfiguration.name.trim(),
        type: newConfiguration.type,
        bedrooms: newConfiguration.bedrooms || 0,
        bathrooms: newConfiguration.bathrooms || 0,
        area: parseFloat(newConfiguration.area),
        price: parseFloat(newConfiguration.price),
        pricePerSqFt: newConfiguration.pricePerSqFt ? parseFloat(newConfiguration.pricePerSqFt) : undefined,
        description: newConfiguration.description || undefined,
        isAvailable: newConfiguration.isAvailable,
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

  const removeConfiguration = (index: number) => {
    setFormData(prev => ({
      ...prev,
      configurations: prev.configurations.filter((_, i) => i !== index)
    }));
  };

  const updateConfiguration = (index: number, field: string, value: any) => {
    setNewConfiguration(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearConfigurationForm = () => {
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
        // Brochures are now URL-only, no file upload
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
        // Brochures are now URL-only, no file removal needed
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    // Check if there are any incomplete configurations in the form
    if (newConfiguration.name.trim() || newConfiguration.area || newConfiguration.price) {
      setSnackbar({
        open: true,
        message: 'Please complete or clear the configuration form before submitting',
        severity: 'error'
      });
      return;
    }

    try {
      setSaving(true);
      setUploadProgress(10);

      // Create FormData
      const formDataToSend = new FormData();
      
      // Append all form data (matching create form structure)
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'object' && formData[key] !== null) {
          if (Array.isArray(formData[key])) {
            formData[key].forEach((item, index) => {
              if (typeof item === 'object') {
                Object.keys(item).forEach(subKey => {
                  if (typeof item[subKey] !== 'undefined' && item[subKey] !== null) {
                    formDataToSend.append(`${key}[${index}][${subKey}]`, String(item[subKey]));
                  }
                });
              } else {
                formDataToSend.append(`${key}[${index}]`, item);
              }
            });
          } else {
            Object.keys(formData[key]).forEach(subKey => {
              if (typeof formData[key][subKey] !== 'undefined' && formData[key][subKey] !== null) {
                formDataToSend.append(`${key}[${subKey}]`, String(formData[key][subKey]));
              }
            });
          }
        } else {
          if (typeof formData[key] !== 'undefined' && formData[key] !== null) {
            formDataToSend.append(key, String(formData[key]));
          }
        }
      });

      // Add new files
      selectedImages.forEach((file, index) => {
        formDataToSend.append('images', file);
      });
      
      selectedFloorPlans.forEach((file, index) => {
        formDataToSend.append('floorPlans', file);
      });
      
      // Add brochure URLs if provided
      if (brochureUrls.length > 0) {
        formDataToSend.append('brochures', JSON.stringify(brochureUrls.map(b => ({
          url: b.url,
          name: b.name || 'Brochure'
        }))));
      }
      
      selectedVirtualTours.forEach((file, index) => {
        formDataToSend.append('virtualTours', file);
      });

      // Add existing media (to keep them)
      existingImages.forEach((image, index) => {
        formDataToSend.append('existingImages', JSON.stringify(image));
      });
      
      existingFloorPlans.forEach((fp, index) => {
        formDataToSend.append('existingFloorPlans', JSON.stringify(fp));
      });
      
      existingBrochures.forEach((brochure, index) => {
        formDataToSend.append('existingBrochures', JSON.stringify(brochure));
      });
      
      existingVirtualTours.forEach((vt, index) => {
        formDataToSend.append('existingVirtualTours', JSON.stringify(vt));
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
      await updateProject(projectId, formDataToSend);
      setUploadProgress(100);
      
      setSnackbar({
        open: true,
        message: 'Project updated successfully!',
        severity: 'success'
      });
      setTimeout(() => router.push(`/projects/${projectId}`), 1500);
    } catch (err: any) {
      const { extractErrorMessage } = await import('@/lib/utils/extractErrorMessage');
      const errorMessage = extractErrorMessage(err, 'Failed to update project');
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Allow both admin and developer roles
  if (user && user.role !== 'admin' && user.role !== 'developer') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. This page is only available for admin and developer users.
        </Alert>
      </Container>
    );
  }

  if (loadingProject) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'var(--color-primary)', mb: 1 }}>
          Edit Project
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
          Update your project details and configurations
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
              <FieldIndicator required helperText="Enter a unique project name" />
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
              <FieldIndicator optional helperText="Select the type of development" />
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'var(--color-text-muted)' }}>Project Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
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
              <FieldIndicator optional helperText="Current status of the project" />
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
              <FieldIndicator optional helperText="Select one or more developers for this project. Your developer profile will be automatically included." />
              <Autocomplete
                multiple
                options={developers || []}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.name || ''}
                value={formData.developers.map(id => developers.find(d => d._id === id)).filter(Boolean)}
                onChange={(_, newValue) => {
                  const developerIds = newValue.map(dev => typeof dev === 'string' ? dev : dev._id);
                  handleInputChange('developers', developerIds);
                }}
                loading={developersLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Developers"
                    placeholder="Select developers..."
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
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={typeof option === 'string' ? option : option._id}>
                    {typeof option === 'string' ? option : option.name}
                  </Box>
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FieldIndicator required helperText="Detailed description of the project" />
              <TextField
                fullWidth
                label="Project Description"
                multiline
                rows={4}
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
              <FieldIndicator optional helperText="Brief summary for project cards (500 characters max)" />
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Short Description (for cards)"
                value={formData.shortDescription}
                onChange={(e) => {
                  const value = e.target.value;
                  // Limit to 500 characters
                  if (value.length <= 500) {
                    handleInputChange('shortDescription', value);
                  }
                }}
                inputProps={{ maxLength: 500 }}
                helperText={`${formData.shortDescription.length}/500 characters`}
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
              <FieldIndicator optional helperText="Complete project address for better visibility" />
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
              <FieldIndicator optional helperText="City where project is located" />
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
              <FieldIndicator optional helperText="State or province" />
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
              <FieldIndicator optional helperText="Postal/ZIP code" />
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
            <CurrencyRupee />
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
                  placeholder="Enter area in sq ft"
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
                  placeholder="Enter price in ₹"
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
                 <Box sx={{ display: 'flex', gap: 2 }}>
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
                   <Button
                     variant="outlined"
                     onClick={clearConfigurationForm}
                     sx={{
                       borderColor: 'var(--color-border)',
                       color: 'var(--color-text-primary)',
                       '&:hover': {
                         borderColor: 'var(--color-text-muted)',
                         backgroundColor: 'var(--color-surface)'
                       }
                     }}
                   >
                     Clear Form
                   </Button>
                 </Box>
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

            {/* Brochures URL Input */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                <PictureAsPdf sx={{ mr: 1, verticalAlign: 'middle' }} />
                Brochures (Max 3) - URL Only
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, color: 'var(--color-text-secondary)' }}>
                  Enter brochure URL (Google Drive, Dropbox, AWS S3, etc.)
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="https://example.com/brochure.pdf"
                    value={newBrochureUrl}
                    onChange={(e) => setNewBrochureUrl(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'var(--color-text-primary)',
                        '& fieldset': {
                          borderColor: 'var(--color-border)',
                        },
                      },
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (newBrochureUrl.trim() && brochureUrls.length < 3) {
                        setBrochureUrls([...brochureUrls, { url: newBrochureUrl.trim() }]);
                        setNewBrochureUrl('');
                      }
                    }}
                    disabled={!newBrochureUrl.trim() || brochureUrls.length >= 3}
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
                    Add URL
                  </Button>
                </Box>
              </Box>
              
              {/* Display URLs */}
              {brochureUrls.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {brochureUrls.map((brochure, index) => (
                    <Chip
                      key={`url-${index}`}
                      label={brochure.url.substring(0, 40) + (brochure.url.length > 40 ? '...' : '')}
                      onDelete={() => setBrochureUrls(brochureUrls.filter((_, i) => i !== index))}
                      color="primary"
                      variant="outlined"
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
            {saving ? <CircularProgress size={20} /> : 'Update Project'}
          </ActionButton>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
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

export default EditProjectClient;
