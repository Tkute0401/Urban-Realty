'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to login
        router.push('/login?redirect=/admin/blogs');
        return;
      }
      if (user.role !== 'admin') {
        // Not an admin - redirect to homepage
        router.push('/');
        return;
      }
    }
  }, [user, loading, router]);

  // Show loading spinner while checking auth
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

  // Don't render if not authenticated or not admin (will redirect)
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'var(--color-bg-primary)' }}>
      <AdminSidebar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          ml: { xs: 0, md: '240px' }, // Account for sidebar width
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

