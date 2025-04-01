import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, TextField, Button, Grid, MenuItem, Chip, Typography, Paper,
  CircularProgress, Alert, IconButton, Avatar, Snackbar, FormControlLabel, 
  Checkbox, Container, FormHelperText, InputAdornment, Autocomplete
} from '@mui/material';
import { CloudUpload, Delete, CheckCircle } from '@mui/icons-material';
import { useProperties } from '../../context/PropertiesContext';
import { useAuth } from '../../context/AuthContext';
import { useMediaQuery, useTheme } from '@mui/material';
import { useAgents } from '../../context/AgentsContext';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { agents, getAgents } = useAgents();
  
  const { 
    property: fetchedProperty, 
    loading: fetchLoading, 
    error: fetchError, 
    getProperty, 
    updateProperty, 
    clearErrors 
  } = useProperties();
  
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
  
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const hasFetched = useRef(false);
  const fileInputRef = useRef(null);

  const propertyTypes = ['House', 'Apartment', 'Villa', 'Condo', 'Townhouse', 'Land', 'Commercial'];
  const propertyStatuses = ['For Sale', 'For Rent', 'Sold', 'Rented'];
  const amenitiesList = ['Parking', 'Swimming Pool', 'Gym', 'Security', 'Garden', 'Balcony', 'WiFi', 'Air Conditioning'];

  useEffect(() => {
    if (fetchedProperty && !fetchLoading) {
      setFormData({
        title: fetchedProperty.title || '',
        description: fetchedProperty.description || '',
        type: fetchedProperty.type || 'House',
        status: fetchedProperty.status || 'For Sale',
        price: fetchedProperty.price?.toString() || '',
        bedrooms: fetchedProperty.bedrooms?.toString() || '',
        bathrooms: fetchedProperty.bathrooms?.toString() || '',
        area: fetchedProperty.area?.toString() || '',
        buildingName: fetchedProperty.buildingName || '',
        floorNumber: fetchedProperty.floorNumber || '',
        featured: fetchedProperty.featured || false,
        address: {
          line1: fetchedProperty.address?.line1 || '',
          street: fetchedProperty.address?.street || '',
          city: fetchedProperty.address?.city || '',
          state: fetchedProperty.address?.state || '',
          zipCode: fetchedProperty.address?.zipCode || '',
          country: fetchedProperty.address?.country || 'India'
        },
        amenities: fetchedProperty.amenities || [],
      });
      setExistingImages(fetchedProperty.images || []);
    }
  }, [fetchedProperty, fetchLoading]);

  useEffect(() => {
    if (fetchedProperty?.agent) {
      if (agents.length > 0) {
        const agent = agents.find(a => a._id === fetchedProperty.agent._id);
        setSelectedAgent(agent || fetchedProperty.agent);
      } else {
        setSelectedAgent(fetchedProperty.agent);
      }
    }
  }, [fetchedProperty, agents]);

  useEffect(() => {
    if (id && !hasFetched.current) {
      hasFetched.current = true;
      const fetchData = async () => {
        try {
          await getProperty(id);
          if (user?.role === 'admin') {
            await getAgents();
          }
        } catch (err) {
          console.error('Error fetching data:', err);
          setError(err.message || 'Failed to load data');
        }
      };
      fetchData();
    }
    
    return () => clearErrors();
  }, [id, getProperty, clearErrors, user, getAgents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const formDataToSend = new FormData();
      
      // Add basic fields
      const fields = [
        'title', 'description', 'type', 'status', 'price',
        'bedrooms', 'bathrooms', 'area', 'buildingName', 'floorNumber', 'featured'
      ];
  
      fields.forEach(field => {
        if (formData[field] !== undefined && formData[field] !== null) {
          formDataToSend.append(field, formData[field]);
        }
      });

      // Add agent if admin is changing it
      if (user?.role === 'admin' && selectedAgent) {
        formDataToSend.append('agent', selectedAgent._id);
      }
  
      // Add address as JSON string
      formDataToSend.append('address', JSON.stringify(formData.address));
  
      // Add amenities
      if (formData.amenities?.length > 0) {
        formData.amenities.forEach(a => formDataToSend.append('amenities', a));
      }
  
      // Add existing images
      if (existingImages?.length > 0) {
        existingImages.forEach(img => {
          formDataToSend.append('existingImages', JSON.stringify({
            url: img.url,
            publicId: img.publicId,
            _id: img._id || img.id
          }));
        });
      }
  
      // Add new images
      if (images?.length > 0) {
        images.forEach(file => formDataToSend.append('images', file));
      }
  
      // Track upload progress
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress({ percent: percentCompleted });
        }
      };

      await updateProperty(id, formDataToSend, config);
      
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/admin/properties', {
          state: { message: 'Property updated successfully!' }
        });
      }, 1500);
  
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files).slice(0, 10 - (existingImages.length + images.length));
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
    setImages(prev => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [existingImages.length, images.length]);

  const handleRemoveNewImage = useCallback((index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleRemoveExistingImage = useCallback((index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAmenityToggle = useCallback((amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name.includes('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  if (fetchLoading && !hasFetched.current) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {fetchError}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/admin/properties')}
        >
          Back to Properties
        </Button>
      </Container>
    );
  }

  if (!fetchedProperty && !fetchLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Property not found</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/admin/properties')}
          sx={{ mt: 2 }}
        >
          Browse Properties
        </Button>
      </Container>
    );
  }

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
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" icon={<CheckCircle fontSize="inherit" />}>
            Property updated successfully!
          </Alert>
        </Snackbar>

        <Typography variant="h4" gutterBottom sx={{ mb: { xs: 2, sm: 3 } }}>
          Edit Property
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Agent Selection */}
          {user?.role === 'admin' && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Property Agent</Typography>
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
                  />
                )}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderOption={(props, option) => (
                  <li {...props} key={option._id}>
                    <Box display="flex" alignItems="center">
                      <Avatar src={option.photo} sx={{ width: 24, height: 24, mr: 1 }} />
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

          {/* Property Details */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Property Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              size={isMobile ? 'small' : 'medium'}
            />
          </Grid>

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
            />
          </Grid>

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
                label="Featured Property"
              />
            </Grid>
          )}

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
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
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
              onChange={handleChange}
              required
              size={isMobile ? 'small' : 'medium'}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

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
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

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
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

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
            <Typography variant="h6" gutterBottom>Address Details</Typography>
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
            <Typography variant="h6" gutterBottom>Amenities</Typography>
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
          {existingImages.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Current Images</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                {existingImages.map((img, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={img.url || img}
                      alt={`Property image ${index + 1}`}
                      sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveExistingImage(index)}
                      sx={{ 
                        position: 'absolute', 
                        top: 4, 
                        right: 4, 
                        color: 'white', 
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Add New Images</Typography>
            <FormHelperText sx={{ mb: 1 }}>
              {`You can upload up to ${10 - existingImages.length - images.length} more images (5MB each)`}
            </FormHelperText>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              {imagePreviews.map((preview, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={preview}
                    alt={`Preview ${index}`}
                    sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 1 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveNewImage(index)}
                    sx={{ 
                      position: 'absolute', 
                      top: 4, 
                      right: 4, 
                      color: 'white', 
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
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
              disabled={existingImages.length + images.length >= 10}
            >
              Upload Images
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                disabled={existingImages.length + images.length >= 10}
              />
            </Button>
            {uploadProgress.percent && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Uploading: {uploadProgress.percent}%
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{ flex: 1, py: 1.5 }}
              >
                {loading ? 'Updating...' : 'Update Property'}
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                sx={{ flex: 1, py: 1.5 }}
                onClick={() => navigate('/admin/properties')}
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

export default EditProperty;