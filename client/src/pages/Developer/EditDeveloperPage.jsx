import { useState, useRef, useEffect } from 'react';
import { useDevelopers } from '../../context/DevelopersContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
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
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Styled components
const PremiumPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#0B1011',
  color: '#fff',
  borderRadius: '16px',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
  border: `2px solid #78CADC`,
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
    background: 'linear-gradient(90deg, #78CADC 0%, #0B1011 100%)',
  }
}));

const PremiumButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#78CADC',
  color: '#0B1011',
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

const EditDeveloperPage = () => {
  const { updateDeveloper, loading, error, clearErrors } = useDevelopers();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
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
  
  const [formErrors, setFormErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [teamPhotoPreviews, setTeamPhotoPreviews] = useState([]);
  const [teamPhotoFiles, setTeamPhotoFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoadingDeveloper, setIsLoadingDeveloper] = useState(true);
  const logoInputRef = useRef(null);
  const teamPhotoInputRef = useRef(null);

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const response = await axios.get(`/api/v1/developers/${id}`);
        const developer = response.data.data || response.data;
        
        // Set form data with the fetched developer
        setFormData({
          name: developer.name || '',
          description: developer.description || '',
          website: developer.website || '',
          foundedYear: developer.foundedYear || '',
          headquarters: developer.headquarters || {
            city: '',
            state: '',
            country: 'India'
          },
          completedProjects: developer.completedProjects || 0,
          ongoingProjects: developer.ongoingProjects || 0,
          upcomingProjects: developer.upcomingProjects || 0,
          flagshipProjects: developer.flagshipProjects?.length > 0 
            ? developer.flagshipProjects 
            : [{ name: '', description: '' }],
          team: developer.team?.length > 0 
            ? developer.team 
            : [{ name: '', designation: '' }],
          specializations: developer.specializations?.length > 0 
            ? developer.specializations 
            : [{ name: '', description: '' }],
          contact: developer.contact || {
            email: '',
            phone: ''
          },
          socialMedia: developer.socialMedia || {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: ''
          },
          awards: developer.awards?.length > 0 
            ? developer.awards 
            : [{ name: '', year: '', category: '' }]
        });

        // Set logo preview if exists
        if (developer.logo?.url) {
          setLogoPreview(developer.logo.url);
        }

        setIsLoadingDeveloper(false);
      } catch (err) {
        console.error('Error fetching developer:', err);
        setSnackbarMessage(err.response?.data?.message || 'Failed to fetch developer');
        setSnackbarOpen(true);
        setIsLoadingDeveloper(false);
      }
    };

    fetchDeveloper();
  }, [id]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarOpen(true);
    }
  }, [error]);

  const validateForm = () => {
    const errors = {};
    
    // Basic information
    if (!formData.name.trim()) errors.name = 'Developer name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    
    // Contact validation
    if (formData.contact.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.contact.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    // Website validation
    if (formData.website && !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(formData.website)) {
      errors.website = 'Please enter a valid URL';
    }
    
    // Year validation
    if (formData.foundedYear && (formData.foundedYear < 1800 || formData.foundedYear > new Date().getFullYear())) {
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
    
    // Append headquarters as JSON string
    formDataToSend.append('headquarters', JSON.stringify(formData.headquarters));
    
    // Append projects counts
    formDataToSend.append('completedProjects', formData.completedProjects);
    formDataToSend.append('ongoingProjects', formData.ongoingProjects);
    formDataToSend.append('upcomingProjects', formData.upcomingProjects);
    
    // Append arrays as JSON strings
    formDataToSend.append('flagshipProjects', JSON.stringify(formData.flagshipProjects));
    formDataToSend.append('team', JSON.stringify(formData.team));
    formDataToSend.append('specializations', JSON.stringify(formData.specializations));
    
    // Append contact and social media as JSON strings
    formDataToSend.append('contact', JSON.stringify(formData.contact));
    formDataToSend.append('socialMedia', JSON.stringify(formData.socialMedia));
    formDataToSend.append('awards', JSON.stringify(formData.awards));

    // Append logo if exists
    if (logoFile) {
      formDataToSend.append('logo', logoFile);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
    console.log("formDataToSend",formDataToSend);

    const response = await axios.put(`/api/v1/developers/${id}`, formDataToSend, config);
    
    setSnackbarMessage('Developer updated successfully!');
    setSnackbarOpen(true);
    setTimeout(() => navigate('/developers'), 1500);
  } catch (err) {
    console.error('Submission error:', err);
    setSnackbarMessage(err.response?.data?.message || 'Failed to update developer');
    setSnackbarOpen(true);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      setLogoFile(file);
    }
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const handleTeamPhotoChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 files
    const previews = files.map(file => URL.createObjectURL(file));
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

  if (isLoadingDeveloper) {
    return (
      <Container maxWidth="lg" sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)'
      }}>
        <CircularProgress sx={{ color: '#78CADC' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ 
      py: { xs: 2, md: 3 },
      background: 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)',
      minHeight: '100vh'
    }}>
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          maxWidth: 1200, 
          mx: 'auto',
          p: { xs: 1, sm: 2, md: 3 },
          backgroundColor: '#0B1011',
          borderRadius: '16px',
          border: '2px solid #78CADC',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '1.5rem', sm: '2rem' },
            color: '#78CADC',
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700
          }}
        >
          Edit Developer
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

          {/* Flagship Projects Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Flagship Projects</SectionHeader>
            <PremiumPaper>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', mb: 2 }}>
                Add notable projects by this developer
              </Typography>
              
              {formData.flagshipProjects.map((project, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #78CADC', borderRadius: '8px' }}>
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
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={project.description}
                        onChange={(e) => handleFlagshipProjectChange(index, 'description', e.target.value)}
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
                    <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title="Remove project">
                        <IconButton 
                          onClick={() => handleRemoveFlagshipProject(index)}
                          sx={{ color: '#ff6b6b' }}
                        >
                          <Remove />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddFlagshipProject}
                sx={{
                  color: '#78CADC',
                  borderColor: '#78CADC',
                  '&:hover': {
                    borderColor: '#78CADC',
                    backgroundColor: 'rgba(120, 202, 220, 0.1)'
                  }
                }}
              >
                Add Project
              </Button>
            </PremiumPaper>
          </Grid>

          {/* Team Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Team Members</SectionHeader>
            <PremiumPaper>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', mb: 2 }}>
                Add key team members
              </Typography>
              
              {formData.team.map((member, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #78CADC', borderRadius: '8px' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
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
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Designation"
                        value={member.designation}
                        onChange={(e) => handleTeamMemberChange(index, 'designation', e.target.value)}
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
                    <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title="Remove member">
                        <IconButton 
                          onClick={() => handleRemoveTeamMember(index)}
                          sx={{ color: '#ff6b6b' }}
                        >
                          <Remove />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddTeamMember}
                sx={{
                  color: '#78CADC',
                  borderColor: '#78CADC',
                  '&:hover': {
                    borderColor: '#78CADC',
                    backgroundColor: 'rgba(120, 202, 220, 0.1)'
                  }
                }}
              >
                Add Team Member
              </Button>
            </PremiumPaper>
          </Grid>

          {/* Team Photos Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Team Photos</SectionHeader>
            <PremiumPaper>
              <FormHelperText sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                Upload team photos (up to 5 images)
              </FormHelperText>
              
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2, 
                mb: 2,
                maxHeight: 300,
                overflowY: 'auto'
              }}>
                {teamPhotoPreviews.map((preview, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={preview}
                      alt={`Team Photo Preview ${index}`}
                      sx={{ 
                        width: 120, 
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #78CADC'
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveTeamPhoto(index)}
                      sx={{ 
                        position: 'absolute', 
                        top: 4, 
                        right: 4, 
                        color: 'white', 
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.7)'
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
                disabled={teamPhotoPreviews.length >= 5}
                sx={{
                  backgroundColor: '#78CADC',
                  color: '#0B1011',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#5fb4c9'
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(120, 202, 220, 0.5)'
                  }
                }}
              >
                Upload Team Photos
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleTeamPhotoChange}
                  ref={teamPhotoInputRef}
                  disabled={teamPhotoPreviews.length >= 5}
                />
              </Button>
            </PremiumPaper>
          </Grid>

          {/* Specializations Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Specializations</SectionHeader>
            <PremiumPaper>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', mb: 2 }}>
                Add areas of specialization
              </Typography>
              
              {formData.specializations.map((spec, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #78CADC', borderRadius: '8px' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Specialization"
                        value={spec.name}
                        onChange={(e) => handleSpecializationChange(index, 'name', e.target.value)}
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
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={spec.description}
                        onChange={(e) => handleSpecializationChange(index, 'description', e.target.value)}
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
                    <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title="Remove specialization">
                        <IconButton 
                          onClick={() => handleRemoveSpecialization(index)}
                          sx={{ color: '#ff6b6b' }}
                        >
                          <Remove />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddSpecialization}
                sx={{
                  color: '#78CADC',
                  borderColor: '#78CADC',
                  '&:hover': {
                    borderColor: '#78CADC',
                    backgroundColor: 'rgba(120, 202, 220, 0.1)'
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

          {/* Social Media Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Social Media</SectionHeader>
            <PremiumPaper>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Facebook"
                    name="socialMedia.facebook"
                    value={formData.socialMedia.facebook}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: '#78CADC' }}>
                          <Facebook />
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
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Twitter"
                    name="socialMedia.twitter"
                    value={formData.socialMedia.twitter}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: '#78CADC' }}>
                          <Twitter />
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
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="LinkedIn"
                    name="socialMedia.linkedin"
                    value={formData.socialMedia.linkedin}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: '#78CADC' }}>
                          <LinkedIn />
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
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Instagram"
                    name="socialMedia.instagram"
                    value={formData.socialMedia.instagram}
                    onChange={handleChange}
                    size={isMobile ? 'small' : 'medium'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: '#78CADC' }}>
                          <Instagram />
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

          {/* Awards Section */}
          <Grid item xs={12}>
            <SectionHeader variant="h6">Awards & Recognitions</SectionHeader>
            <PremiumPaper>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', mb: 2 }}>
                Add awards and recognitions received by the developer
              </Typography>
              
              {formData.awards.map((award, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #78CADC', borderRadius: '8px' }}>
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
                    <Grid item xs={12} sm={3}>
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
                        label="Category"
                        value={award.category}
                        onChange={(e) => handleAwardChange(index, 'category', e.target.value)}
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
                    <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title="Remove award">
                        <IconButton 
                          onClick={() => handleRemoveAward(index)}
                          sx={{ color: '#ff6b6b' }}
                        >
                          <Remove />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddAward}
                sx={{
                  color: '#78CADC',
                  borderColor: '#78CADC',
                  '&:hover': {
                    borderColor: '#78CADC',
                    backgroundColor: 'rgba(120, 202, 220, 0.1)'
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
                {(loading || isSubmitting) ? 'Updating Developer...' : 'Update Developer'}
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
                onClick={() => navigate('/developers')}
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

export default EditDeveloperPage;