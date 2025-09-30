'use client'

import { useState, useRef, useEffect } from 'react';
import { useDevelopers } from '../../../contexts/DevelopersContext';
import { useAuth } from '../../../contexts/AuthContext';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { 
  Box, TextField, Button, Grid, MenuItem, Chip, Typography, Paper,
  CircularProgress, Alert, FormControlLabel, Checkbox, Container,
  FormHelperText, InputAdornment, IconButton, Avatar,
  FormLabel, Snackbar, Divider, Tooltip
} from '@mui/material';
import { 
  CloudUpload, Delete, Star, Close,
  Business, Email, Phone, Language,
  Facebook, Twitter, LinkedIn, Instagram,
  Add, Remove, DateRange
} from '@mui/icons-material';
import { useMediaQuery, useTheme } from '@mui/material';
import sessionManager from '../../../lib/utils/sessionManager';
import { styled } from '@mui/material/styles';

// Styled components
const PremiumPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
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
    background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-surface) 100%)',
  }
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
    backgroundColor: '#5fb4c9',
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 12px rgba(120, 202, 220, 0.4)',
  },
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  boxShadow: '0 4px 8px rgba(120, 202, 220, 0.2)',
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#78CADC',
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
    backgroundColor: '#78CADC',
    borderRadius: '3px'
  }
}));

const AddDeveloperPage = () => {
  const { createDeveloper, loading, error, clearErrors } = useDevelopers();
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [teamPhotoPreviews, setTeamPhotoPreviews] = useState([]);
  const [teamPhotoFiles, setTeamPhotoFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const logoInputRef = useRef(null);
  const teamPhotoInputRef = useRef(null);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarOpen(true);
    }
  }, [error]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Basic information
    if (!formData.name.trim()) errors.name = 'Developer name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    
    // Contact validation
    if (formData.contact.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.contact.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    // Website validation
    if (formData.website && !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(formData.website)) {
      errors.website = 'Please enter a valid URL';
    }
    
    // Year validation
    if (formData.foundedYear && (parseInt(formData.foundedYear) < 1800 || parseInt(formData.foundedYear) > new Date().getFullYear())) {
      errors.foundedYear = 'Please enter a valid year';
    }
    
    // Headquarters validation
    if (!formData.headquarters.city.trim()) errors.city = 'City is required';
    if (!formData.headquarters.state.trim()) errors.state = 'State is required';
    
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
      
      // Append all simple fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('website', formData.website || '');
      formDataToSend.append('foundedYear', formData.foundedYear || '');
      
      // Append headquarters
      Object.entries(formData.headquarters).forEach(([key, value]) => {
        formDataToSend.append(`headquarters[${key}]`, value);
      });
      
      // Append projects counts
      formDataToSend.append('completedProjects', formData.completedProjects.toString());
      formDataToSend.append('ongoingProjects', formData.ongoingProjects.toString());
      formDataToSend.append('upcomingProjects', formData.upcomingProjects.toString());
      
      // Append flagship projects
      formData.flagshipProjects.forEach((project, index) => {
        if (project.name.trim() || project.description.trim()) {
          formDataToSend.append(`flagshipProjects[${index}][name]`, project.name);
          formDataToSend.append(`flagshipProjects[${index}][description]`, project.description);
        }
      });
      
      // Append team members
      formData.team.forEach((member, index) => {
        if (member.name.trim() || member.designation.trim()) {
          formDataToSend.append(`team[${index}][name]`, member.name);
          formDataToSend.append(`team[${index}][designation]`, member.designation);
        }
      });
      
      // Append specializations
      formData.specializations.forEach((spec, index) => {
        if (spec.name.trim() || spec.description.trim()) {
          formDataToSend.append(`specializations[${index}][name]`, spec.name);
          formDataToSend.append(`specializations[${index}][description]`, spec.description);
        }
      });
      
      // Append contact info
      Object.entries(formData.contact).forEach(([key, value]) => {
        formDataToSend.append(`contact[${key}]`, value || '');
      });
      
      // Append social media
      Object.entries(formData.socialMedia).forEach(([key, value]) => {
        formDataToSend.append(`socialMedia[${key}]`, value || '');
      });
      
      // Append awards
      formData.awards.forEach((award, index) => {
        if (award.name.trim() || award.category.trim()) {
          formDataToSend.append(`awards[${index}][name]`, award.name);
          formDataToSend.append(`awards[${index}][year]`, award.year || '');
          formDataToSend.append(`awards[${index}][category]`, award.category);
        }
      });

      // Append logo if exists
      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }

      // Append team photos if exist
      teamPhotoFiles.forEach(file => {
        formDataToSend.append('teamPhotos', file);
      });

      const token = sessionManager.getToken();
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      };

      await createDeveloper(formDataToSend, config);
      setSnackbarMessage('Developer added successfully!');
      setSnackbarOpen(true);
      setTimeout(() => router.push('/developers'), 1500);
    } catch (err) {
      console.error('Submission error:', err);
      setSnackbarMessage(err.message || 'Failed to add developer');
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
    const files = Array.from(e.target.files || []).slice(0, 5); // Limit to 5 files
    const previews = files.map(file => URL.createObjectURL(file as File));
    setTeamPhotoPreviews([...teamPhotoPreviews, ...previews]);
    setTeamPhotoFiles([...teamPhotoFiles, ...files]);
    if (teamPhotoInputRef.current) teamPhotoInputRef.current.value = '';
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
  };

  const handleRemoveTeamPhoto = (index) => {
    const newPreviews = [...teamPhotoPreviews];
    const newFiles = [...teamPhotoFiles];
    newPreviews.splice(index, 1);
    newFiles.splice(index, 1);
    setTeamPhotoPreviews(newPreviews);
    setTeamPhotoFiles(newFiles);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    if (name.includes('headquarters.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        headquarters: { ...prev.headquarters, [field]: value }
      }));
      
      // Clear address errors when editing
      if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: undefined }));
      }
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

  const handleRemoveFlagshipProject = (index) => {
    setFormData(prev => {
      const newProjects = [...prev.flagshipProjects];
      newProjects.splice(index, 1);
      return { ...prev, flagshipProjects: newProjects };
    });
  };

  const handleFlagshipProjectChange = (index, field, value) => {
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

  const handleRemoveTeamMember = (index) => {
    setFormData(prev => {
      const newTeam = [...prev.team];
      newTeam.splice(index, 1);
      return { ...prev, team: newTeam };
    });
  };

  const handleTeamMemberChange = (index, field, value) => {
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

  const handleRemoveSpecialization = (index) => {
    setFormData(prev => {
      const newSpecs = [...prev.specializations];
      newSpecs.splice(index, 1);
      return { ...prev, specializations: newSpecs };
    });
  };

  const handleSpecializationChange = (index, field, value) => {
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

  const handleRemoveAward = (index) => {
    setFormData(prev => {
      const newAwards = [...prev.awards];
      newAwards.splice(index, 1);
      return { ...prev, awards: newAwards };
    });
  };

  const handleAwardChange = (index, field, value) => {
    setFormData(prev => {
      const newAwards = [...prev.awards];
      newAwards[index][field] = value;
      return { ...prev, awards: newAwards };
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ 
      py: { xs: 2, md: 3 },
      background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-surface) 100%)',
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
          border: '2px solid var(--color-primary)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '1.5rem', sm: '2rem' },
            color: 'var(--color-primary)',
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700
          }}
        >
          Add New Developer
        </Typography>

        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
          {/* Basic Information Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Basic Information</SectionHeader>
            <PremiumPaper>
              <Grid container spacing={2}>
                <Grid item xs={12}>
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
                        <InputAdornment position="start" sx={{ color: '#78CADC' }}>
                          <Business />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiInputBase-root': {
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
                        },
                      }
                    }}
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
                    error={!!formErrors.description}
                    helperText={formErrors.description}
                    sx={{
                      mb: 2,
                      '& .MuiInputBase-root': {
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
                        },
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
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
                        <InputAdornment position="start" sx={{ color: '#78CADC' }}>
                          <Language />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
                        },
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
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
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
                        },
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
              <FormHelperText sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
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
                      border: '2px solid #78CADC',
                      mr: 2
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveLogo}
                    sx={{ color: '#ff6b6b' }}
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
                  backgroundColor: '#78CADC',
                  color: '#0B1011',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#5fb4c9'
                  }
                }}
              >
                Upload Logo
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
                  <TextField
                    fullWidth
                    label="City"
                    name="headquarters.city"
                    value={formData.headquarters.city}
                    onChange={handleChange}
                    required
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.city}
                    helperText={formErrors.city}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
                        },
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="State"
                    name="headquarters.state"
                    value={formData.headquarters.state}
                    onChange={handleChange}
                    required
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.state}
                    helperText={formErrors.state}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
                        },
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="headquarters.country"
                    value={formData.headquarters.country}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
                        },
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
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
                        },
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
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
                        },
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
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
                        },
                      }
                    }}
                  />
                </Grid>
              </Grid>
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
                    value={formData.contact.email}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: '#78CADC' }}>
                          <Email />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
                        },
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
                        <InputAdornment position="start" sx={{ color: '#78CADC' }}>
                          <Phone />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#78CADC',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#78CADC',
                        },
                        '&:hover fieldset': {
                          borderColor: '#78CADC',
                        },
                      }
                    }}
                  />
                </Grid>
              </Grid>
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
                disabled={loading || isSubmitting}
                startIcon={(loading || isSubmitting) ? <CircularProgress size={20} sx={{ color: '#0B1011' }} /> : null}
                sx={{ 
                  flex: 1,
                  py: 1.5,
                  '&:disabled': {
                    backgroundColor: 'rgba(120, 202, 220, 0.5)'
                  }
                }}
              >
                {(loading || isSubmitting) ? 'Adding Developer...' : 'Add Developer'}
              </PremiumButton>
              
              <Button
                variant="outlined"
                size="large"
                sx={{ 
                  flex: 1,
                  py: 1.5,
                  color: '#78CADC',
                  borderColor: '#78CADC',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(120, 202, 220, 0.1)',
                    borderColor: '#78CADC'
                  }
                }}
                onClick={() => router.push('/developers')}
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
            backgroundColor: '#0B1011',
            color: '#fff',
            border: '2px solid #78CADC',
            fontFamily: '"Poppins", sans-serif'
          }
        }}
      />
    </Container>
  );
};

export default AddDeveloperPage;