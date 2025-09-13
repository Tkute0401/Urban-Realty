'use client'

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  MenuItem, 
  Alert,
  Paper
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    mobile: '',
    occupation: '',
    reraId: '',
    professionalInfo: {
      licenseNumber: '',
      yearsOfExperience: '',
      specializations: [],
      certifications: [],
      businessName: '',
      businessAddress: '',
      businessPhone: '',
      businessWebsite: ''
    }
  });
  
  const { register, error, clearError, loading } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfessionalInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        [field]: value
      }
    }));
  };

  const handleSpecializationChange = (value) => {
    setFormData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        specializations: value.split(',').map(item => item.trim()).filter(item => item)
      }
    }));
  };

  const handleCertificationChange = (value) => {
    setFormData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        certifications: value.split(',').map(item => item.trim()).filter(item => item)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const { success } = await register(formData);
    if (success) {
      router.push('/');
    }
  };

  // Reusable styles for all TextFields
  const textFieldStyles = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'var(--color-bg-dark)',
      color: 'var(--color-text-inverse)',
      '& fieldset': {
        borderColor: 'var(--color-primary)',
      },
      '&:hover fieldset': {
        borderColor: 'var(--color-primary)',
      },
      '&.Mui-focused': {
        backgroundColor: 'var(--color-bg-dark)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--color-primary)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'var(--color-text-inverse)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'var(--color-text-inverse)',
    },
    input: {
      color: 'var(--color-text-inverse)',
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, border: "1px solid var(--color-primary)", bgcolor: "var(--color-bg-dark)", color: "var(--color-text-inverse)" }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join Urban Realty as buyer, individual seller, agent, or developer
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                inputProps={{ minLength: 6 }}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                helperText="What do you do?"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Account Type"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                sx={textFieldStyles}
              >
                <MenuItem value="buyer">Buyer</MenuItem>
                <MenuItem value="individual_seller">Individual Seller</MenuItem>
                <MenuItem value="agent">Agent</MenuItem>
                <MenuItem value="developer">Developer</MenuItem>
              </TextField>
            </Grid>

            {/* Professional Information + RERA - for agent/developer */}
            {['agent', 'developer'].includes(formData.role) && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 2, color: 'var(--color-primary)' }}>
                    Professional Information (RERA for India)
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="RERA ID"
                    name="reraId"
                    value={formData.reraId}
                    onChange={handleChange}
                    required
                    helperText="Required for Agents and Developers"
                    sx={textFieldStyles}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="License Number"
                    value={formData.professionalInfo.licenseNumber}
                    onChange={(e) => handleProfessionalInfoChange('licenseNumber', e.target.value)}
                    sx={textFieldStyles}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Years of Experience"
                    type="number"
                    value={formData.professionalInfo.yearsOfExperience}
                    onChange={(e) => handleProfessionalInfoChange('yearsOfExperience', e.target.value)}
                    sx={textFieldStyles}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Specializations (comma-separated)"
                    value={formData.professionalInfo.specializations.join(', ')}
                    onChange={(e) => handleSpecializationChange(e.target.value)}
                    helperText="e.g., Residential, Commercial, Luxury"
                    sx={textFieldStyles}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Certifications (comma-separated)"
                    value={formData.professionalInfo.certifications.join(', ')}
                    onChange={(e) => handleCertificationChange(e.target.value)}
                    helperText="e.g., Licensed Real Estate Agent, Interior Design Certification"
                    sx={textFieldStyles}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Business Name"
                    value={formData.professionalInfo.businessName}
                    onChange={(e) => handleProfessionalInfoChange('businessName', e.target.value)}
                    sx={textFieldStyles}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Business Address"
                    value={formData.professionalInfo.businessAddress}
                    onChange={(e) => handleProfessionalInfoChange('businessAddress', e.target.value)}
                    sx={textFieldStyles}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Business Phone"
                    value={formData.professionalInfo.businessPhone}
                    onChange={(e) => handleProfessionalInfoChange('businessPhone', e.target.value)}
                    sx={textFieldStyles}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Business Website"
                    value={formData.professionalInfo.businessWebsite}
                    onChange={(e) => handleProfessionalInfoChange('businessWebsite', e.target.value)}
                    sx={textFieldStyles}
                  />
                </Grid>
              </>
            )}
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            startIcon={<PersonAdd />}
            sx={{ mt: 3, mb: 2, py: 1.5, bgcolor: "var(--color-primary)", color: "var(--color-bg-dark)", fontWeight: "bold" }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;