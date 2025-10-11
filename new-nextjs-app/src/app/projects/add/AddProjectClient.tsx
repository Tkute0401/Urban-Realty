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
  Divider
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
  Description
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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
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
    keywords: []
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

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

      await createProject(formDataToSend);
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
