'use client';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { fadeIn } from '@/lib/animations';

const PremiumPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text-primary)',
  borderRadius: '16px',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
  border: `2px solid var(--color-primary)`,
  padding: theme.spacing(4),
  fontFamily: '"Poppins", sans-serif',
  animation: `${fadeIn} 0.6s ease-out forwards`,
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-surface) 100%)',
  }
}));

export default PremiumPaper;
