'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, TextField, Button, Grid, Typography, Paper,
  CircularProgress, Alert, Container,
  FormHelperText, InputAdornment, IconButton, Avatar,
  Snackbar, Divider
} from '@mui/material';
import { 
  CloudUpload, Delete, Star, Close,
  Business, Email, Phone, Language,
  Facebook, Twitter, LinkedIn, Instagram,
  Add, Remove, DateRange, Save, ArrowBack
} from '@mui/icons-material';
import { useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import FieldIndicator from '@/components/ui/FieldIndicator';
import http from '@/lib/services/http';

// Styled components
const PremiumPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text-primary)',
  borderRadius: '16px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: `1px solid var(--color-border-light)`,
  padding: theme.spacing(3),
  fontFamily: '"Poppins", sans-serif',
  position: 'relative',
  overflow: 'hidden',
}));

const PremiumButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-primary-contrast)',
  fontWeight: 600,
  padding: theme.spacing(1.8, 4),
  borderRadius: '12px',
  fontFamily: '"Poppins", sans-serif',
  textTransform: 'none',
  fontSize: '1rem',
  letterSpacing: '0.5px',
  '&:hover': {
    backgroundColor: 'var(--color-primary-hover)',
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 12px rgba(var(--color-primary-rgb), 0.4)',
  },
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  boxShadow: '0 4px 8px rgba(var(--color-primary-rgb), 0.2)',
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: 'var(--color-primary)',
  position: 'relative',
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(3),
  fontFamily: '"Poppins", sans-serif',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '60px',
    height: '3px',
    backgroundColor: 'var(--color-primary)',
    borderRadius: '3px'
  }
}));

interface EditDeveloperProfileClientProps {
  id: string;
}

const EditDeveloperProfileClient = ({ id }: EditDeveloperProfileClientProps) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    description: '',
    website: '',
    foundedYear: '',
    headquarters: {
      city: '',
      state: '',
      country: 'India'
    },
    completedProjects: 0,
    ongoingProjects: 0,
    upcomingProjects: 0,
    flagshipProjects: [{ name: '', description: '' }],
    team: [{ name: '', designation: '' }],
    specializations: [{ name: '', description: '' }],
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
    awards: [{ name: '', year: '', category: '' }]
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [teamPhotoPreviews, setTeamPhotoPreviews] = useState<string[]>([]);
  const [teamPhotoFiles, setTeamPhotoFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const teamPhotoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDeveloperProfile();
  }, [id]);

  const fetchDeveloperProfile = async () => {
    try {
      setLoading(true);
      const response = await http.get(`/api/v1/admin/developers/profiles/${id}`);
      const developer = response.data.data.developer;
      
      // Populate form data
      setFormData({
        userId: developer.userId?._id || '',
        name: developer.name || '',
        description: developer.description || '',
        website: developer.website || '',
        foundedYear: developer.foundedYear?.toString() || '',
        headquarters: {
          city: developer.headquarters?.city || '',
          state: developer.headquarters?.state || '',
          country: developer.headquarters?.country || 'India'
        },
        completedProjects: developer.completedProjects || 0,
        ongoingProjects: developer.ongoingProjects || 0,
        upcomingProjects: developer.upcomingProjects || 0,
        flagshipProjects: developer.flagshipProjects && developer.flagshipProjects.length > 0 
          ? developer.flagshipProjects.map((p: any) => ({ name: p.name || '', description: p.description || '' }))
          : [{ name: '', description: '' }],
        team: developer.team && developer.team.length > 0
          ? developer.team.map((t: any) => ({ name: t.name || '', designation: t.designation || '' }))
          : [{ name: '', designation: '' }],
        specializations: developer.specializations && developer.specializations.length > 0
          ? developer.specializations.map((s: any) => ({ name: s.name || '', description: s.description || '' }))
          : [{ name: '', description: '' }],
        contact: {
          email: developer.contact?.email || '',
          phone: developer.contact?.phone || ''
        },
        socialMedia: {
          facebook: developer.socialMedia?.facebook || '',
          twitter: developer.socialMedia?.twitter || '',
          linkedin: developer.socialMedia?.linkedin || '',
          instagram: developer.socialMedia?.instagram || ''
        },
        awards: developer.awards && developer.awards.length > 0
          ? developer.awards.map((a: any) => ({ 
              name: a.name || '', 
              year: a.year?.toString() || '', 
              category: a.category || '' 
            }))
          : [{ name: '', year: '', category: '' }]
      });

      // Set existing logo if available
      if (developer.logo?.url) {
        setExistingLogoUrl(developer.logo.url);
        setLogoPreview(developer.logo.url);
      }
    } catch (err: any) {
      console.error('Error fetching developer profile:', err);
      const { extractErrorMessage } = await import('@/lib/utils/extractErrorMessage');
      const errorMessage = extractErrorMessage(err, 'Failed to load developer profile');
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) errors.name = 'Developer name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    
    if (formData.contact.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.contact.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (formData.website && !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(formData.website)) {
      errors.website = 'Please enter a valid URL';
    }
    
    if (formData.foundedYear && (parseInt(formData.foundedYear) < 1800 || parseInt(formData.foundedYear) > new Date().getFullYear())) {
      errors.foundedYear = 'Please enter a valid year';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare update data
      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        website: formData.website.trim() || undefined,
        foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined,
        headquarters: {
          city: formData.headquarters.city.trim() || undefined,
          state: formData.headquarters.state.trim() || undefined,
          country: formData.headquarters.country.trim() || 'India'
        },
        completedProjects: formData.completedProjects || 0,
        ongoingProjects: formData.ongoingProjects || 0,
        upcomingProjects: formData.upcomingProjects || 0,
        flagshipProjects: formData.flagshipProjects.filter(p => p.name.trim() || p.description.trim()),
        team: formData.team.filter(m => m.name.trim() || m.designation.trim()),
        specializations: formData.specializations.filter(s => s.name.trim() || s.description.trim()),
        contact: {
          email: formData.contact.email.trim() || undefined,
          phone: formData.contact.phone.trim() || undefined
        },
        socialMedia: {
          facebook: formData.socialMedia.facebook.trim() || undefined,
          twitter: formData.socialMedia.twitter.trim() || undefined,
          linkedin: formData.socialMedia.linkedin.trim() || undefined,
          instagram: formData.socialMedia.instagram.trim() || undefined
        },
        awards: formData.awards.filter(a => a.name.trim() || a.category.trim()).map(a => ({
          name: a.name.trim(),
          year: a.year ? parseInt(a.year) : undefined,
          category: a.category.trim()
        }))
      };

      await http.put(`/api/v1/admin/developers/profiles/${id}`, updateData);

      // Upload logo if a new one was selected
      if (logoFile) {
        const logoFormData = new FormData();
        logoFormData.append('logo', logoFile);
        await http.put(`/api/v1/developers/${id}/logo`, logoFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setSnackbarMessage('Developer profile updated successfully!');
      setSnackbarOpen(true);
      setTimeout(() => router.push('/admin/developers/profiles'), 1500);
    } catch (err: any) {
      console.error('Submission error:', err);
      const { extractErrorMessage } = await import('@/lib/utils/extractErrorMessage');
      const errorMessage = extractErrorMessage(err, 'Failed to update developer profile');
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      setLogoFile(file);
    }
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const handleTeamPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    const previews = files.map(file => URL.createObjectURL(file));
    setTeamPhotoPreviews([...teamPhotoPreviews, ...previews]);
    setTeamPhotoFiles([...teamPhotoFiles, ...files]);
    if (teamPhotoInputRef.current) teamPhotoInputRef.current.value = '';
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
    setExistingLogoUrl(null);
  };

  const handleRemoveTeamPhoto = (index: number) => {
    const newPreviews = [...teamPhotoPreviews];
    const newFiles = [...teamPhotoFiles];
    newPreviews.splice(index, 1);
    newFiles.splice(index, 1);
    setTeamPhotoPreviews(newPreviews);
    setTeamPhotoFiles(newFiles);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    if (name.includes('headquarters.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        headquarters: { ...prev.headquarters, [field]: value }
      }));
    } else if (name.includes('contact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: { ...prev.contact, [field]: value }
      }));
    } else if (name.includes('socialMedia.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddFlagshipProject = () => {
    setFormData(prev => ({
      ...prev,
      flagshipProjects: [...prev.flagshipProjects, { name: '', description: '' }]
    }));
  };

  const handleRemoveFlagshipProject = (index: number) => {
    setFormData(prev => {
      const newProjects = [...prev.flagshipProjects];
      newProjects.splice(index, 1);
      return { ...prev, flagshipProjects: newProjects };
    });
  };

  const handleFlagshipProjectChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newProjects = [...prev.flagshipProjects];
      newProjects[index][field] = value;
      return { ...prev, flagshipProjects: newProjects };
    });
  };

  const handleAddTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      team: [...prev.team, { name: '', designation: '' }]
    }));
  };

  const handleRemoveTeamMember = (index: number) => {
    setFormData(prev => {
      const newTeam = [...prev.team];
      newTeam.splice(index, 1);
      return { ...prev, team: newTeam };
    });
  };

  const handleTeamMemberChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newTeam = [...prev.team];
      newTeam[index][field] = value;
      return { ...prev, team: newTeam };
    });
  };

  const handleAddSpecialization = () => {
    setFormData(prev => ({
      ...prev,
      specializations: [...prev.specializations, { name: '', description: '' }]
    }));
  };

  const handleRemoveSpecialization = (index: number) => {
    setFormData(prev => {
      const newSpecs = [...prev.specializations];
      newSpecs.splice(index, 1);
      return { ...prev, specializations: newSpecs };
    });
  };

  const handleSpecializationChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newSpecs = [...prev.specializations];
      newSpecs[index][field] = value;
      return { ...prev, specializations: newSpecs };
    });
  };

  const handleAddAward = () => {
    setFormData(prev => ({
      ...prev,
      awards: [...prev.awards, { name: '', year: '', category: '' }]
    }));
  };

  const handleRemoveAward = (index: number) => {
    setFormData(prev => {
      const newAwards = [...prev.awards];
      newAwards.splice(index, 1);
      return { ...prev, awards: newAwards };
    });
  };

  const handleAwardChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newAwards = [...prev.awards];
      newAwards[index][field] = value;
      return { ...prev, awards: newAwards };
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ 
      py: { xs: 2, md: 3 },
      backgroundColor: 'var(--color-bg)',
      minHeight: '100vh'
    }}>
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          maxWidth: 1200, 
          mx: 'auto',
          p: { xs: 1, sm: 2, md: 3 },
          backgroundColor: 'var(--color-surface)',
          borderRadius: '16px',
          border: '1px solid var(--color-border-light)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={() => router.push('/admin/developers/profiles')} 
            sx={{ 
              mr: 2,
              color: 'var(--color-text-primary)',
              '&:hover': {
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)'
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography 
            variant="h4" 
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem' },
              color: 'var(--color-primary)',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 700
            }}
          >
            Edit Developer Profile
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
          {/* Basic Information Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Basic Information</SectionHeader>
            <PremiumPaper>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FieldIndicator required helperText="Enter the company or developer name" />
                  <TextField
                    fullWidth
                    label="Developer Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: 'var(--color-primary)' }}>
                          <Business />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-surface)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-secondary)',
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-border-medium)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'var(--color-text-muted)',
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FieldIndicator required helperText="Detailed description of the developer" />
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
                    sx={{
                      mb: 2,
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-surface)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-secondary)',
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-border-medium)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'var(--color-text-muted)',
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FieldIndicator optional helperText="Company website URL" />
                  <TextField
                    fullWidth
                    label="Website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.website}
                    helperText={formErrors.website}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: 'var(--color-primary)' }}>
                          <Language />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-surface)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-secondary)',
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-border-medium)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'var(--color-text-muted)',
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FieldIndicator optional helperText="Year the company was founded" />
                  <TextField
                    fullWidth
                    label="Founded Year"
                    name="foundedYear"
                    type="number"
                    value={formData.foundedYear}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.foundedYear}
                    helperText={formErrors.foundedYear}
                    inputProps={{ min: 1800, max: new Date().getFullYear() }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-surface)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-secondary)',
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-border-medium)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'var(--color-text-muted)',
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </PremiumPaper>
          </Grid>

          {/* Logo Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Developer Logo</SectionHeader>
            <PremiumPaper>
              <FormHelperText sx={{ mb: 1, color: 'var(--color-text-muted)' }}>
                Upload a logo image (5MB max)
              </FormHelperText>
              
              {logoPreview && (
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src={logoPreview}
                    alt="Logo Preview"
                    sx={{ 
                      width: 120, 
                      height: 120,
                      objectFit: 'contain',
                      borderRadius: '8px',
                      border: '2px solid var(--color-primary)',
                      mr: 2
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveLogo}
                    sx={{ color: 'var(--color-error)' }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              )}

              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUpload />}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-inverse)',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)'
                  }
                }}
              >
                {logoPreview ? 'Change Logo' : 'Upload Logo'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoChange}
                  ref={logoInputRef}
                />
              </Button>
            </PremiumPaper>
          </Grid>

          {/* Headquarters Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Headquarters</SectionHeader>
            <PremiumPaper>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FieldIndicator optional helperText="Main office city" />
                  <TextField
                    fullWidth
                    label="City"
                    name="headquarters.city"
                    value={formData.headquarters.city}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-surface)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-secondary)',
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-border-medium)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'var(--color-text-muted)',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FieldIndicator optional helperText="State or province" />
                  <TextField
                    fullWidth
                    label="State"
                    name="headquarters.state"
                    value={formData.headquarters.state}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-surface)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-secondary)',
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-border-medium)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'var(--color-text-muted)',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FieldIndicator optional helperText="Country of operation" />
                  <TextField
                    fullWidth
                    label="Country"
                    name="headquarters.country"
                    value={formData.headquarters.country}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-surface)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-secondary)',
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-border-medium)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'var(--color-text-muted)',
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </PremiumPaper>
          </Grid>

          {/* Projects Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Projects</SectionHeader>
            <PremiumPaper>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Completed Projects"
                    name="completedProjects"
                    type="number"
                    value={formData.completedProjects}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    inputProps={{ min: 0 }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-surface)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-secondary)',
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-border-medium)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'var(--color-text-muted)',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Ongoing Projects"
                    name="ongoingProjects"
                    type="number"
                    value={formData.ongoingProjects}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    inputProps={{ min: 0 }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-surface)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-secondary)',
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-border-medium)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'var(--color-text-muted)',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Upcoming Projects"
                    name="upcomingProjects"
                    type="number"
                    value={formData.upcomingProjects}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    inputProps={{ min: 0 }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-surface)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-secondary)',
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-border-medium)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'var(--color-text-muted)',
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </PremiumPaper>
          </Grid>

          {/* Flagship Projects Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Flagship Projects</SectionHeader>
            <PremiumPaper>
              {formData.flagshipProjects.map((project, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid var(--color-primary)', borderRadius: '8px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                      Project {index + 1}
                    </Typography>
                    {formData.flagshipProjects.length > 1 && (
                      <IconButton size="small" onClick={() => handleRemoveFlagshipProject(index)} sx={{ color: 'var(--color-error)' }}>
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Project Name"
                        value={project.name}
                        onChange={(e) => handleFlagshipProjectChange(index, 'name', e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiInputBase-root': {
                            color: 'var(--color-white)',
                            fontFamily: '"Poppins", sans-serif'
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--color-primary)',
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'var(--color-primary)',
                            },
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={project.description}
                        onChange={(e) => handleFlagshipProjectChange(index, 'description', e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiInputBase-root': {
                            color: 'var(--color-white)',
                            fontFamily: '"Poppins", sans-serif'
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--color-primary)',
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'var(--color-primary)',
                            },
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                startIcon={<Add />}
                onClick={handleAddFlagshipProject}
                variant="outlined"
                sx={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                  '&:hover': {
                    borderColor: 'var(--color-primary-hover)',
                    backgroundColor: 'var(--color-primary-light)',
                    opacity: 0.8
                  }
                }}
              >
                Add Flagship Project
              </Button>
            </PremiumPaper>
          </Grid>

          {/* Team Members Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Team Members</SectionHeader>
            <PremiumPaper>
              {formData.team.map((member, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid var(--color-primary)', borderRadius: '8px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                      Team Member {index + 1}
                    </Typography>
                    {formData.team.length > 1 && (
                      <IconButton size="small" onClick={() => handleRemoveTeamMember(index)} sx={{ color: 'var(--color-error)' }}>
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiInputBase-root': {
                            color: 'var(--color-white)',
                            fontFamily: '"Poppins", sans-serif'
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--color-primary)',
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'var(--color-primary)',
                            },
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Designation"
                        value={member.designation}
                        onChange={(e) => handleTeamMemberChange(index, 'designation', e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiInputBase-root': {
                            color: 'var(--color-white)',
                            fontFamily: '"Poppins", sans-serif'
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--color-primary)',
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'var(--color-primary)',
                            },
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                startIcon={<Add />}
                onClick={handleAddTeamMember}
                variant="outlined"
                sx={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                  '&:hover': {
                    borderColor: 'var(--color-primary-hover)',
                    backgroundColor: 'var(--color-primary-light)',
                    opacity: 0.8
                  }
                }}
              >
                Add Team Member
              </Button>
            </PremiumPaper>
          </Grid>

          {/* Specializations Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Specializations</SectionHeader>
            <PremiumPaper>
              {formData.specializations.map((spec, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid var(--color-primary)', borderRadius: '8px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                      Specialization {index + 1}
                    </Typography>
                    {formData.specializations.length > 1 && (
                      <IconButton size="small" onClick={() => handleRemoveSpecialization(index)} sx={{ color: 'var(--color-error)' }}>
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={spec.name}
                        onChange={(e) => handleSpecializationChange(index, 'name', e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiInputBase-root': {
                            color: 'var(--color-white)',
                            fontFamily: '"Poppins", sans-serif'
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--color-primary)',
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'var(--color-primary)',
                            },
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={spec.description}
                        onChange={(e) => handleSpecializationChange(index, 'description', e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiInputBase-root': {
                            color: 'var(--color-white)',
                            fontFamily: '"Poppins", sans-serif'
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--color-primary)',
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'var(--color-primary)',
                            },
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                startIcon={<Add />}
                onClick={handleAddSpecialization}
                variant="outlined"
                sx={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                  '&:hover': {
                    borderColor: 'var(--color-primary-hover)',
                    backgroundColor: 'var(--color-primary-light)',
                    opacity: 0.8
                  }
                }}
              >
                Add Specialization
              </Button>
            </PremiumPaper>
          </Grid>

          {/* Contact Information Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Contact Information</SectionHeader>
            <PremiumPaper>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="contact.email"
                    type="email"
                    value={formData.contact.email}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: 'var(--color-primary)' }}>
                          <Email />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-surface)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-secondary)',
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-border-medium)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'var(--color-text-muted)',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="contact.phone"
                    value={formData.contact.phone}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: 'var(--color-primary)' }}>
                          <Phone />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-surface)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-secondary)',
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-border-medium)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'var(--color-text-muted)',
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </PremiumPaper>
          </Grid>

          {/* Social Media Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Social Media</SectionHeader>
            <PremiumPaper>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Facebook"
                    name="socialMedia.facebook"
                    value={formData.socialMedia.facebook}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: 'var(--color-primary)' }}>
                          <Facebook />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-surface)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-secondary)',
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-border-medium)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'var(--color-text-muted)',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Twitter"
                    name="socialMedia.twitter"
                    value={formData.socialMedia.twitter}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: 'var(--color-primary)' }}>
                          <Twitter />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-surface)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-secondary)',
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-border-medium)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'var(--color-text-muted)',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="LinkedIn"
                    name="socialMedia.linkedin"
                    value={formData.socialMedia.linkedin}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: 'var(--color-primary)' }}>
                          <LinkedIn />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-surface)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-secondary)',
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-border-medium)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'var(--color-text-muted)',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Instagram"
                    name="socialMedia.instagram"
                    value={formData.socialMedia.instagram}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: 'var(--color-primary)' }}>
                          <Instagram />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'var(--color-surface)',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-secondary)',
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--color-border-medium)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'var(--color-text-muted)',
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </PremiumPaper>
          </Grid>

          {/* Awards Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Awards</SectionHeader>
            <PremiumPaper>
              {formData.awards.map((award, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid var(--color-primary)', borderRadius: '8px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                      Award {index + 1}
                    </Typography>
                    {formData.awards.length > 1 && (
                      <IconButton size="small" onClick={() => handleRemoveAward(index)} sx={{ color: 'var(--color-error)' }}>
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Award Name"
                        value={award.name}
                        onChange={(e) => handleAwardChange(index, 'name', e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiInputBase-root': {
                            color: 'var(--color-white)',
                            fontFamily: '"Poppins", sans-serif'
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--color-primary)',
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'var(--color-primary)',
                            },
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Year"
                        type="number"
                        value={award.year}
                        onChange={(e) => handleAwardChange(index, 'year', e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        inputProps={{ min: 1800, max: new Date().getFullYear() }}
                        sx={{
                          '& .MuiInputBase-root': {
                            color: 'var(--color-white)',
                            fontFamily: '"Poppins", sans-serif'
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--color-primary)',
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'var(--color-primary)',
                            },
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Category"
                        value={award.category}
                        onChange={(e) => handleAwardChange(index, 'category', e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiInputBase-root': {
                            color: 'var(--color-white)',
                            fontFamily: '"Poppins", sans-serif'
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--color-primary)',
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'var(--color-primary)',
                            },
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                startIcon={<Add />}
                onClick={handleAddAward}
                variant="outlined"
                sx={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                  '&:hover': {
                    borderColor: 'var(--color-primary-hover)',
                    backgroundColor: 'var(--color-primary-light)',
                    opacity: 0.8
                  }
                }}
              >
                Add Award
              </Button>
            </PremiumPaper>
          </Grid>

          {/* Submit Buttons */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2
            }}>
              <PremiumButton
                type="submit"
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} sx={{ color: 'var(--color-text-inverse)' }} /> : <Save />}
                sx={{ 
                  flex: 1,
                  py: 1.5,
                  '&:disabled': {
                    backgroundColor: 'rgba(var(--color-primary-rgb), 0.5)'
                  }
                }}
              >
                {isSubmitting ? 'Updating Profile...' : 'Update Profile'}
              </PremiumButton>
              
              <Button
                variant="outlined"
                size="large"
                sx={{ 
                  flex: 1,
                  py: 1.5,
                  color: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)',
                    borderColor: 'var(--color-primary)'
                  }
                }}
                onClick={() => router.push('/admin/developers/profiles')}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <Close fontSize="small" />
          </IconButton>
        }
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: 'var(--color-text-primary)',
            color: 'var(--color-white)',
            border: '2px solid var(--color-primary)',
            fontFamily: '"Poppins", sans-serif'
          }
        }}
      />
    </Container>
  );
};

export default EditDeveloperProfileClient;

