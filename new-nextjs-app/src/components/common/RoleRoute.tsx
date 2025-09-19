'use client'

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CircularProgress, Box, Alert } from '@mui/material';

const RoleRoute = ({ 
  children, 
  allowedRoles = [], 
  fallbackPath = '/',
  showAccessDenied = true 
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      if (fallbackPath) {
        router.push(fallbackPath);
      }
    }
  }, [user, loading, allowedRoles, fallbackPath, router]);

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

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (showAccessDenied) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="100vh"
          sx={{ bgcolor: 'var(--color-bg-primary)', p: 3 }}
        >
          <Alert 
            severity="error" 
            sx={{ 
              maxWidth: 400,
              '& .MuiAlert-message': {
                color: 'var(--color-text-primary)'
              }
            }}
          >
            Access denied. You don&apos;t have permission to view this page.
          </Alert>
        </Box>
      );
    }
    return null; // Will redirect to fallback path
  }

  return children;
};

export default RoleRoute;