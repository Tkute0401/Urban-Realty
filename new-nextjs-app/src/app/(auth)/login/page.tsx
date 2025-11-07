'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  Paper
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import FieldIndicator from '@/components/ui/FieldIndicator';


const Login = () => {
  console.log('🔧 Login Page rendering...');
  
  React.useEffect(() => {
    console.log('🔧 Login Page mounted on client side!');
  }, []);

  const LoginSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters')
  });

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' }
  });

  const { login, error, clearError, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || null;

  const onSubmit = async (values) => {
    clearError();
    await login(values, redirectPath);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4, backgroundColor: 'var(--color-bg)' }}>
      <Paper elevation={3} sx={{ p: 4, border: "1px solid var(--color-primary)", bgcolor: "var(--color-surface)", color: "var(--color-text-primary)" }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
            Login
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 2 }}>
            <FieldIndicator required helperText="Enter your registered email address" />
          </Box>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            required
            {...register('email')}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                '& fieldset': {
                  borderColor: 'var(--color-border)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--color-primary)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'var(--color-surface)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--color-primary)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'var(--color-text-muted)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'var(--color-primary)',
              },
              input: {
                color: 'var(--color-text-primary)',
              }
            }}
          />
          <Box sx={{ mb: 2 }}>
            <FieldIndicator required helperText="Minimum 6 characters" />
          </Box>
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            required
            {...register('password')}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                '& fieldset': {
                  borderColor: 'var(--color-border)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--color-primary)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'var(--color-surface)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--color-primary)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'var(--color-text-muted)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'var(--color-primary)',
              },
              input: {
                color: 'var(--color-text-primary)',
              }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            sx={{ 
              mt: 3, 
              mb: 2, 
              py: 1.5, 
              bgcolor: "var(--color-primary)",
              color: "var(--color-primary-contrast)",
              '&:hover': {
                bgcolor: "var(--color-primary-hover)"
              }
            }}
            disabled={loading || isSubmitting}
          >
            {(loading || isSubmitting) ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;