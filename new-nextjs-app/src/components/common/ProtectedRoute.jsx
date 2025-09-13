'use client'

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && requiredRole && user.role !== requiredRole) {
      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'agent':
          router.push('/agent');
          break;
        default:
          router.push('/');
          break;
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ bgcolor: 'var(--color-bg-primary)' }}
      >
        <CircularProgress sx={{ color: 'var(--color-primary)' }} />
      </Box>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (requiredRole && user.role !== requiredRole) {
    return null; // Will redirect to appropriate dashboard
  }

  return children;
};

export default ProtectedRoute;