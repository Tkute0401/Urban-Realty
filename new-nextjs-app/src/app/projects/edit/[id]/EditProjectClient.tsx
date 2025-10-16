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
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
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
  Apartment,
  Edit,
  ArrowBack,
  DeleteForever
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text-primary)',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  border: '1px solid var(--color-border)',
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
  '&:hover': {
    backgroundColor: 'var(--color-primary-hover)',
  },
}));

interface EditProjectClientProps {
  projectId: string;
}

const EditProjectClient: React.FC<EditProjectClientProps> = ({ projectId }) => {
  const { user } = useAuth();
  const { getProject, updateProject, loading, error } = useProjects();
  const router = useRouter();
  
  const [saving, setSaving] = useState(false);
  const [loadingProject, setLoadingProject] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'warning' | 'info' }>({ open: false, message: '', severity: 'success' });
  const [deleteImageDialog, setDeleteImageDialog] = useState<{ open: boolean; imageIndex: number | null }>({ open: false, imageIndex: null });
  
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
    constructionStartDate: '',
    estimatedCompletionDate: '',
    pricePerSqFt: '',
    startingPrice: '',
    priceRange: {
      min: '',
      max: ''
    },
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
      floorPlan?: {
        url: string;
        publicId: string;
        caption?: string;
      };
      description?: string;
      isAvailable: boolean;
      unitsAvailable?: number;
    }>,
    reraNumber: '',
    metaDescription: '',
    isActive: true,
    isFeatured: false,
    isPublished: false
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

  // Existing media states
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [existingFloorPlans, setExistingFloorPlans] = useState<any[]>([]);
  const [existingBrochures, setExistingBrochures] = useState<any[]>([]);
  const [existingVirtualTours, setExistingVirtualTours] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role !== 'developer') {
      router.push('/');
    }
  }, [user, router]);

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
            launchDate: projectData.launchDate ? new Date(projectData.launchDate).toISOString().split('T')[0] : '',
            possessionDate: projectData.possessionDate ? new Date(projectData.possessionDate).toISOString().split('T')[0] : '',
            constructionStartDate: projectData.constructionStartDate ? new Date(projectData.constructionStartDate).toISOString().split('T')[0] : '',
            estimatedCompletionDate: projectData.estimatedCompletionDate ? new Date(projectData.estimatedCompletionDate).toISOString().split('T')[0] : '',
            pricePerSqFt: projectData.pricePerSqFt?.toString() || '',
            startingPrice: projectData.startingPrice?.toString() || '',
            priceRange: {
              min: projectData.priceRange?.min?.toString() || '',
              max: projectData.priceRange?.max?.toString() || ''
            },
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
            reraNumber: projectData.reraNumber || '',
            metaDescription: projectData.metaDescription || '',
            isActive: projectData.isActive !== undefined ? projectData.isActive : true,
            isFeatured: projectData.isFeatured || false,
            isPublished: projectData.isPublished || false
          });

          // Set existing media
          setExistingImages(projectData.images || []);
          setExistingFloorPlans(projectData.floorPlans || []);
          setExistingBrochures(projectData.brochures || []);
          setExistingVirtualTours(projectData.virtualTours || []);
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

  const editConfiguration = (index: number) => {
    const config = formData.configurations[index];
    setNewConfiguration({
      name: config.name,
      type: config.type,
      bedrooms: config.bedrooms,
      bathrooms: config.bathrooms,
      area: config.area.toString(),
      price: config.price.toString(),
      pricePerSqFt: config.pricePerSqFt?.toString() || '',
      description: config.description || '',
      isAvailable: config.isAvailable,
      unitsAvailable: config.unitsAvailable?.toString() || ''
    });
    removeConfiguration(index);
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
        setSelectedImages(prev => [...prev, ...fileArray].slice(0, 10));
        break;
      case 'floorPlans':
        setSelectedFloorPlans(prev => [...prev, ...fileArray]);
        break;
      case 'brochures':
        setSelectedBrochures(prev => [...prev, ...fileArray]);
        break;
      case 'virtualTours':
        setSelectedVirtualTours(prev => [...prev, ...fileArray]);
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

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingFloorPlan = (index: number) => {
    setExistingFloorPlans(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingBrochure = (index: number) => {
    setExistingBrochures(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingVirtualTour = (index: number) => {
    setExistingVirtualTours(prev => prev.filter((_, i) => i !== index));
  };

  // Geocoding function using OpenStreetMap
  const geocodeAddress = async (address: string) => {
    if (!address.trim()) return null;
    
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=in`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const loc = data[0];
        return {
          type: 'Point',
          coordinates: [parseFloat(loc.lon), parseFloat(loc.lat)]
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    } finally {
      setIsGeocoding(false);
    }
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
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'location') {
          Object.entries(value).forEach(([locKey, locValue]) => {
            formDataToSend.append(`location[${locKey}]`, locValue);
          });
        } else if (key === 'priceRange') {
          Object.entries(value).forEach(([rangeKey, rangeValue]) => {
            formDataToSend.append(`priceRange[${rangeKey}]`, rangeValue);
          });
        } else if (Array.isArray(value)) {
          if (key === 'amenities' || key === 'features') {
            value.forEach((item, index) => {
              formDataToSend.append(`${key}[${index}][name]`, item.name);
              formDataToSend.append(`${key}[${index}][description]`, item.description || '');
            });
          } else if (key === 'configurations') {
            value.forEach((config, index) => {
              Object.entries(config).forEach(([configKey, configValue]) => {
                if (configKey === 'floorPlan' && configValue) {
                  Object.entries(configValue).forEach(([fpKey, fpValue]) => {
                    formDataToSend.append(`${key}[${index}][floorPlan][${fpKey}]`, fpValue);
                  });
                } else if (configValue !== undefined && configValue !== null) {
                  formDataToSend.append(`${key}[${index}][${configKey}]`, configValue.toString());
                }
              });
            });
          } else {
            value.forEach((item, index) => {
              formDataToSend.append(`${key}[${index}]`, item);
            });
          }
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      // Add new files
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
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update project',
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ color: 'var(--color-primary)', mb: 1 }}>
            Edit Project
          </Typography>
        </Box>
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
              <TextField
                fullWidth
                label="Short Description"
                multiline
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder="Brief description for project cards..."
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
                label="Address"
                value={formData.location.address}
                onChange={(e) => handleInputChange('location.address', e.target.value)}
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
                label="City"
                value={formData.location.city}
                onChange={(e) => handleInputChange('location.city', e.target.value)}
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
                label="State"
                value={formData.location.state}
                onChange={(e) => handleInputChange('location.state', e.target.value)}
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
                label="Pincode"
                value={formData.location.pincode}
                onChange={(e) => handleInputChange('location.pincode', e.target.value)}
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
                Current Configurations ({formData.configurations.length})
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
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => editConfiguration(index)}
                          sx={{ color: 'var(--color-primary)' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => removeConfiguration(index)}
                          sx={{ color: 'var(--color-error)' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
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
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--color-text-primary)' }}>
                    Current Images:
                  </Typography>
                  <Grid container spacing={1}>
                    {existingImages.map((image: any, index: number) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Card sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="80"
                            image={image.url || image}
                            alt={`Image ${index + 1}`}
                            sx={{ objectFit: 'cover' }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeExistingImage(index)}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.7)',
                              }
                            }}
                          >
                            <DeleteForever fontSize="small" />
                          </IconButton>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              
              {/* New Images */}
              {selectedImages.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--color-text-primary)' }}>
                    New Images:
                  </Typography>
                  <Grid container spacing={1}>
                    {selectedImages.map((file, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Card sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="80"
                            image={URL.createObjectURL(file)}
                            alt={`New Image ${index + 1}`}
                            sx={{ objectFit: 'cover' }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeFile(index, 'images')}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.7)',
                              }
                            }}
                          >
                            <DeleteForever fontSize="small" />
                          </IconButton>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Grid>

            {/* Floor Plans Upload */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                <PictureAsPdf sx={{ mr: 1, verticalAlign: 'middle' }} />
                Floor Plans
              </Typography>
              <input
                accept="image/*,.pdf"
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
              
              {/* Existing Floor Plans */}
              {existingFloorPlans.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--color-text-primary)' }}>
                    Current Floor Plans:
                  </Typography>
                  <List dense>
                    {existingFloorPlans.map((fp: any, index: number) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText
                          primary={fp.caption || `Floor Plan ${index + 1}`}
                          secondary={fp.unitType || 'General'}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            onClick={() => removeExistingFloorPlan(index)}
                            sx={{ color: 'var(--color-error)' }}
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              {/* New Floor Plans */}
              {selectedFloorPlans.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--color-text-primary)' }}>
                    New Floor Plans:
                  </Typography>
                  <List dense>
                    {selectedFloorPlans.map((file, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            onClick={() => removeFile(index, 'floorPlans')}
                            sx={{ color: 'var(--color-error)' }}
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Grid>
          </Grid>
        </StyledPaper>

        {/* Submit Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => router.back()}
            startIcon={<Cancel />}
            sx={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
              '&:hover': {
                borderColor: 'var(--color-text-muted)',
                backgroundColor: 'var(--color-surface)'
              }
            }}
          >
            Cancel
          </Button>
          <ActionButton
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={saving || loading}
            sx={{ minWidth: 120 }}
          >
            {saving ? 'Saving...' : 'Update Project'}
          </ActionButton>
        </Box>

        {/* Upload Progress */}
        {uploadProgress > 0 && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'var(--color-text-muted)' }}>
              {uploadProgress < 100 ? 'Uploading...' : 'Complete!'}
            </Typography>
          </Box>
        )}
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
