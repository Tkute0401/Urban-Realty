'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Snackbar
} from '@mui/material';
import {
  Business,
  Edit,
  Save,
  Cancel,
  Add,
  Delete,
  Link,
  LocationOn,
  Phone,
  Email,
  Language,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram
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

const DeveloperProfileClient = () => {
  const { user } = useAuth();
  const { developers, loading, error, getDevelopers, createDeveloper, updateDeveloper } = useDevelopers();
  const router = useRouter();
  
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'warning' | 'info' }>({ open: false, message: '', severity: 'success' });
  
  // Find developer profile for current user
  const developerProfile = developers.find(dev => dev.userId === user?.id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    foundedYear: '',
    headquarters: {
      city: '',
      state: '',
      country: 'India'
    },
    contact: {
      email: '',
      phone: ''
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    },
    completedProjects: 0,
    ongoingProjects: 0,
    upcomingProjects: 0,
    flagshipProjects: [],
    team: [],
    specializations: [],
    awards: []
  });

  useEffect(() => {
    if (user?.role === 'developer') {
      getDevelopers();
    }
  }, [user, getDevelopers]);

  useEffect(() => {
    if (developerProfile) {
      setFormData({
        name: developerProfile.name || '',
        description: developerProfile.description || '',
        website: developerProfile.website || '',
        foundedYear: developerProfile.foundedYear ? developerProfile.foundedYear.toString() : '',
        headquarters: {
          city: developerProfile.headquarters?.city || '',
          state: developerProfile.headquarters?.state || '',
          country: developerProfile.headquarters?.country || 'India'
        },
        contact: {
          email: developerProfile.contact?.email || '',
          phone: developerProfile.contact?.phone || ''
        },
        socialMedia: {
          facebook: developerProfile.socialMedia?.facebook || '',
          twitter: developerProfile.socialMedia?.twitter || '',
          linkedin: developerProfile.socialMedia?.linkedin || '',
          instagram: developerProfile.socialMedia?.instagram || ''
        },
        completedProjects: developerProfile.completedProjects || 0,
        ongoingProjects: developerProfile.ongoingProjects || 0,
        upcomingProjects: developerProfile.upcomingProjects || 0,
        flagshipProjects: developerProfile.flagshipProjects || [],
        team: developerProfile.team || [],
        specializations: developerProfile.specializations || [],
        awards: developerProfile.awards || []
      });
    }
  }, [developerProfile]);

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

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      setSnackbar({
        open: true,
        message: 'Name and description are required',
        severity: 'error'
      });
      return;
    }

    setSaving(true);
    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          // Handle arrays
          formData[key].forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              Object.keys(item).forEach(subKey => {
                formDataToSend.append(`${key}[${index}][${subKey}]`, item[subKey]);
              });
            } else {
              formDataToSend.append(`${key}[${index}]`, item);
            }
          });
        } else if (typeof formData[key] === 'object' && formData[key] !== null) {
          // Handle objects
          Object.keys(formData[key]).forEach(subKey => {
            formDataToSend.append(`${key}[${subKey}]`, formData[key][subKey]);
          });
        } else {
          // Handle primitive values
          formDataToSend.append(key, formData[key]);
        }
      });

      if (developerProfile) {
        // Update existing developer
        await updateDeveloper(developerProfile._id, formDataToSend);
        setSnackbar({
          open: true,
          message: 'Developer profile updated successfully!',
          severity: 'success'
        });
      } else {
        // Create new developer
        await createDeveloper(formDataToSend);
        setSnackbar({
          open: true,
          message: 'Developer profile created successfully!',
          severity: 'success'
        });
      }
      
      setEditMode(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to save developer profile',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (developerProfile) {
      // Reset to original data
      setFormData({
        name: developerProfile.name || '',
        description: developerProfile.description || '',
        website: developerProfile.website || '',
        foundedYear: developerProfile.foundedYear ? developerProfile.foundedYear.toString() : '',
        headquarters: {
          city: developerProfile.headquarters?.city || '',
          state: developerProfile.headquarters?.state || '',
          country: developerProfile.headquarters?.country || 'India'
        },
        contact: {
          email: developerProfile.contact?.email || '',
          phone: developerProfile.contact?.phone || ''
        },
        socialMedia: {
          facebook: developerProfile.socialMedia?.facebook || '',
          twitter: developerProfile.socialMedia?.twitter || '',
          linkedin: developerProfile.socialMedia?.linkedin || '',
          instagram: developerProfile.socialMedia?.instagram || ''
        },
        completedProjects: developerProfile.completedProjects || 0,
        ongoingProjects: developerProfile.ongoingProjects || 0,
        upcomingProjects: developerProfile.upcomingProjects || 0,
        flagshipProjects: developerProfile.flagshipProjects || [],
        team: developerProfile.team || [],
        specializations: developerProfile.specializations || [],
        awards: developerProfile.awards || []
      });
    }
    setEditMode(false);
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

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ color: 'var(--color-primary)' }} />
        <Typography variant="h6" sx={{ mt: 2, color: 'var(--color-text-primary)' }}>
          Loading developer profile...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'var(--color-primary)', mb: 1 }}>
          Developer Profile
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
          Manage your developer company profile and information
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <StyledPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <SectionHeader variant="h5">
            <Business />
            Company Information
          </SectionHeader>
          {!editMode ? (
            <ActionButton
              startIcon={<Edit />}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </ActionButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                sx={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
              >
                Cancel
              </Button>
              <ActionButton
                startIcon={<Save />}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <CircularProgress size={20} /> : 'Save Changes'}
              </ActionButton>
            </Box>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!editMode}
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
              label="Founded Year"
              type="number"
              value={formData.foundedYear}
              onChange={(e) => handleInputChange('foundedYear', e.target.value)}
              disabled={!editMode}
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
              rows={4}
              label="Company Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={!editMode}
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
          Location & Contact
        </SectionHeader>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="City"
              value={formData.headquarters.city}
              onChange={(e) => handleInputChange('headquarters.city', e.target.value)}
              disabled={!editMode}
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
              value={formData.headquarters.state}
              onChange={(e) => handleInputChange('headquarters.state', e.target.value)}
              disabled={!editMode}
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
              label="Country"
              value={formData.headquarters.country}
              onChange={(e) => handleInputChange('headquarters.country', e.target.value)}
              disabled={!editMode}
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
              label="Email"
              type="email"
              value={formData.contact.email}
              onChange={(e) => handleInputChange('contact.email', e.target.value)}
              disabled={!editMode}
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: 'var(--color-primary)' }} />
              }}
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
              label="Phone"
              value={formData.contact.phone}
              onChange={(e) => handleInputChange('contact.phone', e.target.value)}
              disabled={!editMode}
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: 'var(--color-primary)' }} />
              }}
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
              label="Website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              disabled={!editMode}
              InputProps={{
                startAdornment: <Language sx={{ mr: 1, color: 'var(--color-primary)' }} />
              }}
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
          <Link />
          Social Media
        </SectionHeader>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Facebook"
              value={formData.socialMedia.facebook}
              onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
              disabled={!editMode}
              InputProps={{
                startAdornment: <Facebook sx={{ mr: 1, color: 'var(--color-primary)' }} />
              }}
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
              label="Twitter"
              value={formData.socialMedia.twitter}
              onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
              disabled={!editMode}
              InputProps={{
                startAdornment: <Twitter sx={{ mr: 1, color: 'var(--color-secondary)' }} />
              }}
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
              label="LinkedIn"
              value={formData.socialMedia.linkedin}
              onChange={(e) => handleInputChange('socialMedia.linkedin', e.target.value)}
              disabled={!editMode}
              InputProps={{
                startAdornment: <LinkedIn sx={{ mr: 1, color: 'var(--color-primary)' }} />
              }}
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
              label="Instagram"
              value={formData.socialMedia.instagram}
              onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
              disabled={!editMode}
              InputProps={{
                startAdornment: <Instagram sx={{ mr: 1, color: 'var(--color-error)' }} />
              }}
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

      {/* Projects Counters */}
      <StyledPaper>
        <SectionHeader variant="h5">
          Projects Summary
        </SectionHeader>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Completed Projects"
              type="number"
              value={formData.completedProjects}
              onChange={(e) => handleInputChange('completedProjects', Number(e.target.value))}
              disabled={!editMode}
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
              label="Ongoing Projects"
              type="number"
              value={formData.ongoingProjects}
              onChange={(e) => handleInputChange('ongoingProjects', Number(e.target.value))}
              disabled={!editMode}
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
              label="Upcoming Projects"
              type="number"
              value={formData.upcomingProjects}
              onChange={(e) => handleInputChange('upcomingProjects', Number(e.target.value))}
              disabled={!editMode}
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

      {/* Flagship Projects */}
      <StyledPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <SectionHeader variant="h5">Flagship Projects</SectionHeader>
          {editMode && (
            <Button startIcon={<Add />} onClick={() => setFormData(prev => ({ ...prev, flagshipProjects: [...prev.flagshipProjects, { name: '', description: '' }] }))}>
              Add Project
            </Button>
          )}
        </Box>
        <Grid container spacing={2}>
          {formData.flagshipProjects.map((proj, idx) => (
            <Grid item xs={12} key={idx}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Project Name"
                    value={proj.name || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => {
                        const arr = [...prev.flagshipProjects];
                        arr[idx] = { ...arr[idx], name: value };
                        return { ...prev, flagshipProjects: arr };
                      });
                    }}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} md={7}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={proj.description || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => {
                        const arr = [...prev.flagshipProjects];
                        arr[idx] = { ...arr[idx], description: value };
                        return { ...prev, flagshipProjects: arr };
                      });
                    }}
                    disabled={!editMode}
                  />
                </Grid>
                {editMode && (
                  <Grid item xs={12} md={1}>
                    <IconButton onClick={() => setFormData(prev => ({ ...prev, flagshipProjects: prev.flagshipProjects.filter((_, i) => i !== idx) }))}>
                      <Delete />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </Grid>
          ))}
          {formData.flagshipProjects.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>No flagship projects added.</Typography>
            </Grid>
          )}
        </Grid>
      </StyledPaper>

      {/* Team */}
      <StyledPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <SectionHeader variant="h5">Team</SectionHeader>
          {editMode && (
            <Button startIcon={<Add />} onClick={() => setFormData(prev => ({ ...prev, team: [...prev.team, { name: '', designation: '' }] }))}>
              Add Member
            </Button>
          )}
        </Box>
        <Grid container spacing={2}>
          {formData.team.map((member, idx) => (
            <Grid item xs={12} key={idx}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={member.name || ''}
                    onChange={(e) => setFormData(prev => { const arr = [...prev.team]; arr[idx] = { ...arr[idx], name: e.target.value }; return { ...prev, team: arr }; })}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Designation"
                    value={member.designation || ''}
                    onChange={(e) => setFormData(prev => { const arr = [...prev.team]; arr[idx] = { ...arr[idx], designation: e.target.value }; return { ...prev, team: arr }; })}
                    disabled={!editMode}
                  />
                </Grid>
                {editMode && (
                  <Grid item xs={12} md={1}>
                    <IconButton onClick={() => setFormData(prev => ({ ...prev, team: prev.team.filter((_, i) => i !== idx) }))}>
                      <Delete />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </Grid>
          ))}
          {formData.team.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>No team members added.</Typography>
            </Grid>
          )}
        </Grid>
      </StyledPaper>

      {/* Specializations */}
      <StyledPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <SectionHeader variant="h5">Specializations</SectionHeader>
          {editMode && (
            <Button startIcon={<Add />} onClick={() => setFormData(prev => ({ ...prev, specializations: [...prev.specializations, { name: '', description: '' }] }))}>
              Add Specialization
            </Button>
          )}
        </Box>
        <Grid container spacing={2}>
          {formData.specializations.map((spec, idx) => (
            <Grid item xs={12} key={idx}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={spec.name || ''}
                    onChange={(e) => setFormData(prev => { const arr = [...prev.specializations]; arr[idx] = { ...arr[idx], name: e.target.value }; return { ...prev, specializations: arr }; })}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} md={7}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={spec.description || ''}
                    onChange={(e) => setFormData(prev => { const arr = [...prev.specializations]; arr[idx] = { ...arr[idx], description: e.target.value }; return { ...prev, specializations: arr }; })}
                    disabled={!editMode}
                  />
                </Grid>
                {editMode && (
                  <Grid item xs={12} md={1}>
                    <IconButton onClick={() => setFormData(prev => ({ ...prev, specializations: prev.specializations.filter((_, i) => i !== idx) }))}>
                      <Delete />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </Grid>
          ))}
          {formData.specializations.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>No specializations added.</Typography>
            </Grid>
          )}
        </Grid>
      </StyledPaper>

      {/* Awards */}
      <StyledPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <SectionHeader variant="h5">Awards</SectionHeader>
          {editMode && (
            <Button startIcon={<Add />} onClick={() => setFormData(prev => ({ ...prev, awards: [...prev.awards, { name: '', year: '', category: '' }] }))}>
              Add Award
            </Button>
          )}
        </Box>
        <Grid container spacing={2}>
          {formData.awards.map((award, idx) => (
            <Grid item xs={12} key={idx}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Award Name"
                    value={award.name || ''}
                    onChange={(e) => setFormData(prev => { const arr = [...prev.awards]; arr[idx] = { ...arr[idx], name: e.target.value }; return { ...prev, awards: arr }; })}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Year"
                    type="number"
                    value={award.year || ''}
                    onChange={(e) => setFormData(prev => { const arr = [...prev.awards]; arr[idx] = { ...arr[idx], year: e.target.value }; return { ...prev, awards: arr }; })}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Category"
                    value={award.category || ''}
                    onChange={(e) => setFormData(prev => { const arr = [...prev.awards]; arr[idx] = { ...arr[idx], category: e.target.value }; return { ...prev, awards: arr }; })}
                    disabled={!editMode}
                  />
                </Grid>
                {editMode && (
                  <Grid item xs={12} md={1}>
                    <IconButton onClick={() => setFormData(prev => ({ ...prev, awards: prev.awards.filter((_, i) => i !== idx) }))}>
                      <Delete />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </Grid>
          ))}
          {formData.awards.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>No awards added.</Typography>
            </Grid>
          )}
        </Grid>
      </StyledPaper>

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

export default DeveloperProfileClient;
