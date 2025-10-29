'use client';

import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Star, Info } from '@mui/icons-material';

interface FieldIndicatorProps {
  required?: boolean;
  optional?: boolean;
  helperText?: string;
  className?: string;
}

const FieldIndicator: React.FC<FieldIndicatorProps> = ({
  required = false,
  optional = false,
  helperText,
  className = ''
}) => {
  if (required) {
    return (
      <Box className={`flex items-center gap-1 ${className}`}>
        <Star 
          sx={{ 
            fontSize: 12, 
            color: 'var(--color-error)', // Use CSS variable for theme-aware colors
            verticalAlign: 'middle'
          }} 
        />
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'var(--color-error)', // Use CSS variable for theme-aware colors
            fontWeight: 500,
            fontSize: '0.75rem'
          }}
        >
          Required
        </Typography>
        {helperText && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'var(--color-text-muted)', // Use CSS variable for theme-aware colors
              fontSize: '0.75rem',
              ml: 1
            }}
          >
            {helperText}
          </Typography>
        )}
      </Box>
    );
  }

  if (optional) {
    return (
      <Box className={`flex items-center gap-1 ${className}`}>
        <Chip
          label="Optional"
          size="small"
          variant="outlined"
          sx={{
            height: 20,
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)', // Use CSS variable for theme-aware colors
            borderColor: 'var(--color-border)', // Use CSS variable for theme-aware colors
            backgroundColor: 'var(--color-surface)', // Use CSS variable for theme-aware colors
            '& .MuiChip-label': {
              padding: '0 6px'
            }
          }}
        />
        {helperText && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'var(--color-text-muted)', // Use CSS variable for theme-aware colors
              fontSize: '0.75rem',
              ml: 1
            }}
          >
            {helperText}
          </Typography>
        )}
      </Box>
    );
  }

  return null;
};

export default FieldIndicator;
