'use client'

import { Box, Typography, Container, Grid, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { unstable_noStore as noStore } from 'next/cache';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProjectCard from '../../../components/projects/ProjectCard';

const ProjectFavoritesClient = () => {
  // Force dynamic rendering
  noStore();
  
  console.log('🔧 User Project Favorites Page rendering...');
  
  const { user } = useAuth();
  const router = useRouter();

  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/auth/project-favorites?userId=${user._id}`);
        const data = await response.json();
        
        if (data.success) {
          setFavorites(data.data || []);
        } else {
          setError(data.error || 'Failed to load favorites');
        }
      } catch (err) {
        console.error('Error loading project favorites:', err);
        setError('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, [user]);

  const handleFavoriteToggle = (projectId: string, isFavorite: boolean) => {
    // Remove from local state if unfavorited
    if (!isFavorite) {
      setFavorites(prev => prev.filter(project => project._id !== projectId));
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          Please login to view your favorite projects.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ 
          mb: 2, 
          textAlign: 'center', 
          color: 'var(--color-primary)',
          fontWeight: 600
        }}>
          Your Favorite Projects
        </Typography>
        <Typography variant="body1" sx={{ 
          textAlign: 'center', 
          color: 'var(--color-text-secondary)',
          mb: 4
        }}>
          Projects you've saved for later viewing
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress size={40} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : favorites.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: 'var(--color-surface)',
          borderRadius: 2,
          border: '1px solid var(--color-border)'
        }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-secondary)' }}>
            No favorite projects yet
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mb: 3 }}>
            Start exploring projects and add them to your favorites to see them here.
          </Typography>
          <button
            onClick={() => router.push('/projects')}
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-contrast)',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Browse Projects
          </button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <ProjectCard
                project={project}
                showFavoriteButton={true}
                onFavoriteToggle={handleFavoriteToggle}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProjectFavoritesClient;
