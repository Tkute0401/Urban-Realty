'use client'

import React, { useEffect, useState } from 'react';
import { useProjects } from '../../contexts/ProjectsContext';
import { useAuth } from '../../contexts/AuthContext';
import { unstable_noStore as noStore } from 'next/cache';
import { useRouter } from 'next/navigation';
import { 
  Box, Grid, Typography, CircularProgress, Button, 
  Container, Card, CardContent, CardMedia, Chip,
  Stack, useMediaQuery, useTheme, IconButton, Tooltip
} from '@mui/material';
import { 
  Add, Business, LocationOn, CalendarToday, 
  AttachMoney, Visibility, Edit, Delete, MoreVert
} from '@mui/icons-material';

const ProjectList = () => {
  noStore();
  
  const { projects, myProjects, loading, error, getProjects, getMyProjects, deleteProject } = useProjects();
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [showMyProjects, setShowMyProjects] = useState(false);

  useEffect(() => {
    if (user?.role === 'developer') {
      getMyProjects();
    }
    getProjects();
  }, [user, getProjects, getMyProjects]);

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
      } catch (err) {
        console.error('Error deleting project:', err);
      }
    }
  };

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

  const displayProjects = showMyProjects ? myProjects : projects;

  if (loading && displayProjects.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ color: 'var(--color-primary)' }} />
        <Typography variant="h6" sx={{ mt: 2, color: 'var(--color-text-primary)' }}>
          Loading projects...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ color: 'var(--color-primary)' }}>
            Developer Projects
          </Typography>
          
          {user?.role === 'developer' && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={showMyProjects ? 'contained' : 'outlined'}
                onClick={() => setShowMyProjects(true)}
                sx={{
                  borderColor: 'var(--color-primary)',
                  color: showMyProjects ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                  bgcolor: showMyProjects ? 'var(--color-primary)' : 'transparent',
                  '&:hover': {
                    borderColor: 'var(--color-primary)',
                    bgcolor: showMyProjects ? 'var(--color-primary-hover)' : 'var(--color-primary)',
                    color: 'var(--color-primary-contrast)'
                  }
                }}
              >
                My Projects
              </Button>
              <Button
                variant={!showMyProjects ? 'contained' : 'outlined'}
                onClick={() => setShowMyProjects(false)}
                sx={{
                  borderColor: 'var(--color-primary)',
                  color: !showMyProjects ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                  bgcolor: !showMyProjects ? 'var(--color-primary)' : 'transparent',
                  '&:hover': {
                    borderColor: 'var(--color-primary)',
                    bgcolor: !showMyProjects ? 'var(--color-primary-hover)' : 'var(--color-primary)',
                    color: 'var(--color-primary-contrast)'
                  }
                }}
              >
                All Projects
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => router.push('/projects/add')}
                sx={{
                  bgcolor: 'var(--color-primary)',
                  color: 'var(--color-primary-contrast)',
                  '&:hover': {
                    bgcolor: 'var(--color-primary-hover)'
                  }
                }}
              >
                Add Project
              </Button>
            </Box>
          )}
        </Box>
        
        <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
          {showMyProjects 
            ? `Your projects (${myProjects.length})` 
            : `Browse all development projects (${projects.length})`
          }
        </Typography>
      </Box>

      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {displayProjects.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Business sx={{ fontSize: 64, color: 'var(--color-text-muted)', mb: 2 }} />
          <Typography variant="h5" sx={{ color: 'var(--color-text-primary)', mb: 1 }}>
            {showMyProjects ? 'No Projects Yet' : 'No Projects Found'}
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--color-text-muted)', mb: 3 }}>
            {showMyProjects 
              ? 'Start by adding your first development project.'
              : 'No development projects are currently available.'
            }
          </Typography>
          {user?.role === 'developer' && showMyProjects && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push('/projects/add')}
              sx={{
                bgcolor: 'var(--color-primary)',
                color: 'var(--color-primary-contrast)',
                '&:hover': {
                  bgcolor: 'var(--color-primary-hover)'
                }
              }}
            >
              Add Your First Project
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {displayProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                {/* Project Image */}
                <CardMedia
                  component="img"
                  height="200"
                  image={project.images?.[0]?.url || '/placeholder-project.jpg'}
                  alt={project.name}
                  sx={{ objectFit: 'cover' }}
                />
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Project Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'var(--color-text-primary)',
                        fontWeight: 600,
                        lineHeight: 1.2,
                        flex: 1,
                        mr: 1
                      }}
                    >
                      {project.name}
                    </Typography>
                    
                    {user?.role === 'developer' && showMyProjects && (
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit Project">
                          <IconButton 
                            size="small"
                            onClick={() => router.push(`/projects/edit/${project._id}`)}
                            sx={{ color: 'var(--color-primary)' }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Project">
                          <IconButton 
                            size="small"
                            onClick={() => handleDeleteProject(project._id)}
                            sx={{ color: 'var(--color-danger)' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>

                  {/* Developer Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Business sx={{ fontSize: 16, color: 'var(--color-text-muted)', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                      {project.developer?.name}
                    </Typography>
                  </Box>

                  {/* Location */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                          {project.views}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Action Button */}
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => router.push(`/projects/${project._id}`)}
                    sx={{
                      mt: 2,
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
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProjectList;
