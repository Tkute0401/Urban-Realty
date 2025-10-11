'use client'

import React, { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';
import ProjectList from './ProjectList';

function ProjectsLoading() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
      <CircularProgress sx={{ color: 'var(--color-primary)' }} />
    </Box>
  );
}

export default function ProjectsPageWrapper() {
  return (
    <Suspense fallback={<ProjectsLoading />}>
      <ProjectList />
    </Suspense>
  );
}
