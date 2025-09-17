import React, { ReactNode } from 'react';
import { Box, Typography, SxProps, Theme, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Card from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  sx?: SxProps<Theme>;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
  sx = {}
}) => {
  const theme = useTheme();
  
  const getColorStyles = () => {
    return theme.palette[color]?.main || theme.palette.primary.main;
  };

  return (
    <Card variant="elevated" sx={sx}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            gutterBottom
            sx={{ fontSize: '0.875rem' }}
          >
            {title}
          </Typography>
          
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              color: 'text.primary',
              mb: 0.5
            }}
          >
            {value}
          </Typography>
          
          {subtitle && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: '0.75rem' }}
            >
              {subtitle}
            </Typography>
          )}
          
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: trend.isPositive ? 'var(--color-success)' : 'var(--color-error)',
                  fontWeight: 'medium'
                }}
              >
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </Typography>
            </Box>
          )}
        </Box>
        
        {icon && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: alpha(getColorStyles(), 0.12),
              color: getColorStyles(),
              ml: 2
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default StatCard;