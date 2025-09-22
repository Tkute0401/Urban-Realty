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
  const { addProperty, loading } = useProperties();
  const { agents } = useAgents();
  const { developers } = useDevelopers();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: '',
    status: 'available',
    beds: '',
    baths: '',
    sqft: '',
    yearBuilt: '',
    amenities: [] as string[],
    images: [] as string[],
    agent: '',
    developer: '',
    latitude: '',
    longitude: ''
  });

  // Prefill when editing
  useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({
        ...prev,
        title: initialValues.title ?? prev.title,
        description: initialValues.description ?? prev.description,
        price: initialValues.price?.toString?.() ?? prev.price,
        location: initialValues.location ?? initialValues.address?.locality ?? prev.location,
        propertyType: initialValues.propertyType ?? initialValues.type ?? prev.propertyType,
        status: typeof initialValues.status === 'string' ? initialValues.status : prev.status,
        beds: (initialValues.beds ?? initialValues.bedrooms ?? prev.beds)?.toString?.() ?? prev.beds,
        baths: (initialValues.baths ?? initialValues.bathrooms ?? prev.baths)?.toString?.() ?? prev.baths,
        sqft: (initialValues.sqft ?? initialValues.area ?? prev.sqft)?.toString?.() ?? prev.sqft,
        yearBuilt: initialValues.yearBuilt?.toString?.() ?? prev.yearBuilt,
        amenities: Array.isArray(initialValues.amenities) ? initialValues.amenities : prev.amenities,
        agent: initialValues.agent?._id ?? initialValues.agent ?? prev.agent,
        developer: initialValues.developer?._id ?? initialValues.developer ?? prev.developer,
        latitude: (initialValues.location?.coordinates?.[1] ?? initialValues.latitude ?? prev.latitude)?.toString?.() ?? prev.latitude,
        longitude: (initialValues.location?.coordinates?.[0] ?? initialValues.longitude ?? prev.longitude)?.toString?.() ?? prev.longitude,
      }));
    }
  }, [initialValues]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'warning' | 'info' }>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: <Apartment /> },
    { value: 'house', label: 'House', icon: <Home /> },
    { value: 'villa', label: 'Villa', icon: <Villa /> },
    { value: 'cottage', label: 'Cottage', icon: <Cottage /> },
    { value: 'commercial', label: 'Commercial', icon: <Factory /> },
    { value: 'land', label: 'Land', icon: <Landscape /> }
  ];

  const amenityOptions = [
    { value: 'parking', label: 'Parking', icon: <LocalParking /> },
    { value: 'pool', label: 'Pool', icon: <Pool /> },
    { value: 'gym', label: 'Gym', icon: <FitnessCenter /> },
    { value: 'security', label: 'Security', icon: <Security /> },
    { value: 'spa', label: 'Spa', icon: <Spa /> },
    { value: 'balcony', label: 'Balcony', icon: <Balcony /> },
    { value: 'wifi', label: 'WiFi', icon: <Wifi /> },
    { value: 'ac', label: 'Air Conditioning', icon: <AcUnit /> },
    { value: 'furnished', label: 'Furnished', icon: <Chair /> },
    { value: 'pets', label: 'Pet Friendly', icon: <Pets /> },
    { value: 'elevator', label: 'Elevator', icon: <Elevator /> },
    { value: 'laundry', label: 'Laundry', icon: <LocalLaundryService /> },
    { value: 'storage', label: 'Storage', icon: <Storage /> },
    { value: 'meeting', label: 'Meeting Room', icon: <MeetingRoom /> },
    { value: 'kitchen', label: 'Kitchen', icon: <Kitchen /> }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

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
    const files = Array.from(event.target.files || []);
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
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
    if (!formData.beds) newErrors.beds = 'Number of beds is required';
    if (!formData.baths) newErrors.baths = 'Number of baths is required';
    if (!formData.sqft) newErrors.sqft = 'Square footage is required';
    
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
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        beds: parseInt(formData.beds),
        baths: parseInt(formData.baths),
        sqft: parseInt(formData.sqft),
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };

      if (__editMode && onSubmitEdit) {
        await onSubmitEdit(propertyData);
        setSnackbar({ open: true, message: 'Property updated successfully!', severity: 'success' });
      } else {
        await addProperty(propertyData, imageFiles);
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
          Add New Property
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
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
                    '& fieldset': { borderColor: '#78CADC' },
                    '&:hover fieldset': { borderColor: '#78CADC' },
                    '&.Mui-focused fieldset': { borderColor: '#78CADC' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#78CADC' },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Property Type"
                value={formData.propertyType}
                onChange={(e) => handleChange('propertyType', e.target.value)}
                error={!!errors.propertyType}
                helperText={errors.propertyType}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '& fieldset': { borderColor: '#78CADC' },
                    '&:hover fieldset': { borderColor: '#78CADC' },
                    '&.Mui-focused fieldset': { borderColor: '#78CADC' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#78CADC' },
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
                    '& fieldset': { borderColor: '#78CADC' },
                    '&:hover fieldset': { borderColor: '#78CADC' },
                    '&.Mui-focused fieldset': { borderColor: '#78CADC' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#78CADC' },
                }}
              />
            </Grid>

            {/* Property Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#78CADC', mb: 2, mt: 2 }}>
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
                    '& fieldset': { borderColor: '#78CADC' },
                    '&:hover fieldset': { borderColor: '#78CADC' },
                    '&.Mui-focused fieldset': { borderColor: '#78CADC' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#78CADC' },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                error={!!errors.location}
                helperText={errors.location}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '& fieldset': { borderColor: '#78CADC' },
                    '&:hover fieldset': { borderColor: '#78CADC' },
                    '&.Mui-focused fieldset': { borderColor: '#78CADC' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#78CADC' },
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
                    '& fieldset': { borderColor: '#78CADC' },
                    '&:hover fieldset': { borderColor: '#78CADC' },
                    '&.Mui-focused fieldset': { borderColor: '#78CADC' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#78CADC' },
                }}
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
                <MenuItem value="rented">Rented</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Bedrooms"
                type="number"
                value={formData.beds}
                onChange={(e) => handleChange('beds', e.target.value)}
                error={!!errors.beds}
                helperText={errors.beds}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '& fieldset': { borderColor: '#78CADC' },
                    '&:hover fieldset': { borderColor: '#78CADC' },
                    '&.Mui-focused fieldset': { borderColor: '#78CADC' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#78CADC' },
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Bathrooms"
                type="number"
                value={formData.baths}
                onChange={(e) => handleChange('baths', e.target.value)}
                error={!!errors.baths}
                helperText={errors.baths}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '& fieldset': { borderColor: '#78CADC' },
                    '&:hover fieldset': { borderColor: '#78CADC' },
                    '&.Mui-focused fieldset': { borderColor: '#78CADC' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#78CADC' },
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Square Feet"
                type="number"
                value={formData.sqft}
                onChange={(e) => handleChange('sqft', e.target.value)}
                error={!!errors.sqft}
                helperText={errors.sqft}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '& fieldset': { borderColor: '#78CADC' },
                    '&:hover fieldset': { borderColor: '#78CADC' },
                    '&.Mui-focused fieldset': { borderColor: '#78CADC' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#78CADC' },
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Year Built"
                type="number"
                value={formData.yearBuilt}
                onChange={(e) => handleChange('yearBuilt', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    '& fieldset': { borderColor: '#78CADC' },
                    '&:hover fieldset': { borderColor: '#78CADC' },
                    '&.Mui-focused fieldset': { borderColor: '#78CADC' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#78CADC' },
                }}
              />
            </Grid>

            {/* Amenities */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#78CADC', mb: 2, mt: 2 }}>
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
                        bgcolor: formData.amenities.includes(amenity.value) ? '#6bb6c7' : '#2a2a2a',
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#78CADC', mb: 2, mt: 2 }}>
                Property Images
              </Typography>
              <Box
                sx={{
                  border: '2px dashed #78CADC',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#6bb6c7' }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUpload sx={{ fontSize: 48, color: '#78CADC', mb: 2 }} />
                <Typography variant="body1" sx={{ color: '#78CADC', mb: 1 }}>
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