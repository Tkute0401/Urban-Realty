'use client';

import { Box, Typography, Grid, Paper, Stack, Chip } from '@mui/material';
import { 
  CalendarToday, 
  Construction, 
  Home, 
  Security 
} from '@mui/icons-material';
import SectionHeader from './SectionHeader';

interface Property {
  _id: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    locality: string;
    country: string;
  };
}

interface PropertyMoreInfoProps {
  property: Property;
}

const PropertyMoreInfo = ({ property }: PropertyMoreInfoProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const infoItems = [
    {
      icon: <CalendarToday />,
      label: 'Listed On',
      value: formatDate(property.createdAt),
      color: 'primary.main'
    },
    {
      icon: <CalendarToday />,
      label: 'Last Updated',
      value: formatDate(property.updatedAt),
      color: 'info.main'
    },
    {
      icon: <Home />,
      label: 'Property ID',
      value: property._id.slice(-8).toUpperCase(),
      color: 'secondary.main'
    },
    {
      icon: <Security />,
      label: 'Status',
      value: property.status,
      color: property.status === 'For Sale' ? 'success.main' : 'warning.main'
    }
  ];

  return (
    <Box>
      <SectionHeader 
        title="Additional Information" 
        subtitle="More details about this property listing"
      />
      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          {infoItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                p: 2,
                borderRadius: 1,
                backgroundColor: 'grey.50',
                height: '100%'
              }}>
                <Box sx={{ color: item.color }}>
                  {item.icon}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {item.label}
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.dark">
            <strong>Note:</strong> This property has been viewed {property.views} times. 
            Contact the agent for the most up-to-date information and to schedule a viewing.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default PropertyMoreInfo;
