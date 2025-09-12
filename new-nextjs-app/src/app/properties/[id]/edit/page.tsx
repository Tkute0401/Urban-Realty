'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from '@/lib/services/axios';
import { useAuth } from '@/contexts/AuthContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const propertyId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    propertyType: '',
    status: '',
    images: [],
    amenities: [],
    features: [],
    contactInfo: {
      name: '',
      phone: '',
      email: ''
    }
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/properties/${propertyId}`);
      const property = response.data.data;
      
      setFormData({
        title: property.title || '',
        description: property.description || '',
        price: property.price || '',
        location: property.location || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        area: property.area || '',
        propertyType: property.propertyType || '',
        status: property.status || '',
        images: property.images || [],
        amenities: property.amenities || [],
        features: property.features || [],
        contactInfo: {
          name: property.contactInfo?.name || '',
          phone: property.contactInfo?.phone || '',
          email: property.contactInfo?.email || ''
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch property');
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to edit properties');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const response = await axios.put(`/properties/${propertyId}`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/properties/${propertyId}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">You must be logged in to edit properties</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0c0d0e', color: 'white', p: 3 }}>
      <Box maxWidth="1200px" mx="auto">
        {/* Header */}
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton 
            onClick={() => router.back()}
            sx={{ color: 'white', mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Edit Property
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Property updated successfully! Redirecting...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: '#08171A' }}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Property Title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                      sx={{ 
                        '& .MuiOutlinedInput-root': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#78CADC' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Price"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                      sx={{ 
                        '& .MuiOutlinedInput-root': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#78CADC' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      multiline
                      rows={4}
                      required
                      sx={{ 
                        '& .MuiOutlinedInput-root': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#78CADC' }
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Property Details */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: '#08171A' }}>
                <Typography variant="h6" gutterBottom>
                  Property Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      required
                      sx={{ 
                        '& .MuiOutlinedInput-root': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#78CADC' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      required
                      sx={{ 
                        '& .MuiOutlinedInput-root': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#78CADC' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      required
                      sx={{ 
                        '& .MuiOutlinedInput-root': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#78CADC' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Area (sq ft)"
                      type="number"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      required
                      sx={{ 
                        '& .MuiOutlinedInput-root': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#78CADC' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth required>
                      <InputLabel sx={{ color: 'white' }}>Property Type</InputLabel>
                      <Select
                        value={formData.propertyType}
                        onChange={(e) => handleInputChange('propertyType', e.target.value)}
                        sx={{ 
                          color: 'white',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#78CADC' },
                          '& .MuiSvgIcon-root': { color: 'white' }
                        }}
                      >
                        <MenuItem value="apartment">Apartment</MenuItem>
                        <MenuItem value="house">House</MenuItem>
                        <MenuItem value="villa">Villa</MenuItem>
                        <MenuItem value="plot">Plot</MenuItem>
                        <MenuItem value="commercial">Commercial</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth required>
                      <InputLabel sx={{ color: 'white' }}>Status</InputLabel>
                      <Select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        sx={{ 
                          color: 'white',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#78CADC' },
                          '& .MuiSvgIcon-root': { color: 'white' }
                        }}
                      >
                        <MenuItem value="available">Available</MenuItem>
                        <MenuItem value="sold">Sold</MenuItem>
                        <MenuItem value="rented">Rented</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Amenities */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: '#08171A' }}>
                <Typography variant="h6" gutterBottom>
                  Amenities
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                  {formData.amenities.map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      onDelete={() => handleRemoveAmenity(index)}
                      sx={{ 
                        bgcolor: '#78CADC', 
                        color: 'black',
                        '& .MuiChip-deleteIcon': { color: 'black' }
                      }}
                    />
                  ))}
                </Box>
                <Box display="flex" gap={1}>
                  <TextField
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Add amenity"
                    size="small"
                    sx={{ 
                      flexGrow: 1,
                      '& .MuiOutlinedInput-root': { color: 'white' },
                      '& .MuiInputLabel-root': { color: 'white' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#78CADC' }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddAmenity}
                    startIcon={<AddIcon />}
                    sx={{ bgcolor: '#78CADC', color: 'black' }}
                  >
                    Add
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Features */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: '#08171A' }}>
                <Typography variant="h6" gutterBottom>
                  Features
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                  {formData.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      onDelete={() => handleRemoveFeature(index)}
                      sx={{ 
                        bgcolor: '#78CADC', 
                        color: 'black',
                        '& .MuiChip-deleteIcon': { color: 'black' }
                      }}
                    />
                  ))}
                </Box>
                <Box display="flex" gap={1}>
                  <TextField
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add feature"
                    size="small"
                    sx={{ 
                      flexGrow: 1,
                      '& .MuiOutlinedInput-root': { color: 'white' },
                      '& .MuiInputLabel-root': { color: 'white' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#78CADC' }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddFeature}
                    startIcon={<AddIcon />}
                    sx={{ bgcolor: '#78CADC', color: 'black' }}
                  >
                    Add
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: '#08171A' }}>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Contact Name"
                      value={formData.contactInfo.name}
                      onChange={(e) => handleInputChange('contactInfo.name', e.target.value)}
                      sx={{ 
                        '& .MuiOutlinedInput-root': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#78CADC' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={formData.contactInfo.phone}
                      onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                      sx={{ 
                        '& .MuiOutlinedInput-root': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#78CADC' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.contactInfo.email}
                      onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                      sx={{ 
                        '& .MuiOutlinedInput-root': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#78CADC' }
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => router.back()}
                  sx={{ 
                    color: 'white', 
                    borderColor: '#78CADC',
                    '&:hover': { borderColor: '#78CADC', bgcolor: 'rgba(120, 202, 220, 0.1)' }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{ 
                    bgcolor: '#78CADC', 
                    color: 'black',
                    '&:hover': { bgcolor: '#78CADC' }
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}