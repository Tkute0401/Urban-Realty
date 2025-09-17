import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { IconButton as MuiIconButton, Tooltip, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  children: ReactNode;
  tooltip?: string;
  loading?: boolean;
  variant?: 'default' | 'favorite' | 'action';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  animate?: boolean;
  'aria-label'?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  tooltip,
  loading = false,
  variant = 'default',
  size = 'medium',
  color = 'primary',
  animate = true,
  disabled,
  onClick,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'favorite':
        return {
          color: 'var(--color-error)',
          '&:hover': {
            backgroundColor: 'var(--color-error-light)',
            transform: 'scale(1.1)',
          },
        };
      case 'action':
        return {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-white)',
          '&:hover': {
            backgroundColor: 'var(--color-primary-dark)',
            transform: 'translateY(-2px)',
          },
        };
      case 'default':
      default:
        return {
          color: `var(--color-${color})`,
          '&:hover': {
            backgroundColor: `var(--color-${color}-light)`,
          },
        };
    }
  };

  const buttonContent = (
    <MuiIconButton
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      sx={{
        ...getVariantStyles(),
        transition: 'all 0.2s ease-in-out',
        position: 'relative',
      }}
      {...props}
    >
      {loading ? (
        <CircularProgress size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
      ) : (
        children
      )}
    </MuiIconButton>
  );

  const animatedButton = animate ? (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      <MuiIconButton
        size={size}
        disabled={disabled || loading}
        onClick={onClick}
        sx={{
          ...getVariantStyles(),
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
          '&:hover': {
            ...getVariantStyles()['&:hover'],
            transform: 'none', // Remove conflicting transform
          },
        }}
        aria-label={props['aria-label'] || tooltip || 'Icon button'}
        {...props}
      >
        {loading ? (
          <CircularProgress size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
        ) : (
          children
        )}
      </MuiIconButton>
    </motion.div>
  ) : (
    <MuiIconButton
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      sx={getVariantStyles()}
      aria-label={props['aria-label'] || tooltip || 'Icon button'}
      {...props}
    >
      {loading ? (
        <CircularProgress size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
      ) : (
        children
      )}
    </MuiIconButton>
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow>
      {animatedButton}
    </Tooltip>
  ) : (
    animatedButton
  );
};

export default IconButton;