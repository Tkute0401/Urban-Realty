'use client';

import React, { useEffect } from 'react';
import { Box, Container, Typography, Button, Card, CardContent, CardMedia, Chip, Stack, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { ArrowForward, Business, LocationOn, CalendarToday, AttachMoney, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useProjects } from '@/contexts/ProjectsContext';
import ProjectCard from '../projects/ProjectCard';
import { motion } from 'framer-motion';

const PopularProjectsSection: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { projects, loading, error, getProjects } = useProjects();

  useEffect(() => {
    // Fetch latest 3 projects
    getProjects({ limit: 3, sort: '-createdAt' });
  }, [getProjects]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Under Construction': return 'warning';
      case 'Planning': return 'info';
      case 'On Hold': return 'error';
      case 'Cancelled': return 'default';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Residential': return 'primary';
      case 'Commercial': return 'secondary';
      case 'Mixed-Use': return 'info';
      case 'Industrial': return 'warning';
      default: return 'default';
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  if (loading) {
    return (
      <Box
        component="section"
        sx={{
          py: 8,
          background: 'var(--color-bg)',
          borderTop: '1px solid var(--color-border)'
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress sx={{ color: 'var(--color-primary)' }} />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        component="section"
        sx={{
          py: 8,
          background: 'var(--color-bg)',
          borderTop: '1px solid var(--color-border)'
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="error">
              Error loading projects
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mt: 1 }}>
              {error}
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      component="section"
      sx={{
        py: 8,
        background: 'var(--color-bg)',
        borderTop: '1px solid var(--color-border)'
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 'bold',
                color: 'var(--color-text-primary)',
                mb: 1,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Popular Projects
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'var(--color-text-muted)',
                maxWidth: 600
              }}
            >
              Discover the latest and most popular development projects
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => router.push('/projects')}
            sx={{
              background: 'var(--color-primary)',
              color: 'var(--color-primary-contrast)',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              '&:hover': {
                background: 'var(--color-primary-hover)',
              }
            }}
          >
            View All Projects
          </Button>
        </Box>

        {projects.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Business sx={{ fontSize: 64, color: 'var(--color-text-muted)', mb: 2 }} />
            <Typography variant="h5" sx={{ color: 'var(--color-text-primary)', mb: 1 }}>
              No Projects Available
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
              No development projects are currently available.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {projects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectCard
                  project={project}
                  showFavoriteButton={true}
                />
              </motion.div>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PopularProjectsSection;
