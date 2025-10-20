'use client';

import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import ContactDashboard from '@/components/contact/ContactDashboard';

const ContactManagementPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', color: 'error.main' }}>
          Please log in to access contact management
        </Typography>
      </Container>
    );
  }

  const getUserRole = () => {
    if (user.role === 'admin') return 'admin';
    if (user.role === 'agent') return 'agent';
    if (user.role === 'developer') return 'developer';
    return 'agent'; // default fallback
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'var(--color-bg)',
      py: 4
    }}>
      <Container maxWidth="xl">
        <Paper sx={{ p: 4, borderRadius: '16px' }}>
          <ContactDashboard 
            userRole={getUserRole() as 'agent' | 'developer' | 'admin'}
            userId={user.id || (user as any)?._id}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default ContactManagementPage;
