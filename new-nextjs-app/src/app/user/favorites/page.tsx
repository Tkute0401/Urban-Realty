'use client'

import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import apiService from '@/lib/services/apiService';

const Favorites = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await apiService.getFavorites() as { data: any };
        const items = Array.isArray(res?.data?.data) ? res.data.data : (res?.data || []);
        setFavorites(items);
      } catch (_) {
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, [user]);

  const handleViewProperty = (propertyId: number) => {
    router.push(`/properties/${propertyId}`);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 4,
      px: 2,
      backgroundColor: '#0B1011',
      color: 'white'
    }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', color: '#78CADC' }}>
        Your Favorite Properties
      </Typography>
      
      {loading ? (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          Loading...
        </Typography>
      ) : favorites.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          You haven't saved any properties yet.
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ px: 2 }}>
          {favorites.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property._id || property.id}>
              <Card sx={{ 
                backgroundColor: '#1a2a32',
                border: '1px solid #78CADC',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={property.images?.[0]?.url || property.image || '/placeholder-property.jpg'}
                  alt={property.title || property.location}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {property.title || property.location}
                  </Typography>
                  <Typography variant="h6" color="#78CADC">
                    {property.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {property.location?.address || property.location}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    sx={{ color: '#78CADC' }}
                    onClick={() => handleViewProperty(property._id || property.id)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Favorites;