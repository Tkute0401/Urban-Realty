'use client'

import React from 'react';
import { Box, Typography } from '@mui/material';

export default function MapTestPage() {
  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Map Test Page
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Map test components have been removed. Maps are now integrated directly into the main application.
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Visit the Properties page to see the working maps.
      </Typography>
    </Box>
  );
}