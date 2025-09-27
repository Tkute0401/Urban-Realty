'use client'

import { CircularProgress, Box } from '@mui/material';

export default function PropertiesLoading() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
      <CircularProgress sx={{ color: 'var(--color-primary)' }} />
    </Box>
  );
}