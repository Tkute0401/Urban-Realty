import { useState, useRef, useEffect } from 'react';
import { useProperties } from '../../context/PropertiesContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAgents } from '../../context/AgentsContext';
import { 
  Box, TextField, Button, Grid, MenuItem, Chip, Typography, Paper,
  CircularProgress, Alert, FormControlLabel, Checkbox, Container,
  FormHelperText, InputAdornment, IconButton, Autocomplete, Avatar,
  FormLabel
} from '@mui/material';
import { CloudUpload, Delete, Star } from '@mui/icons-material';
import { useMediaQuery, useTheme } from '@mui/material';

const AddPropertyPage = () => {
  const { createProperty, loading, error, clearErrors } = useProperties();
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
    address: {
      line1: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    amenities: [],
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const propertyTypes = ['House', 'Apartment', 'Villa', 'Condo', 'Townhouse', 'Land', 'Commercial'];
  const propertyStatuses = ['For Sale', 'For Rent'];
  const amenitiesList = [
    'Parking', 'Swimming Pool', 'Gym', 'Security', 'Garden', 
    'Balcony', 'WiFi', 'Air Conditioning', 'Furnished', 
    'Pet Friendly', 'Elevator', 'Laundry', 'Storage'
  ];

  // Fetch agents when component mounts (for admin users)
  useEffect(() => {
    if (user?.role === 'admin') {
      getAgents();
    }
  }, [user, getAgents]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price) errors.price = 'Price is required';
    if (!formData.bedrooms) errors.bedrooms = 'Bedrooms count is required';
    if (!formData.bathrooms) errors.bathrooms = 'Bathrooms count is required';
    if (!formData.area) errors.area = 'Area is required';
    
    // Address validation
    if (!formData.address.street.trim()) errors.street = 'Street address is required';
    if (!formData.address.city.trim()) errors.city = 'City is required';
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
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'address') {
          // Ensure all required address fields are included
          const completeAddress = {
            line1: value.line1 || '',
            street: value.street || '',
            city: value.city || '',
            state: value.state || '',
            zipCode: value.zipCode || '',
            country: value.country || 'India'
          };
          formDataToSend.append('address', JSON.stringify(completeAddress));
        } else if (key === 'amenities') {
          value.forEach(amenity => formDataToSend.append('amenities[]', amenity));
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      // If admin is creating, add the selected agent
      if (user?.role === 'admin' && selectedAgent) {
        formDataToSend.append('agent', selectedAgent._id);
      }

      // Append images
      images.forEach(file => {
        formDataToSend.append('images', file);
      });

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
      navigate('/properties');
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10); // Limit to 10 files
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
    setImages([...images, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    // Clear image error if files were selected
    if (files.length > 0) {
      setFormErrors(prev => ({ ...prev, images: undefined }));
    }
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
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          maxWidth: 1200, 
          mx: 'auto',
          p: { xs: 1, sm: 2, md: 3 },
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          Add New Property
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearErrors}>
            {typeof error === 'object' ? JSON.stringify(error) : error}
          </Alert>
        )}

        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
          {/* Agent Selection (for admin only) */}
          {user?.role === 'admin' && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Assign to Agent
              </Typography>
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
                    required
                    error={!!formErrors.agent}
                    helperText={formErrors.agent}
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
                        <Typography variant="body1">{option.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.email}
                        </Typography>
                      </Box>
                    </Box>
                  </li>
                )}
              />
            </Grid>
          )}

          {/* Title */}
          <Grid item xs={12}>
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
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
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
            />
          </Grid>

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
            >
              {propertyTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
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
            >
              {propertyStatuses.map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
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
                    color="primary"
                  />
                }
                label={
                  <Box display="flex" alignItems="center">
                    <Star color={formData.featured ? "primary" : "inherit"} sx={{ mr: 1 }} />
                    Featured Property
                  </Box>
                }
              />
            </Grid>
          )}

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
                  <InputAdornment position="start">₹</InputAdornment>
                ),
                inputProps: { min: 0 }
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
              InputProps={{ inputProps: { min: 0 } }}
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
              InputProps={{ inputProps: { min: 0 } }}
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
              InputProps={{ inputProps: { min: 0 } }}
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
            />
          </Grid>

          {/* Address Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
              Address Details
            </Typography>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Apartment/Room Details (optional)"
                    name="address.line1"
                    value={formData.address.line1}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
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
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Amenities */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Amenities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {amenitiesList.map(amenity => (
                <Chip
                  key={amenity}
                  label={amenity}
                  clickable
                  size={isMobile ? 'small' : 'medium'}
                  color={formData.amenities.includes(amenity) ? 'primary' : 'default'}
                  onClick={() => handleAmenityToggle(amenity)}
                />
              ))}
            </Box>
          </Grid>

          {/* Images */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Property Images
            </Typography>
            <FormHelperText sx={{ mb: 1 }}>
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
                      borderRadius: 1
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
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.7)'
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
            >
              Upload Images
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                disabled={imagePreviews.length >= 10}
              />
            </Button>
            {uploadProgress.percent && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Uploading: {uploadProgress.percent}%
              </Typography>
            )}
          </Grid>

          {/* Submit Buttons */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2
            }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || isSubmitting}
                startIcon={(loading || isSubmitting) ? <CircularProgress size={20} /> : null}
                sx={{ 
                  flex: 1,
                  py: 1.5
                }}
              >
                {(loading || isSubmitting) ? 'Adding Property...' : 'Add Property'}
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                sx={{ 
                  flex: 1,
                  py: 1.5
                }}
                onClick={() => navigate('/properties')}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AddPropertyPage;