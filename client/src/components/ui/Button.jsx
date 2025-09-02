import React from 'react';
import MuiButton from '@mui/material/Button';

export function Button({ variant = 'contained', color = 'primary', children, ...props }) {
  return (
    <MuiButton variant={variant} color={color} {...props}>
      {children}
    </MuiButton>
  );
}

