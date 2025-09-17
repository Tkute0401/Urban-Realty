import React, { ReactNode, HTMLAttributes } from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  sx?: SxProps<Theme>;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: number | string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  sx = {}, 
  variant = 'elevated',
  padding = 2,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-primary)',
        };
      case 'filled':
        return {
          backgroundColor: 'var(--color-bg-secondary)',
          border: 'none',
        };
      case 'elevated':
      default:
        return {
          backgroundColor: 'var(--color-bg-primary)',
          boxShadow: 'var(--shadow-sm)',
          border: 'none',
        };
    }
  };

  return (
    <Box
      sx={{
        borderRadius: 2,
        p: padding,
        height: '100%',
        ...getVariantStyles(),
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Card;