'use client';

import { Button, Box, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';

interface PremiumButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const PremiumButton = ({ 
  onClick, 
  children = 'Premium Feature', 
  variant = 'contained',
  size = 'medium',
  fullWidth = false
}: PremiumButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={onClick}
      sx={{
        background: variant === 'contained' 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'transparent',
        color: variant === 'contained' ? 'white' : 'primary.main',
        border: variant === 'outlined' 
          ? '2px solid #667eea' 
          : 'none',
        '&:hover': {
          background: variant === 'contained'
            ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
            : 'rgba(102, 126, 234, 0.1)',
          transform: 'translateY(-1px)',
          boxShadow: 2
        },
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Star sx={{ fontSize: 16 }} />
        <Typography variant="inherit" fontWeight="bold">
          {children}
        </Typography>
      </Box>
    </Button>
  );
};

export default PremiumButton;
