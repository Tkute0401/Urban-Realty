'use client'

import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Star, Check } from '@mui/icons-material';

interface PropertyHighlightsProps {
  property: any;
  sectionRef?: React.RefObject<HTMLDivElement>;
}

const PropertyHighlights: React.FC<PropertyHighlightsProps> = ({ property, sectionRef }) => {
  // Get highlights from property, filter out empty ones
  const highlights = Array.isArray(property.highlights) 
    ? property.highlights.filter((highlight: string) => highlight && highlight.trim())
    : [];

  // If no highlights, return null or a placeholder
  if (!highlights.length) {
    return (
      <Paper 
        ref={sectionRef}
        id="section-highlights"
        sx={{ 
          p: 3, 
          mb: 4, 
          bgcolor: 'var(--color-surface)', 
          border: '1px solid var(--color-border)',
          borderRadius: 2
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: 'var(--color-primary)', 
            fontWeight: 600,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Star sx={{ color: 'var(--color-primary)' }} />
          Property Highlights
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'var(--color-text-muted)',
            fontStyle: 'italic',
            textAlign: 'center',
            py: 2
          }}
        >
          No specific highlights available for this property.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      ref={sectionRef}
      id="section-highlights"
      sx={{ 
        p: 3, 
        mb: 4, 
        bgcolor: 'var(--color-surface)', 
        border: '1px solid var(--color-border)',
        borderRadius: 2
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          color: 'var(--color-primary)', 
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Star sx={{ color: 'var(--color-primary)' }} />
        Property Highlights
      </Typography>

      <List sx={{ p: 0 }}>
        {highlights.map((highlight: string, index: number) => (
          <ListItem 
            key={index}
            sx={{ 
              px: 0,
              py: 1.5,
              borderBottom: index < highlights.length - 1 ? '1px solid var(--color-border)' : 'none'
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Check 
                sx={{ 
                  color: 'var(--color-success)',
                  backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  borderRadius: '50%',
                  p: 0.5,
                  fontSize: 20
                }} 
              />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'var(--color-text)',
                    fontWeight: 500,
                    lineHeight: 1.5
                  }}
                >
                  {highlight}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>

      {/* Additional styling for featured property */}
      {property.featured && (
        <Box 
          sx={{ 
            mt: 3,
            p: 2,
            borderRadius: 1,
            backgroundColor: 'rgba(247, 107, 28, 0.1)',
            border: '1px solid var(--color-primary)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Star sx={{ color: 'var(--color-primary)', fontSize: 20 }} />
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: 'var(--color-primary)', 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Featured Property
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--color-text)',
              lineHeight: 1.4
            }}
          >
            This property has been marked as featured and offers exceptional value and amenities.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default PropertyHighlights;