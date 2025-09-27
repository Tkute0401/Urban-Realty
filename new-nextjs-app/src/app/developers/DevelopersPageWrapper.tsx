'use client'

import React, { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';
import DeveloperList from './DeveloperList';

function DevelopersLoading() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
      <CircularProgress sx={{ color: 'var(--color-primary)' }} />
    </Box>
  );
}

export default function DevelopersPageWrapper() {
  return (
    <Suspense fallback={<DevelopersLoading />}>
      <DeveloperList />
    </Suspense>
  );
}