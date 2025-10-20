import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  animate?: boolean;
  children: ReactNode;
  className?: string;
}

export function Button({ 
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  animate = true,
  children,
  className,
  disabled,
  ...props
}: ButtonProps): JSX.Element {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Button rendering...', { variant, size, loading });
  }
  
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Button mounted on client side!', { variant, children });
    }
  }, [variant, children]);
  const getVariantStyles = () => {
    const baseStyles = {
      fontWeight: 600,
      textTransform: 'none' as const,
      borderRadius: 'var(--radius-base)',
      transition: 'all 0.2s ease-in-out',
    };

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: 'var(--color-secondary)',
          color: 'var(--color-primary-contrast)',
          '&:hover': {
            backgroundColor: 'var(--color-secondary-dark)',
            boxShadow: 'var(--shadow-lg)',
          },
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          border: '1px solid var(--color-primary)',
          '&:hover': {
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-contrast)',
            boxShadow: 'var(--shadow-lg)',
          },
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: 'var(--color-text)',
          '&:hover': {
            backgroundColor: 'var(--color-surface-elevated)',
          },
        };
      case 'danger':
        return {
          ...baseStyles,
          backgroundColor: 'var(--color-danger)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'var(--color-danger-dark)',
            boxShadow: 'var(--shadow-lg)',
          },
        };
      case 'primary':
      default:
        return {
          ...baseStyles,
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-contrast)',
          '&:hover': {
            backgroundColor: 'var(--color-primary-hover)',
            boxShadow: 'var(--shadow-lg)',
          },
        };
    }
  };

  const buttonContent = (
    <MuiButton
      variant="contained"
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
      endIcon={!loading ? endIcon : undefined}
      sx={{
        ...getVariantStyles(),
        minHeight: { xs: '44px', sm: '40px' }, // Touch target minimum on mobile
        '@media (max-width: 640px)': {
          padding: '12px 20px', // Larger padding on mobile
        },
        '&.Mui-disabled': {
          opacity: 0.6,
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </MuiButton>
  );

  return animate && !disabled ? (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      style={{ display: fullWidth ? 'block' : 'inline-block', width: fullWidth ? '100%' : 'auto' }}
    >
      {buttonContent}
    </motion.div>
  ) : (
    buttonContent
  );
}

export { Button as default };