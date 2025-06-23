import { useState, useEffect, useRef } from 'react';
import { useProperties } from '../../context/PropertiesContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Box, TextField, Button, Grid, MenuItem, Chip, Typography, Paper,
  CircularProgress, Alert, FormControlLabel, Checkbox, Container,
  FormHelperText, InputAdornment, IconButton, Autocomplete, Avatar,
  FormLabel, Snackbar, Divider, Select, InputLabel, FormControl
} from '@mui/material';
import { 
  CloudUpload, Delete, Star, Close,
  Home, Apartment, Villa, Cottage, Factory, Landscape,
  LocalParking, Pool, FitnessCenter, Security, Spa,
  Balcony, Wifi, AcUnit, Chair, Pets, Elevator,
  LocalLaundryService, Storage, MeetingRoom, Kitchen,
  Bathtub, KingBed, SquareFoot, DateRange
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Styled Components
const PremiumPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '16px',
  boxShadow: theme.shadows[4],
  padding: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
}));

const FormSectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const AddPropertyPage = () => {
  const { createProperty, loading, error, clearErrors, getDevelopers, developers } = useProperties();
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const brochureInputRef = useRef(null);
  const floorPlanInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Apartment',
    status: 'For Sale',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    buildingName: '',
    floorNumber: '',
    featured: false,
    developer: '',
    possessionDate: null,
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
  const [imagePreviews, setImagePreviews] = useState([]);
  const [floorPlanPreviews, setFloorPlanPreviews] = useState([]);
  const [brochurePreview, setBrochurePreview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [newApproval, setNewApproval] = useState({ name: '', number: '', date: null });

  // Property type options
  const propertyTypes = ['House', 'Apartment', 'Villa', 'Condo', 'Townhouse', 'Land', 'Commercial'];
  const propertyStatuses = ['For Sale', 'For Rent'];
  const constructionStatuses = ['Under Construction', 'Ready to Move', 'New Launch', 'Almost Ready'];

  // Amenities options
  const amenitiesConfig = [
    { name: 'Parking', icon: <LocalParking /> },
    { name: 'Swimming Pool', icon: <Pool /> },
    { name: 'Gym', icon: <FitnessCenter /> },
    // ... other amenities
  ];

  // Fetch developers on mount
  useEffect(() => {
    getDevelopers();
  }, [getDevelopers]);

  // Handle error snackbar
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarOpen(true);
    }
  }, [error]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price) errors.price = 'Price is required';
    if (!formData.bedrooms) errors.bedrooms = 'Bedrooms count is required';
    if (!formData.bathrooms) errors.bathrooms = 'Bathrooms count is required';
    if (!formData.area) errors.area = 'Area is required';
    if (!formData.address.street.trim()) errors.street = 'Street address is required';
    if (!formData.address.city.trim()) errors.city = 'City is required';
    if (!formData.address.locality.trim()) errors.locality = 'Locality is required';
    if (!formData.address.state.trim()) errors.state = 'State is required';
    if (!formData.address.zipCode.trim()) errors.zipCode = 'Zip code is required';
    if (imagePreviews.length === 0) errors.images = 'At least one image is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      
      // Append basic fields
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
      
      if (formData.developer) formDataToSend.append('developer', formData.developer);
      if (formData.possessionDate) formDataToSend.append('possessionDate', formData.possessionDate.toISOString());
      if (formData.ageOfProperty) formDataToSend.append('ageOfProperty', formData.ageOfProperty);

      // Append address
      Object.entries(formData.address).forEach(([key, value]) => {
        formDataToSend.append(`address[${key}]`, value);
      });

      // Append arrays
      formData.amenities.forEach(amenity => formDataToSend.append('amenities[]', amenity));
      formData.highlights.filter(h => h.trim() !== '').forEach((h, i) => formDataToSend.append(`highlights[${i}]`, h));
      formData.approvals.forEach((a, i) => {
        formDataToSend.append(`approvals[${i}][name]`, a.name);
        formDataToSend.append(`approvals[${i}][number]`, a.number);
        formDataToSend.append(`approvals[${i}][date]`, a.date.toISOString());
      });

      // Append nested objects
      Object.entries(formData.nearbyLocalities).forEach(([key, value]) => {
        formDataToSend.append(`nearbyLocalities[${key}]`, value);
      });

      Object.entries(formData.projectDetails).forEach(([key, value]) => {
        if (value) formDataToSend.append(`projectDetails[${key}]`, value);
      });

      // Append files
      Array.from(fileInputRef.current?.files || []).forEach(file => {
        formDataToSend.append('images', file);
      });

      Array.from(floorPlanInputRef.current?.files || []).forEach(file => {
        formDataToSend.append('floorPlans', file);
      });

      if (brochureInputRef.current?.files?.[0]) {
        formDataToSend.append('brochure', brochureInputRef.current.files[0]);
      }

      // Set agent
      formDataToSend.append('agent', user.id);

      await createProperty(formDataToSend);
      setSnackbarMessage('Property created successfully!');
      setSnackbarOpen(true);
      setTimeout(() => navigate('/properties'), 1500);
    } catch (err) {
      setSnackbarMessage(err.message || 'Failed to create property');
      setSnackbarOpen(true);
    }
  };

  // Handle file uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (files.length > 0) setFormErrors({ ...formErrors, images: undefined });
  };

  const handleFloorPlanChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    const previews = files.map(file => URL.createObjectURL(file));
    setFloorPlanPreviews([...floorPlanPreviews, ...previews]);
    if (floorPlanInputRef.current) floorPlanInputRef.current.value = '';
  };

  const handleBrochureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setBrochurePreview(URL.createObjectURL(file));
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: undefined });
    }
    
    if (name.includes('address.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value }
      });
    } else if (name.includes('projectDetails.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        projectDetails: { ...formData.projectDetails, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle approval addition
  const addApproval = () => {
    if (newApproval.name && newApproval.number && newApproval.date) {
      setFormData({
        ...formData,
        approvals: [...formData.approvals, newApproval]
      });
      setNewApproval({ name: '', number: '', date: null });
    }
  };

  // Remove functions
  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
    if (newPreviews.length === 0) setFormErrors({ ...formErrors, images: 'At least one image is required' });
  };

  const removeFloorPlan = (index) => {
    const newPreviews = [...floorPlanPreviews];
    newPreviews.splice(index, 1);
    setFloorPlanPreviews(newPreviews);
  };

  const removeBrochure = () => {
    setBrochurePreview(null);
    if (brochureInputRef.current) brochureInputRef.current.value = '';
  };

  const removeApproval = (index) => {
    setFormData({
      ...formData,
      approvals: formData.approvals.filter((_, i) => i !== index)
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Add New Property
        </Typography>

        {/* Basic Information Section */}
        <PremiumPaper sx={{ mb: 4 }}>
          <FormSectionHeader variant="h6">
            Basic Information
          </FormSectionHeader>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Property Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
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
                error={!!formErrors.description}
                helperText={formErrors.description}
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
              >
                {propertyTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
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
              >
                {propertyStatuses.map(status => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
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
                    />
                  }
                  label="Featured Property"
                />
              </Grid>
            )}
          </Grid>
        </PremiumPaper>

        {/* Property Details Section */}
        <PremiumPaper sx={{ mb: 4 }}>
          <FormSectionHeader variant="h6">
            Property Details
          </FormSectionHeader>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                error={!!formErrors.price}
                helperText={formErrors.price}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Bedrooms"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
                error={!!formErrors.bedrooms}
                helperText={formErrors.bedrooms}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
                error={!!formErrors.bathrooms}
                helperText={formErrors.bathrooms}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Area (sqft)"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
                error={!!formErrors.area}
                helperText={formErrors.area}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Building Name (optional)"
                name="buildingName"
                value={formData.buildingName}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Floor Number (optional)"
                name="floorNumber"
                value={formData.floorNumber}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </PremiumPaper>

        {/* Developer Information Section */}
        <PremiumPaper sx={{ mb: 4 }}>
          <FormSectionHeader variant="h6">
            Developer Information
          </FormSectionHeader>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={developers}
                getOptionLabel={(option) => option.name}
                value={developers.find(d => d._id === formData.developer) || null}
                onChange={(e, newValue) => {
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
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {option.logo?.url && (
                        <Avatar src={option.logo.url} sx={{ width: 24, height: 24 }} />
                      )}
                      <Typography>{option.name}</Typography>
                    </Box>
                  </Box>
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Construction Status"
                value={formData.constructionStatus}
                onChange={(e) => setFormData({
                  ...formData,
                  constructionStatus: e.target.value
                })}
              >
                {constructionStatuses.map(status => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Possession Date"
                  value={formData.possessionDate}
                  onChange={(newValue) => {
                    setFormData({
                      ...formData,
                      possessionDate: newValue
                    });
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age of Property (years)"
                type="number"
                value={formData.ageOfProperty}
                onChange={(e) => setFormData({
                  ...formData,
                  ageOfProperty: e.target.value
                })}
              />
            </Grid>
          </Grid>
        </PremiumPaper>

        {/* Address Section */}
        <PremiumPaper sx={{ mb: 4 }}>
          <FormSectionHeader variant="h6">
            Address Details
          </FormSectionHeader>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Apartment/Room Details (optional)"
                name="address.line1"
                value={formData.address.line1}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
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
                error={!!formErrors.city}
                helperText={formErrors.city}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Locality"
                name="address.locality"
                value={formData.address.locality}
                onChange={handleChange}
                error={!!formErrors.locality}
                helperText={formErrors.locality}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="State"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                error={!!formErrors.state}
                helperText={formErrors.state}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Zip Code"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                error={!!formErrors.zipCode}
                helperText={formErrors.zipCode}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </PremiumPaper>

        {/* Media Section */}
        <PremiumPaper sx={{ mb: 4 }}>
          <FormSectionHeader variant="h6">
            Property Images
          </FormSectionHeader>
          
          {formErrors.images && (
            <FormHelperText error sx={{ mb: 2 }}>
              {formErrors.images}
            </FormHelperText>
          )}
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
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
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeImage(index)}
                  sx={{ 
                    position: 'absolute', 
                    top: 4, 
                    right: 4, 
                    color: 'white', 
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    '&:hover': {
                      backgroundColor: 'error.main'
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
            disabled={imagePreviews.length >= 10}
          >
            Upload Images (Max 10)
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
          </Button>
        </PremiumPaper>

        {/* Floor Plans Section */}
        <PremiumPaper sx={{ mb: 4 }}>
          <FormSectionHeader variant="h6">
            Floor Plans
          </FormSectionHeader>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            {floorPlanPreviews.map((preview, index) => (
              <Box key={index} sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={preview}
                  alt={`Floor Plan ${index}`}
                  sx={{ 
                    width: 120, 
                    height: 120,
                    objectFit: 'cover',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeFloorPlan(index)}
                  sx={{ 
                    position: 'absolute', 
                    top: 4, 
                    right: 4, 
                    color: 'white', 
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    '&:hover': {
                      backgroundColor: 'error.main'
                    }
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
          
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
            disabled={floorPlanPreviews.length >= 5}
          >
            Upload Floor Plans (Max 5)
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleFloorPlanChange}
              ref={floorPlanInputRef}
            />
          </Button>
        </PremiumPaper>

        {/* Brochure Section */}
        <PremiumPaper sx={{ mb: 4 }}>
          <FormSectionHeader variant="h6">
            Brochure
          </FormSectionHeader>
          
          {brochurePreview ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography>Brochure uploaded</Typography>
              <IconButton onClick={removeBrochure} color="error">
                <Delete />
              </IconButton>
            </Box>
          ) : (
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
            >
              Upload Brochure (PDF)
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleBrochureChange}
                ref={brochureInputRef}
              />
            </Button>
          )}
        </PremiumPaper>

        {/* Submit Section */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/properties')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Creating Property...' : 'Create Property'}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default AddPropertyPage;