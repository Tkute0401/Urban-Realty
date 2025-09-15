'use client'

import { Box, Typography } from '@mui/material';
import FavoritesGrid from '../../../components/user/FavoritesGrid';
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
        <FavoritesGrid items={favorites} onView={handleViewProperty} />
      )}
    </Box>
  );
};

export default Favorites;