'use client';

import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
import { Check } from '@mui/icons-material';
import SectionHeader from './SectionHeader';

interface Property {
  highlights: string[];
}

interface PropertyHighlightsProps {
  property: Property;
}

const PropertyHighlights = ({ property }: PropertyHighlightsProps) => {
  if (!property.highlights || property.highlights.length === 0) {
    return null;
  }

  return (
    <Box>
      <SectionHeader 
        title="Property Highlights" 
        subtitle="Key features that make this property special"
      />
      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          {property.highlights.map((highlight, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Check sx={{ color: 'success.main', fontSize: 20 }} />
                <Typography variant="body1">
                  {highlight}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default PropertyHighlights;
