import React, { ReactNode } from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  Chip,
  OutlinedInput,
  Box,
} from '@mui/material';
import { motion } from 'framer-motion';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number | (string | number)[];
  onChange: (value: string | number | (string | number)[]) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  fullWidth?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  animate?: boolean;
  searchable?: boolean;
  clearable?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  label,
  placeholder,
  error = false,
  helperText,
  size = 'medium',
  variant = 'outlined',
  fullWidth = false,
  multiple = false,
  disabled = false,
  loading = false,
  animate = true,
  searchable = false,
  clearable = false,
}: SelectProps): JSX.Element {
  const getCustomStyles = () => ({
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'var(--color-surface)',
      transition: 'all 0.2s ease-in-out',
      '& fieldset': {
        borderColor: 'var(--color-border)',
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
    '& .MuiSelect-select': {
      color: 'var(--color-text)',
    },
  });

  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  const renderValue = (selected: any) => {
    if (multiple && Array.isArray(selected)) {
      if (selected.length === 0) {
        return <span style={{ color: 'var(--color-text-muted)' }}>{placeholder}</span>;
      }
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selected.map((val) => {
            const option = options.find((opt) => opt.value === val);
            return (
              <Chip
                key={val}
                label={option?.label || val}
                size="small"
                sx={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-contrast)',
                  '& .MuiChip-deleteIcon': {
                    color: 'var(--color-primary-contrast)',
                    '&:hover': {
                      color: 'var(--color-primary-contrast)',
                    },
                  },
                }}
              />
            );
          })}
        </Box>
      );
    }
    
    if (!selected) {
      return <span style={{ color: 'var(--color-text-muted)' }}>{placeholder}</span>;
    }
    
    const option = options.find((opt) => opt.value === selected);
    return option?.label || selected;
  };

  const selectContent = (
    <FormControl 
      fullWidth={fullWidth} 
      error={error}
      size={size}
      disabled={disabled || loading}
      sx={getCustomStyles()}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <MuiSelect
        value={value || (multiple ? [] : '')}
        onChange={handleChange}
        input={variant === 'outlined' ? <OutlinedInput label={label} /> : undefined}
        multiple={multiple}
        renderValue={renderValue}
        displayEmpty
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-base)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(20px)',
              maxHeight: 300,
              '& .MuiMenuItem-root': {
                color: 'var(--color-text)',
                '&:hover': {
                  backgroundColor: 'var(--color-surface-elevated)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-contrast)',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)',
                  },
                },
              },
            },
          },
        }}
      >
        {placeholder && !multiple && (
          <MenuItem value="" disabled>
            <span style={{ color: 'var(--color-text-muted)' }}>{placeholder}</span>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {option.icon}
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && (
        <FormHelperText sx={{ color: error ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );

  return animate ? (
    <motion.div
      whileFocus={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      style={{ width: fullWidth ? '100%' : 'auto' }}
    >
      {selectContent}
    </motion.div>
  ) : (
    selectContent
  );
}

export { Select as default };