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
                <Card
                  onClick={() => router.push(`/projects/${project._id}`)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(var(--color-shadow-rgb), 0.15)',
                      transform: 'translateY(-4px)',
                    }
                  }}
                >
                  {/* Project Image */}
                  <CardMedia
                    component="img"
                    height="200"
                    image={typeof project.images?.[0] === 'string' ? project.images[0] : (project.images?.[0]?.url || '/placeholder-project.jpg')}
                    alt={project.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                    {/* Project Header */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'var(--color-text-primary)',
                        fontWeight: 600,
                        lineHeight: 1.2,
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {project.name}
                    </Typography>

                    {/* Developer Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Business sx={{ fontSize: 16, color: 'var(--color-text-muted)', mr: 0.5 }} />
                      <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                        {project.developer?.name}
                      </Typography>
                    </Box>

                    {/* Location */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn sx={{ fontSize: 16, color: 'var(--color-text-muted)', mr: 0.5 }} />
                      <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                        {project.location?.city}, {project.location?.state}
                      </Typography>
                    </Box>

                    {/* Description */}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'var(--color-text-muted)',
                        mb: 2,
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {project.shortDescription || project.description}
                    </Typography>

                    {/* Status and Type Chips */}
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip 
                        label={project.status} 
                        size="small" 
                        color={getStatusColor(project.status) as any}
                        variant="outlined"
                      />
                      <Chip 
                        label={project.type} 
                        size="small" 
                        color={getTypeColor(project.type) as any}
                        variant="outlined"
                      />
                    </Stack>

                    {/* Price and Stats */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        {project.startingPrice && (
                          <Typography variant="h6" sx={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                            {formatPrice(project.startingPrice)}
                            {project.pricePerSqFt && (
                              <Typography component="span" variant="body2" sx={{ color: 'var(--color-text-muted)', ml: 0.5 }}>
                                /sq ft
                              </Typography>
                            )}
                          </Typography>
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Visibility sx={{ fontSize: 14, color: 'var(--color-text-muted)', mr: 0.5 }} />
                          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                            {project.views || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Action Button */}
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/projects/${project._id}`);
                      }}
                      sx={{
                        borderColor: 'var(--color-primary)',
                        color: 'var(--color-primary)',
                        '&:hover': {
                          borderColor: 'var(--color-primary)',
                          bgcolor: 'var(--color-primary)',
                          color: 'var(--color-primary-contrast)'
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PopularProjectsSection;
