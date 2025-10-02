'use client';

import { Box, Typography, Divider } from '@mui/material';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography 
        variant="h5" 
        component="h2" 
        fontWeight="bold" 
        gutterBottom
        sx={{ color: 'text.primary' }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 2 }}
        >
          {subtitle}
        </Typography>
      )}
      <Divider sx={{ width: 60, height: 3, backgroundColor: 'primary.main' }} />
    </Box>
  );
};

export default SectionHeader;
