import React, { ReactNode } from 'react';
import { Badge as MuiBadge, Chip } from '@mui/material';
import { motion } from 'framer-motion';

interface BadgeProps {
  children?: ReactNode;
  content?: string | number;
  variant?: 'dot' | 'standard' | 'chip';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showZero?: boolean;
  max?: number;
  invisible?: boolean;
  animate?: boolean;
  onClick?: () => void;
}

export function Badge({
  children,
  content,
  variant = 'standard',
  color = 'primary',
  size = 'medium',
  position = 'top-right',
  showZero = false,
  max = 99,
  invisible = false,
  animate = true,
  onClick,
}: BadgeProps): JSX.Element {
  const getColorStyles = () => {
    switch (color) {
      case 'secondary':
        return {
          backgroundColor: 'var(--color-secondary)',
          color: 'var(--color-primary-contrast)',
        };
      case 'success':
        return {
          backgroundColor: 'var(--color-success)',
          color: 'white',
        };
      case 'warning':
        return {
          backgroundColor: 'var(--color-warning)',
          color: 'white',
        };
      case 'error':
        return {
          backgroundColor: 'var(--color-danger)',
          color: 'white',
        };
      case 'info':
        return {
          backgroundColor: '#3b82f6',
          color: 'white',
        };
      case 'primary':
      default:
        return {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-contrast)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { minWidth: 16, height: 16, fontSize: '0.65rem' };
      case 'large':
        return { minWidth: 24, height: 24, fontSize: '0.85rem' };
      case 'medium':
      default:
        return { minWidth: 20, height: 20, fontSize: '0.75rem' };
    }
  };

  const getAnchorOrigin = () => {
    const [vertical, horizontal] = position.split('-') as ['top' | 'bottom', 'left' | 'right'];
    return { vertical, horizontal };
  };

  // If variant is chip, render as a standalone chip
  if (variant === 'chip') {
    const chipContent = (
      <Chip
        label={content}
        size={size === 'large' ? 'medium' : 'small'}
        onClick={onClick}
        sx={{
          ...getColorStyles(),
          fontWeight: 600,
          '&:hover': onClick ? {
            filter: 'brightness(0.9)',
          } : undefined,
        }}
      />
    );

    return animate && onClick ? (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15 }}
        style={{ display: 'inline-block' }}
      >
        {chipContent}
      </motion.div>
    ) : (
      chipContent
    );
  }

  // Standard badge with children
  const badgeContent = (
    <MuiBadge
      badgeContent={content}
      color="error" // This will be overridden by sx
      variant={variant}
      anchorOrigin={getAnchorOrigin()}
      showZero={showZero}
      max={max}
      invisible={invisible}
      sx={{
        '& .MuiBadge-badge': {
          ...getColorStyles(),
          ...getSizeStyles(),
          fontWeight: 600,
          border: '2px solid var(--color-surface)',
          animation: animate && !invisible ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)' },
            '100%': { transform: 'scale(1)' },
          },
        },
      }}
    >
      {children}
    </MuiBadge>
  );

  return animate && children ? (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
      style={{ display: 'inline-block' }}
    >
      {badgeContent}
    </motion.div>
  ) : (
    badgeContent
  );
}

export { Badge as default };