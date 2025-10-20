'use client';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { pulse } from '@/lib/animations';

const PremiumButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-text-inverse)',
  fontWeight: 600,
  padding: theme.spacing(1.8, 4),
  borderRadius: '12px',
  fontFamily: '"Poppins", sans-serif',
  textTransform: 'none',
  fontSize: '1rem',
  letterSpacing: '0.5px',
  '&:hover': {
    backgroundColor: 'var(--color-primary-hover)',
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 12px rgba(var(--color-primary-rgb), 0.4)',
    animation: `${pulse} 1.5s infinite`
  },
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  boxShadow: '0 4px 8px rgba(var(--color-primary-rgb), 0.2)',
}));

export default PremiumButton;
