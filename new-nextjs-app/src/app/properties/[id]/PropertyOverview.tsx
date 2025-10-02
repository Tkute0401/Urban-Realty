'use client';

import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Chip, 
  Divider,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  KingBed, 
  Bathtub, 
  SquareFoot, 
  Apartment,
  Visibility,
  CalendarToday
} from '@mui/icons-material';
import { formatPrice } from '@/lib/utils/format';
import SectionHeader from './SectionHeader';

interface Property {
  _id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  views: number;
  createdAt: string;
  images: Array<{
    url: string;
    publicId: string;
  }>;
}

interface PropertyOverviewProps {
  property: Property;
}

const PropertyOverview = ({ property }: PropertyOverviewProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box>
      <SectionHeader 
        title="Property Overview" 
        subtitle="Essential details about this property"
      />
      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          {/* Property Stats */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <KingBed sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {property.bedrooms}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bedrooms
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Bathtub sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {property.bathrooms}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bathrooms
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <SquareFoot sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {property.area}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sq Ft
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Apartment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {property.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Property Type
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Price and Status */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
                {formatPrice(property.price)}
              </Typography>
              
              <Chip 
                label={property.status}
                color={property.status === 'For Sale' ? 'success' : 'info'}
                sx={{ mb: 2 }}
              />
              
              <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-end' }}>
                <Tooltip title="Property Views">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {property.views} views
                    </Typography>
                  </Box>
                </Tooltip>
                
                <Tooltip title="Listed Date">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(property.createdAt)}
                    </Typography>
                  </Box>
                </Tooltip>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Description */}
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            About This Property
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              lineHeight: 1.7,
              whiteSpace: 'pre-line'
            }}
          >
            {property.description}
          </Typography>
        </Box>

        {/* Image Count */}
        {property.images && property.images.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {property.images.length} photo{property.images.length !== 1 ? 's' : ''} available
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default PropertyOverview;
