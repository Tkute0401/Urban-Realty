'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { unstable_noStore as noStore } from 'next/cache';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
  Grid,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Save, Cancel } from '@mui/icons-material';
import { api } from '@/lib/services/api';
import FieldIndicator from '@/components/ui/FieldIndicator';

const ProfileCard = styled(Paper)(({ theme }) => ({
  maxWidth: 800,
  margin: 'auto',
  padding: theme.spacing(4),
  backgroundColor: 'var(--color-bg-dark)',
  color: 'var(--color-text-inverse)',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  border: `2px solid var(--color-primary)`,
  fontFamily: '"Poppins", sans-serif',
}));

const ProfileButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-bg-dark)',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  borderRadius: '8px',
  fontFamily: '"Poppins", sans-serif',
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: 'var(--color-primary-hover)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(120, 202, 220, 0.3)',
  },
  transition: 'all 0.3s ease',
}));

const EditProfileClient = () => {
  // Force dynamic rendering
  noStore();
  
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    occupation: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        occupation: user.occupation || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.auth.updateProfile(formData);
      if (response.success) {
        updateUser(formData);
        setMessage('Profile updated successfully!');
        setTimeout(() => {
          router.push('/user/profile');
        }, 2000);
      } else {
        setError('Failed to update profile');
      }
    } catch (err: any) {
      const { extractErrorMessage } = await import('@/lib/utils/extractErrorMessage');
      const errorMessage = extractErrorMessage(err, 'Failed to update profile');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/user/profile');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      py: 8,
      px: 2,
      background: 'linear-gradient(to bottom, var(--color-bg-dark) 0%, var(--color-bg-secondary) 100%)',
      fontFamily: '"Poppins", sans-serif'
    }}>
      <ProfileCard elevation={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              border: '3px solid var(--color-primary)',
              boxShadow: '0 4px 20px rgba(120, 202, 220, 0.4)',
            }}
          />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Edit Profile
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
              Update your personal information
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FieldIndicator required helperText="Your full legal name" />
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'var(--color-primary)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-primary)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FieldIndicator required helperText="Cannot be changed after registration" />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
                disabled
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-muted)',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'var(--color-text-muted)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-border)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FieldIndicator optional helperText="For better communication" />
              <TextField
                fullWidth
                label="Phone Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'var(--color-primary)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-primary)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FieldIndicator optional helperText="Your profession or job title" />
              <TextField
                fullWidth
                label="Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'var(--color-primary)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-primary)',
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{
            display: 'flex',
            gap: 2,
            mt: 4,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <ProfileButton
              type="submit"
              disabled={loading}
              startIcon={<Save />}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </ProfileButton>

            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
              sx={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                '&:hover': {
                  borderColor: 'var(--color-primary-hover)',
                  backgroundColor: 'rgba(120, 202, 220, 0.1)',
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </ProfileCard>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
      >
        <Alert onClose={() => setMessage('')} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProfileClient;
