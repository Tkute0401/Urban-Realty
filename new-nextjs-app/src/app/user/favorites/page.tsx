'use client'

import { Box, Typography } from '@mui/material';
import FavoritesGrid from '../../../components/user/FavoritesGrid';
import { useAuth } from '../../../contexts/AuthContext';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/services/api';

const Favorites = () => {
  console.log('🔧 User Favorites Page rendering...');
  
  const { user } = useAuth();
  const router = useRouter();

  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await api.auth.favoritesList();
        const items = Array.isArray((res as any)?.data?.data) ? (res as any).data.data : (res?.data || []);
        setFavorites(items as any[]);
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
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-text)'
    }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', color: 'var(--color-primary)' }}>
        Your Favorite Properties
      </Typography>
      
      {loading ? (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          Loading...
        </Typography>
      ) : favorites.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          You haven&apos;t saved any properties yet.
        </Typography>
      ) : (
        <FavoritesGrid items={favorites} onView={handleViewProperty} />
      )}
    </Box>
  );
};

export default Favorites;