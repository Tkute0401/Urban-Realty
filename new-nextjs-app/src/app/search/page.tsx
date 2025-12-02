'use client';

import React, { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  CircularProgress, 
  Alert,
  Container,
  Grid,
  TextField,
  Button,
  Drawer,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Close,
  ViewList,
  Map as MapIcon,
  Layers,
  MyLocation
} from '@mui/icons-material';
import { useProperties } from '@/contexts/PropertiesContext';
import { useProjects } from '@/contexts/ProjectsContext';
import PropertyCard from '@/components/property/PropertyCard';
import ProjectCard from '@/components/projects/ProjectCard';
import SearchAutocomplete from '@/components/property/SearchAutocomplete';
import PropertiesMap from '@/components/property/PropertiesMap';
import PropertyHeatMap from '@/components/property/PropertyHeatMap';
import { useLocation } from '@/hooks/useLocation';
import { useMediaQuery, useTheme } from '@mui/material';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { properties, loading: propertiesLoading, getProperties } = useProperties();
  const { projects, loading: projectsLoading, getProjects } = useProjects();
  const { location: userLocation, loading: locationLoading, requestLocation } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'heatmap'>('list');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    propertyType: searchParams.get('propertyType') || 'ALL',
    type: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [] as string[],
    minArea: '',
    maxArea: '',
    constructionStatus: [] as string[],
    furnished: undefined as boolean | undefined,
    verified: undefined as boolean | undefined,
    hasVirtualTour: undefined as boolean | undefined
  });

  const amenityOptions = [
    'Parking', 'Swimming Pool', 'Gym', 'Security', 'Garden', 'Balcony',
    'WiFi', 'Air Conditioning', 'Furnished', 'Pet Friendly', 'Elevator'
  ];

  const loadPropertiesWithFilters = useCallback((filterState: any) => {
    const params: any = {
      page: 1,
      limit: 50
    };

    if (filterState.search) params.search = filterState.search;
    if (filterState.type) params.type = filterState.type;
    if (filterState.city) params.city = filterState.city;
    
    if (filterState.priceMin && filterState.priceMin.trim() !== '') {
      const minPrice = Number(filterState.priceMin);
      if (!isNaN(minPrice) && minPrice > 0) {
        params.minPrice = minPrice;
      }
    }
    if (filterState.priceMax && filterState.priceMax.trim() !== '') {
      const maxPrice = Number(filterState.priceMax);
      if (!isNaN(maxPrice) && maxPrice > 0) {
        params.maxPrice = maxPrice;
      }
    }
    
    if (filterState.bedrooms) params.bedrooms = Number(filterState.bedrooms);
    if (filterState.bathrooms) params.bathrooms = Number(filterState.bathrooms);
    if (filterState.amenities && Array.isArray(filterState.amenities) && filterState.amenities.length > 0) {
      params.amenities = filterState.amenities.join(',');
    }
    if (filterState.minArea) params.minArea = Number(filterState.minArea);
    if (filterState.maxArea) params.maxArea = Number(filterState.maxArea);
    if (filterState.propertyType !== 'ALL') {
      params.status = filterState.propertyType === 'BUY' ? 'For Sale' : 'For Rent';
    }
    if (filterState.constructionStatus && filterState.constructionStatus.length > 0) {
      params.constructionStatus = filterState.constructionStatus.join(',');
    }
    if (filterState.furnished !== undefined) {
      params.furnished = filterState.furnished;
    }
    if (filterState.verified !== undefined) {
      params.verified = filterState.verified;
    }
    if (filterState.hasVirtualTour !== undefined) {
      params.hasVirtualTour = filterState.hasVirtualTour;
    }

    if (userLocation) {
      params.userLat = userLocation.latitude;
      params.userLng = userLocation.longitude;
    }

    getProperties(params);
  }, [getProperties, userLocation]);

  const loadProjectsWithFilters = useCallback((filterState: any) => {
    const params: any = {};
    if (filterState.search) {
      // Client-side filtering for projects
    }
    if (filterState.city) {
      params['location.city'] = filterState.city;
    }
    getProjects(params);
  }, [getProjects]);

  useEffect(() => {
    loadPropertiesWithFilters(filters);
    loadProjectsWithFilters(filters);
  }, [filters.search, filters.city, filters.propertyType]);

  useEffect(() => {
    setAllProjects(projects);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let result = allProjects;
    
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
    
    return result;
  }, [allProjects, filters.search]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (key === 'search' || key === 'city' || key === 'propertyType') {
      const params = new URLSearchParams();
      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.city) params.set('city', newFilters.city);
      if (newFilters.propertyType && newFilters.propertyType !== 'ALL') {
        params.set('propertyType', newFilters.propertyType);
      }
      router.replace(params.toString() ? `/search?${params.toString()}` : '/search');
    }
    
    if (activeTab === 0) {
      loadPropertiesWithFilters(newFilters);
    } else {
      loadProjectsWithFilters(newFilters);
    }
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      city: '',
      propertyType: 'ALL',
      type: '',
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      minArea: '',
      maxArea: '',
      constructionStatus: [],
      furnished: undefined,
      verified: undefined,
      hasVirtualTour: undefined
    };
    setFilters(clearedFilters);
    loadPropertiesWithFilters(clearedFilters);
    loadProjectsWithFilters(clearedFilters);
  };

  const activeFilterCount = [
    filters.type,
    filters.priceMin,
    filters.priceMax,
    filters.bedrooms,
    filters.bathrooms,
    filters.amenities.length,
    filters.constructionStatus.length,
    filters.furnished !== undefined,
    filters.verified !== undefined,
    filters.hasVirtualTour !== undefined
  ].filter(Boolean).length;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property);
    router.push(`/properties/${property.slug || property._id}`);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-family-sans, "Poppins", sans-serif)'
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search and Filter Bar */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ flex: 1, minWidth: '250px' }}>
              <SearchAutocomplete
                value={filters.search}
                onChange={(value) => handleFilterChange('search', value)}
                placeholder="Search properties or projects..."
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
                onClick={() => setViewMode('list')}
                sx={{
                  backgroundColor: viewMode === 'list' ? 'var(--color-primary)' : 'transparent',
                  color: viewMode === 'list' ? 'white' : 'var(--color-text-primary)'
                }}
                title="List View"
              >
                <ViewList />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('map')}
                sx={{
                  backgroundColor: viewMode === 'map' ? 'var(--color-primary)' : 'transparent',
                  color: viewMode === 'map' ? 'white' : 'var(--color-text-primary)'
                }}
                title="Map View"
              >
                <MapIcon />
              </IconButton>
              {activeTab === 0 && (
                <IconButton
                  onClick={() => setViewMode('heatmap')}
                  sx={{
                    backgroundColor: viewMode === 'heatmap' ? 'var(--color-primary)' : 'transparent',
                    color: viewMode === 'heatmap' ? 'white' : 'var(--color-text-primary)'
                  }}
                  title="Heat Map View"
                >
                  <Layers />
                </IconButton>
              )}
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

          {/* Buy/Rent Toggle */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {['ALL', 'BUY', 'RENT'].map(type => (
              <Button
                key={type}
                variant={filters.propertyType === type ? 'contained' : 'outlined'}
                onClick={() => handleFilterChange('propertyType', type)}
                sx={{
                  backgroundColor: filters.propertyType === type ? 'var(--color-primary)' : 'transparent',
                  color: filters.propertyType === type ? 'white' : 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {type}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Results Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ color: 'var(--color-text-primary)', mb: 1 }}>
            Search Results
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
            {activeTab === 0 
              ? `Found ${properties.length} ${properties.length === 1 ? 'property' : 'properties'}`
              : `Found ${filteredProjects.length} ${filteredProjects.length === 1 ? 'project' : 'projects'}`
            }
            {filters.search && ` for "${filters.search}"`}
            {filters.city && ` in ${filters.city}`}
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: 'var(--color-text-muted)',
                '&.Mui-selected': {
                  color: 'var(--color-primary)'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'var(--color-primary)'
              }
            }}
          >
            <Tab 
              label={`Properties (${properties.length})`} 
              icon={propertiesLoading ? <CircularProgress size={16} /> : undefined}
              iconPosition="end"
            />
            <Tab 
              label={`Projects (${filteredProjects.length})`}
              icon={projectsLoading ? <CircularProgress size={16} /> : undefined}
              iconPosition="end"
            />
          </Tabs>
        </Box>

        {/* Properties Tab Content */}
        {activeTab === 0 && (
          <>
            {viewMode === 'list' && (
              <Box>
                {propertiesLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: 'var(--color-primary)' }} />
                  </Box>
                ) : properties.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No properties found. Try adjusting your search criteria.
                  </Alert>
                ) : (
                  <Grid container spacing={3}>
                    {properties.map((property, index) => (
                      <Grid item xs={12} sm={6} md={4} key={property._id}>
                        <PropertyCard 
                          property={property} 
                          index={index}
                          id={`property-${property._id}`}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {viewMode === 'map' && (
              <Box sx={{ height: '80vh', width: '100%' }}>
                <PropertiesMap 
                  properties={properties}
                  selectedProperty={selectedProperty}
                  userLocation={userLocation}
                  onMarkerClick={handlePropertyClick}
                  height="100%"
                  searchQuery={filters.search}
                  enableClustering={true}
                />
              </Box>
            )}

            {viewMode === 'heatmap' && (
              <Box sx={{ height: '80vh', width: '100%' }}>
                <PropertyHeatMap
                  properties={properties}
                />
              </Box>
            )}
          </>
        )}

        {/* Projects Tab Content */}
        {activeTab === 1 && (
          <Box>
            {projectsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: 'var(--color-primary)' }} />
              </Box>
            ) : filteredProjects.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No projects found. Try adjusting your search criteria.
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {filteredProjects.map((project) => (
                  <Grid item xs={12} sm={6} md={4} key={project._id}>
                    <ProjectCard 
                      project={project}
                      showFavoriteButton={true}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Container>

      {/* Filter Drawer */}
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={showFiltersDrawer}
        onClose={() => setShowFiltersDrawer(false)}
        sx={{
          '& .MuiPaper-root': {
            maxHeight: isMobile ? '90vh' : '100vh',
            borderTopLeftRadius: isMobile ? '16px' : 0,
            borderTopRightRadius: isMobile ? '16px' : 0,
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            width: isMobile ? '100%' : '400px'
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid var(--color-border)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters
            </Typography>
            <IconButton onClick={() => setShowFiltersDrawer(false)}>
              <Close />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ p: 2, overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
          {/* Price Range */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Price Range
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Min Price"
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Max Price"
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Beds & Baths */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Beds & Baths
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Bedrooms</InputLabel>
                  <Select
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    label="Bedrooms"
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="1">1+</MenuItem>
                    <MenuItem value="2">2+</MenuItem>
                    <MenuItem value="3">3+</MenuItem>
                    <MenuItem value="4">4+</MenuItem>
                    <MenuItem value="5">5+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Bathrooms</InputLabel>
                  <Select
                    value={filters.bathrooms}
                    onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                    label="Bathrooms"
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="1">1+</MenuItem>
                    <MenuItem value="2">2+</MenuItem>
                    <MenuItem value="3">3+</MenuItem>
                    <MenuItem value="4">4+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Amenities */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Amenities
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {amenityOptions.map(amenity => {
                const isActive = filters.amenities.includes(amenity);
                return (
                  <Chip
                    key={amenity}
                    label={amenity}
                    clickable
                    variant={isActive ? 'filled' : 'outlined'}
                    onClick={() => {
                      const newAmenities = isActive
                        ? filters.amenities.filter(a => a !== amenity)
                        : [...filters.amenities, amenity];
                      handleFilterChange('amenities', newAmenities);
                    }}
                    sx={{
                      backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                      color: isActive ? 'white' : 'var(--color-primary)',
                      borderColor: 'var(--color-primary)'
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          {/* Advanced Filters */}
          <Box sx={{ mb: 3, borderTop: '1px solid var(--color-border)', pt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Advanced Filters
            </Typography>

            {/* Construction Status */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, color: 'var(--color-text-muted)' }}>
                Construction Status
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['Under Construction', 'Ready to Move', 'New Launch'].map(status => {
                  const isActive = filters.constructionStatus.includes(status);
                  return (
                    <Chip
                      key={status}
                      label={status}
                      clickable
                      size="small"
                      variant={isActive ? 'filled' : 'outlined'}
                      onClick={() => {
                        const newStatus = isActive
                          ? filters.constructionStatus.filter(s => s !== status)
                          : [...filters.constructionStatus, status];
                        handleFilterChange('constructionStatus', newStatus);
                      }}
                      sx={{
                        backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                        color: isActive ? 'white' : 'var(--color-primary)',
                        borderColor: 'var(--color-primary)'
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Verified & Virtual Tour */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="Verified Only"
                clickable
                size="small"
                variant={filters.verified === true ? 'filled' : 'outlined'}
                onClick={() => handleFilterChange('verified', filters.verified === true ? undefined : true)}
                sx={{
                  backgroundColor: filters.verified === true ? 'var(--color-primary)' : 'transparent',
                  color: filters.verified === true ? 'white' : 'var(--color-primary)',
                  borderColor: 'var(--color-primary)'
                }}
              />
              <Chip
                label="Has Virtual Tour"
                clickable
                size="small"
                variant={filters.hasVirtualTour === true ? 'filled' : 'outlined'}
                onClick={() => handleFilterChange('hasVirtualTour', filters.hasVirtualTour === true ? undefined : true)}
                sx={{
                  backgroundColor: filters.hasVirtualTour === true ? 'var(--color-primary)' : 'transparent',
                  color: filters.hasVirtualTour === true ? 'white' : 'var(--color-primary)',
                  borderColor: 'var(--color-primary)'
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid var(--color-border)' }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={clearAllFilters}
              sx={{ flex: 1 }}
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              onClick={() => setShowFiltersDrawer(false)}
              sx={{ flex: 2, backgroundColor: 'var(--color-primary)' }}
            >
              Apply Filters
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: 'var(--color-primary)' }} />
      </Container>
    }>
      <SearchContent />
    </Suspense>
  );
}
