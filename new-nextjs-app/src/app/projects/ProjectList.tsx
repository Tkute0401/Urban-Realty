'use client'

import React, { useEffect, useState } from 'react';
import { useProjects } from '../../contexts/ProjectsContext';
import { useAuth } from '../../contexts/AuthContext';
import { unstable_noStore as noStore } from 'next/cache';
import { useRouter } from 'next/navigation';
import { 
  Box, Grid, Typography, CircularProgress, Button, 
  Container, Card, CardContent, CardMedia, Chip,
  Stack, useMediaQuery, useTheme, IconButton, Tooltip,
  Drawer, TextField, FormControl, InputLabel, Select, MenuItem, Paper
} from '@mui/material';
import { 
  Add, Business, LocationOn, CalendarToday, 
  Visibility, Edit, Delete, MoreVert, Map as MapIcon, MyLocation,
  FilterList, Close, ViewList, Search as SearchIcon
} from '@mui/icons-material';
import ProjectsMap from '../../components/projects/ProjectsMap';
import ProjectCard from '../../components/projects/ProjectCard';
import SearchAutocomplete from '../../components/property/SearchAutocomplete';
import { useLocation } from '../../hooks/useLocation';
import { 
  Drawer, 
  TextField, 
  Chip, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Button,
  Paper,
  Stack
} from '@mui/material';

const ProjectList = () => {
  noStore();
  
  const { projects, myProjects, similarProjects, loading, error, getProjects, getMyProjects, getSimilarProjects, deleteProject } = useProjects();
  const { user } = useAuth();
  const { location: userLocation, loading: locationLoading, error: locationError, requestLocation } = useLocation();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [showMyProjects, setShowMyProjects] = useState(false);
  const [showMap, setShowMap] = useState(!isTablet); // Hide map on mobile/tablet by default
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    state: '',
    status: [] as string[],
    type: [] as string[],
    priceMin: '',
    priceMax: '',
    developer: ''
  });

  const loadProjectsWithFilters = useCallback((filterState: any) => {
    const params: any = {};
    
    if (filterState.search) {
      // Client-side filtering for search
    }
    if (filterState.city) {
      params['location.city'] = filterState.city;
    }
    if (filterState.state) {
      params['location.state'] = filterState.state;
    }
    if (filterState.status && filterState.status.length > 0) {
      params.status = filterState.status.join(',');
    }
    if (filterState.type && filterState.type.length > 0) {
      params.type = filterState.type.join(',');
    }
    if (filterState.priceMin) {
      params.minPrice = Number(filterState.priceMin);
    }
    if (filterState.priceMax) {
      params.maxPrice = Number(filterState.priceMax);
    }
    if (filterState.developer) {
      params.developer = filterState.developer;
    }
    
    if (userLocation) {
      params.userLat = userLocation.latitude;
      params.userLng = userLocation.longitude;
    }
    
    getProjects(params);
  }, [getProjects, userLocation]);

  useEffect(() => {
    if (user?.role === 'developer' || user?.role === 'agent') {
      getMyProjects();
    }
    
    loadProjectsWithFilters(filters);
  }, [user, getMyProjects, filters, loadProjectsWithFilters]);

  // Fetch similar projects when no results are found
  useEffect(() => {
    if (!loading && !showMyProjects && projects.length === 0) {
      console.log('No projects found, fetching similar projects...');
      // Fetch similar projects without filters to get recommendations
      getSimilarProjects({});
    }
  }, [loading, projects.length, showMyProjects, getSimilarProjects]);

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

  // Filter projects client-side
  const filteredProjects = useMemo(() => {
    let result = showMyProjects ? myProjects : projects;
    
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter((project: any) => {
        const name = project.name?.toLowerCase() || '';
        const description = project.description?.toLowerCase() || '';
        const city = project.location?.city?.toLowerCase() || '';
        const state = project.location?.state?.toLowerCase() || '';
        return name.includes(query) || description.includes(query) || city.includes(query) || state.includes(query);
      });
    }
    
    if (filters.status && filters.status.length > 0) {
      result = result.filter((project: any) => filters.status.includes(project.status));
    }
    
    if (filters.type && filters.type.length > 0) {
      result = result.filter((project: any) => filters.type.includes(project.type));
    }
    
    if (filters.priceMin) {
      const minPrice = Number(filters.priceMin);
      result = result.filter((project: any) => project.startingPrice && project.startingPrice >= minPrice);
    }
    
    if (filters.priceMax) {
      const maxPrice = Number(filters.priceMax);
      result = result.filter((project: any) => project.startingPrice && project.startingPrice <= maxPrice);
    }
    
    return result;
  }, [showMyProjects, myProjects, projects, filters]);

  const displayProjects = filteredProjects;
  
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      city: '',
      state: '',
      status: [],
      type: [],
      priceMin: '',
      priceMax: '',
      developer: ''
    });
  };

  const activeFilterCount = [
    filters.city,
    filters.state,
    filters.status.length,
    filters.type.length,
    filters.priceMin,
    filters.priceMax,
    filters.developer
  ].filter(Boolean).length;

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
        {/* Search and Filter Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ flex: 1, minWidth: '250px' }}>
              <SearchAutocomplete
                value={filters.search}
                onChange={(value) => handleFilterChange('search', value)}
                placeholder="Search projects by name, location..."
              />
            </Box>
            
            <Button
              variant="outlined"
              onClick={() => setShowFiltersDrawer(true)}
              startIcon={<FilterList />}
              sx={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Filter
              {activeFilterCount > 0 && (
                <Chip
                  label={activeFilterCount}
                  size="small"
                  sx={{
                    ml: 1,
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    fontSize: '12px',
                    height: '20px'
                  }}
                />
              )}
            </Button>

            <Box sx={{ display: 'flex', gap: 1, border: '1px solid var(--color-border)', borderRadius: '8px', p: 0.5 }}>
              <IconButton
                onClick={() => {
                  setViewMode('list');
                  setShowMap(false);
                }}
                sx={{
                  backgroundColor: viewMode === 'list' ? 'var(--color-primary)' : 'transparent',
                  color: viewMode === 'list' ? 'white' : 'var(--color-text-primary)'
                }}
                title="List View"
              >
                <ViewList />
              </IconButton>
              <IconButton
                onClick={() => {
                  setViewMode('map');
                  setShowMap(true);
                }}
                sx={{
                  backgroundColor: viewMode === 'map' ? 'var(--color-primary)' : 'transparent',
                  color: viewMode === 'map' ? 'white' : 'var(--color-text-primary)'
                }}
                title="Map View"
              >
                <MapIcon />
              </IconButton>
            </Box>

            <IconButton
              onClick={requestLocation}
              disabled={locationLoading}
              sx={{
                backgroundColor: userLocation ? 'var(--color-primary)' : 'var(--color-background-secondary)',
                color: userLocation ? 'white' : 'var(--color-text-muted)'
              }}
              title="Detect my location"
            >
              {locationLoading ? <CircularProgress size={20} /> : <MyLocation />}
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" sx={{ color: 'var(--color-primary)' }}>
              Developer Projects
            </Typography>
          </Box>
          
          {(user?.role === 'developer' || user?.role === 'agent') && (
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
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
            {showMyProjects 
              ? `Your projects (${myProjects.length})` 
              : `Browse all development projects (${projects.length})`
            }
          </Typography>
          {!isTablet && displayProjects.length > 0 && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<MapIcon />}
              onClick={() => setShowMap(!showMap)}
              sx={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                '&:hover': {
                  borderColor: 'var(--color-primary)',
                  bgcolor: 'rgba(120, 202, 220, 0.1)'
                }
              }}
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          )}
        </Box>
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

          {/* Similar Projects Section - Only show when not showing "My Projects" */}
          {!showMyProjects && similarProjects && similarProjects.length > 0 && (
            <Box sx={{ width: '100%', mt: 6 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'var(--color-primary)', 
                  mb: 3,
                  fontWeight: 600,
                  textAlign: 'left'
                }}
              >
                You might also like:
              </Typography>
              
              <Grid container spacing={3}>
                {similarProjects.map((project) => (
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
                        image={typeof project.images?.[0] === 'string' ? project.images[0] : (project.images?.[0]?.url || '/placeholder-project.jpg')}
                        alt={project.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: 'var(--color-text-primary)',
                            fontWeight: 600,
                            lineHeight: 1.2,
                            mb: 1
                          }}
                        >
                          {project.name}
                        </Typography>

                        {/* Location */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn sx={{ fontSize: 16, color: 'var(--color-text-muted)', mr: 0.5 }} />
                          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                            {project.location?.city}, {project.location?.state}
                          </Typography>
                        </Box>

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

                        {/* Price */}
                        {project.startingPrice && (
                          <Typography variant="h6" sx={{ color: 'var(--color-primary)', fontWeight: 600, mb: 2 }}>
                            {formatPrice(project.startingPrice)}
                          </Typography>
                        )}

                        {/* Action Button */}
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => router.push(`/projects/${project._id}`)}
                          sx={{
                            mt: 'auto',
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
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 3, height: showMap ? '600px' : 'auto' }}>
          {/* Projects Grid */}
          <Box sx={{ 
            flex: showMap ? '0 0 50%' : '1', 
            overflow: showMap ? 'auto' : 'visible',
            pr: showMap ? 2 : 0
          }}>
            <Grid container spacing={3}>
              {displayProjects.map((project) => (
                <Grid item xs={12} sm={showMap ? 12 : 6} md={showMap ? 12 : 4} key={project._id}>
                  <ProjectCard
                    project={project}
                    showFavoriteButton={true}
                    sx={{
                      border: selectedProject?._id === project._id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    }}
                  />
            </Grid>
          ))}
            </Grid>
          </Box>

          {/* Map View */}
          {showMap && !isTablet && (
            <Box sx={{ flex: '0 0 50%', position: 'sticky', top: 20, alignSelf: 'flex-start' }}>
              <ProjectsMap
                projects={displayProjects}
                selectedProject={selectedProject}
                userLocation={userLocation}
                onMarkerClick={(project) => {
                  setSelectedProject(project);
                  // Scroll to the project card
                  const element = document.getElementById(`project-${project._id}`);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                height="600px"
              />
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default ProjectList;
