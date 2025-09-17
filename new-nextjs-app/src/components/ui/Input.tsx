import React, { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { TextField, InputAdornment, FormHelperText, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'> {
  label?: string;
  error?: boolean;
  helperText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  animate?: boolean;
  loading?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error = false,
  helperText,
  startIcon,
  endIcon,
  size = 'medium',
  variant = 'outlined',
  fullWidth = false,
  multiline = false,
  rows,
  animate = true,
  loading = false,
  className,
  disabled,
  ...props
}, ref) => {
  const getCustomStyles = () => ({
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'var(--color-surface)',
      transition: 'all 0.2s ease-in-out',
      '& fieldset': {
        borderColor: 'var(--color-border)',
        borderWidth: 1,
      },
      '&:hover fieldset': {
        borderColor: 'var(--color-primary)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--color-primary)',
        borderWidth: 2,
        boxShadow: `0 0 0 3px rgba(247, 107, 28, 0.1)`,
      },
      '&.Mui-error fieldset': {
        borderColor: 'var(--color-danger)',
      },
      '&.Mui-error.Mui-focused fieldset': {
        borderColor: 'var(--color-danger)',
        boxShadow: `0 0 0 3px rgba(239, 68, 68, 0.1)`,
      },
    },
    '& .MuiFilledInput-root': {
      backgroundColor: 'var(--color-surface-elevated)',
      '&:hover': {
        backgroundColor: 'var(--color-surface-elevated)',
      },
      '&.Mui-focused': {
        backgroundColor: 'var(--color-surface-elevated)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'var(--color-text-muted)',
      '&.Mui-focused': {
        color: 'var(--color-primary)',
      },
      '&.Mui-error': {
        color: 'var(--color-danger)',
      },
    },
    '& .MuiInputBase-input': {
      color: 'var(--color-text)',
      '&::placeholder': {
        color: 'var(--color-text-muted)',
        opacity: 1,
      },
    },
    '& .MuiFormHelperText-root': {
      color: error ? 'var(--color-danger)' : 'var(--color-text-muted)',
    },
  });

  const inputContent = (
    <TextField
      ref={ref}
      label={label}
      error={error}
      helperText={helperText}
      size={size}
      variant={variant}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={rows}
      disabled={disabled || loading}
      InputProps={{
        startAdornment: startIcon && (
          <InputAdornment position="start">
            {startIcon}
          </InputAdornment>
        ),
        endAdornment: endIcon && (
          <InputAdornment position="end">
            {endIcon}
          </InputAdornment>
        ),
      }}
      sx={getCustomStyles()}
      className={className}
      {...props}
    />
  );

  return animate ? (
    <motion.div
      whileFocus={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      style={{ width: fullWidth ? '100%' : 'auto' }}
    >
      {inputContent}
    </motion.div>
  ) : (
    inputContent
  );
});

Input.displayName = 'Input';

export { Input as default };