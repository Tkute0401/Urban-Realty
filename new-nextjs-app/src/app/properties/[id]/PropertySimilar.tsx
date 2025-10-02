'use client';

import { Box, Typography, Paper, Grid, Card, CardMedia, CardContent, Button, Chip } from '@mui/material';
import { KingBed, Bathtub, SquareFoot, LocationOn } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils/format';
import SectionHeader from './SectionHeader';

interface Property {
  _id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  status: string;
  address: {
    locality: string;
    city: string;
  };
  images: Array<{
    url: string;
    publicId: string;
  }>;
  similarProperties?: Property[];
}

interface PropertySimilarProps {
  property: Property;
}

const PropertySimilar = ({ property }: PropertySimilarProps) => {
  const router = useRouter();

  // Mock similar properties - in a real app, this would come from the API
  const similarProperties = property.similarProperties || [
    {
      _id: '1',
      title: 'Modern 3BHK Apartment',
      price: 4500000,
      bedrooms: 3,
      bathrooms: 2,
      area: 1100,
      type: 'Apartment',
      status: 'For Sale',
      address: {
        locality: 'Bandra',
        city: 'Mumbai'
      },
      images: [{ url: '/placeholder-property.jpg', publicId: 'placeholder' }]
    },
    {
      _id: '2',
      title: 'Luxury Villa with Garden',
      price: 12000000,
      bedrooms: 4,
      bathrooms: 3,
      area: 2200,
      type: 'Villa',
      status: 'For Sale',
      address: {
        locality: 'Gurgaon',
        city: 'Gurgaon'
      },
      images: [{ url: '/placeholder-property.jpg', publicId: 'placeholder' }]
    },
    {
      _id: '3',
      title: 'Cozy 2BHK Apartment',
      price: 3500000,
      bedrooms: 2,
      bathrooms: 2,
      area: 900,
      type: 'Apartment',
      status: 'For Sale',
      address: {
        locality: 'Koramangala',
        city: 'Bangalore'
      },
      images: [{ url: '/placeholder-property.jpg', publicId: 'placeholder' }]
    }
  ];

  const handlePropertyClick = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  return (
    <Box>
      <SectionHeader 
        title="Similar Properties" 
        subtitle="Other properties you might be interested in"
      />
      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          {similarProperties.map((similarProperty) => (
            <Grid item xs={12} sm={6} md={4} key={similarProperty._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => handlePropertyClick(similarProperty._id)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={similarProperty.images[0]?.url || '/placeholder-property.jpg'}
                  alt={similarProperty.title}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                    {similarProperty.title}
                  </Typography>
                  
                  <Typography variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
                    {formatPrice(similarProperty.price)}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {similarProperty.address.locality}, {similarProperty.address.city}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <KingBed sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">{similarProperty.bedrooms}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Bathtub sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">{similarProperty.bathrooms}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SquareFoot sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">{similarProperty.area} sq ft</Typography>
                    </Box>
                  </Box>
                  
                  <Chip 
                    label={similarProperty.status}
                    color={similarProperty.status === 'For Sale' ? 'success' : 'info'}
                    size="small"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button variant="outlined" color="primary" size="large">
            View All Similar Properties
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PropertySimilar;
