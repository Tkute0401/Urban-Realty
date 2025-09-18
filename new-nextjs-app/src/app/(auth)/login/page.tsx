'use client'

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
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

  const onSubmit = async (values) => {
    clearError();
    await login(values);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, border: "1px solid var(--color-primary)", bgcolor: "var(--color-bg-dark)", color: "var(--color-text-inverse)" }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Login
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
            }}
          />
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
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            sx={{ mt: 3, mb: 2, py: 1.5, bgcolor: "var(--color-primary)" }}
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