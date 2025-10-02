'use client';

import { Paper, Box, Typography, Button } from '@mui/material';
import { Star } from '@mui/icons-material';

interface PremiumPaperProps {
  children: React.ReactNode;
  title?: string;
  onUpgrade?: () => void;
}

const PremiumPaper = ({ children, title, onUpgrade }: PremiumPaperProps) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        position: 'relative',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
        background: 'rgba(255,255,255,0.1)',
        clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%)',
        zIndex: 0
      }} />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {title && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Star sx={{ color: '#ffd700' }} />
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
          </Box>
        )}
        
        {children}
        
        {onUpgrade && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={onUpgrade}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                }
              }}
            >
              Upgrade to Premium
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default PremiumPaper;
