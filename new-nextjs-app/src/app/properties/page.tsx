'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Drawer,
  Stack,
  Paper
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Close,
  MyLocation,
  Refresh
} from '@mui/icons-material';
import { useProperties } from '@/contexts/PropertiesContext';
import PropertyList from '@/components/property/PropertyList';
import PropertiesMap from '@/components/property/PropertiesMap';
import SearchAutocomplete from '@/components/property/SearchAutocomplete';
import { useComparison } from '@/contexts/ComparisonContext';
import { useLocation } from '@/hooks/useLocation';
import '@/style-constants/z-index.css';

const PropertiesPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Context hooks - ALWAYS called in the same order
  const { properties, similarProperties, loading, error, pagination, getProperties, getSimilarProperties } = useProperties();
  const { location: userLocation, loading: locationLoading, error: locationError, requestLocation } = useLocation();
  const { comparisonProperties, addToComparison, removeFromComparison } = useComparison();
  
  // All state hooks - ALWAYS called in the same order
  const [isMobile, setIsMobile] = useState(false);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showHomeTypeFilter, setShowHomeTypeFilter] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showBedBathFilter, setShowBedBathFilter] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    propertyType: 'ALL',
    type: '',
    city: '',
    state: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [] as string[]
  });

  const amenityOptions = [
    'Parking', 'Swimming Pool', 'Gym', 'Security', 'Garden', 'Balcony',
    'WiFi', 'Air Conditioning', 'Furnished', 'Pet Friendly', 'Elevator',
    'Laundry', 'Storage', 'Conference Room', 'Kitchen'
  ];

  // Mobile detection - runs once on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize filters from URL - runs once on mount
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const city = searchParams.get('city') || '';
    const propertyType = searchParams.get('propertyType') || 'ALL';
    
    setFilters(prev => ({ ...prev, search, type, city, propertyType }));
  }, [searchParams]);

  // Load properties when filters change
  useEffect(() => {
    const params: any = {
      page: pagination.page,
      limit: 12
    };

    if (filters.search) params.search = filters.search;
    if (filters.type) params.type = filters.type;
    if (filters.city) params.city = filters.city;
    if (filters.state) params.state = filters.state;
    if (filters.priceMin) params.minPrice = Number(filters.priceMin);
    if (filters.priceMax) params.maxPrice = Number(filters.priceMax);
    if (filters.bedrooms) params.bedrooms = Number(filters.bedrooms);
    if (filters.bathrooms) params.bathrooms = Number(filters.bathrooms);
    if (filters.amenities.length > 0) params.amenities = filters.amenities.join(',');
    if (filters.propertyType !== 'ALL') {
      params.status = filters.propertyType === 'BUY' ? 'For Sale' : 'For Rent';
    }
    if (userLocation) {
      params.userLat = userLocation.latitude;
      params.userLng = userLocation.longitude;
    }

    getProperties(params);
  }, [filters.search, filters.type, filters.city, filters.propertyType, filters.bedrooms, filters.bathrooms, filters.amenities, pagination.page, userLocation]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setShowHomeTypeFilter(false);
        setShowPriceFilter(false);
        setShowBedBathFilter(false);
        setShowMoreFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params: any = { page: 1, limit: 12 };
    if (filters.search) params.search = filters.search;
    if (filters.type) params.type = filters.type;
    if (filters.city) params.city = filters.city;
    if (filters.propertyType !== 'ALL') {
      params.status = filters.propertyType === 'BUY' ? 'For Sale' : 'For Rent';
    }
    getProperties(params);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Update URL for main filters
    if (key === 'search' || key === 'city' || key === 'type' || key === 'propertyType') {
      const newFilters = { ...filters, [key]: value };
      const params = new URLSearchParams();
      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.city) params.set('city', newFilters.city);
      if (newFilters.type) params.set('type', newFilters.type);
      if (newFilters.propertyType && newFilters.propertyType !== 'ALL') {
        params.set('propertyType', newFilters.propertyType);
      }
      const queryString = params.toString();
      router.replace(queryString ? `/properties?${queryString}` : '/properties');
    }
  };

  const handlePropertyTypeChange = (newType: string) => {
    setFilters(prev => ({ ...prev, propertyType: newType }));
    if (isMobile && showFiltersDrawer) {
      setShowFiltersDrawer(false);
    }
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      propertyType: 'ALL',
      type: '',
      city: '',
      state: '',
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      amenities: []
    });
    if (isMobile) setShowFiltersDrawer(false);
    router.replace('/properties');
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    const params: any = { page, limit: 12 };
    if (filters.search) params.search = filters.search;
    if (filters.type) params.type = filters.type;
    if (filters.city) params.city = filters.city;
    if (filters.propertyType !== 'ALL') {
      params.status = filters.propertyType === 'BUY' ? 'For Sale' : 'For Rent';
    }
    if (userLocation) {
      params.userLat = userLocation.latitude;
      params.userLng = userLocation.longitude;
    }
    getProperties(params);
  };

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property);
    const slug = property.slug || property.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || property._id;
    router.push(`/properties/${slug}`);
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => 
    key !== 'propertyType' && key !== 'search' && value && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-family-sans, "Poppins", sans-serif)',
      overflow: 'hidden'
    }}>
      <Box sx={{
        maxWidth: '100vw',
        mx: 'auto',
        overflow: 'hidden'
      }}>
      {/* Mobile Search and Filter Bar */}
      {isMobile && (
        <Box sx={{
          position: 'sticky',
          top: 0,
          zIndex: 'var(--z-sticky-filters)',
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          p: 2
        }}>
          <Box sx={{ mb: 2 }}>
            <SearchAutocomplete
              value={filters.search}
              onChange={(value) => handleFilterChange('search', value)}
              placeholder="Search location, property type, or amenities..."
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                    color: 'var(--color-primary-contrast)',
                    fontSize: '12px',
                    height: '20px'
                  }}
                />
              )}
            </Button>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={filters.propertyType === 'ALL' ? 'contained' : 'outlined'}
                onClick={() => handlePropertyTypeChange('ALL')}
                sx={{
                  backgroundColor: filters.propertyType === 'ALL' ? 'var(--color-primary)' : 'transparent',
                  color: filters.propertyType === 'ALL' ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: '60px'
                }}
              >
                All
              </Button>
              <Button
                variant={filters.propertyType === 'BUY' ? 'contained' : 'outlined'}
                onClick={() => handlePropertyTypeChange('BUY')}
                sx={{
                  backgroundColor: filters.propertyType === 'BUY' ? 'var(--color-primary)' : 'transparent',
                  color: filters.propertyType === 'BUY' ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: '60px'
                }}
              >
                Buy
              </Button>
              <Button
                variant={filters.propertyType === 'RENT' ? 'contained' : 'outlined'}
                onClick={() => handlePropertyTypeChange('RENT')}
                sx={{
                  backgroundColor: filters.propertyType === 'RENT' ? 'var(--color-primary)' : 'transparent',
                  color: filters.propertyType === 'RENT' ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: '60px'
                }}
              >
                Rent
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      
      {/* Desktop Navbar with search */}
      {!isMobile && (
        <Box sx={{
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          py: 3
        }}>
          <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 4 }}>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <SearchAutocomplete
                  value={filters.search}
                  onChange={(value) => handleFilterChange('search', value)}
                  placeholder="Search by location, property type, or amenities..."
                />
              </Box>
              
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-contrast)',
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Search
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={filters.propertyType === 'ALL' ? 'contained' : 'outlined'}
                onClick={() => handlePropertyTypeChange('ALL')}
                sx={{
                  backgroundColor: filters.propertyType === 'ALL' ? 'var(--color-primary)' : 'transparent',
                  color: filters.propertyType === 'ALL' ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1
                }}
              >
                ALL
              </Button>
              <Button
                variant={filters.propertyType === 'BUY' ? 'contained' : 'outlined'}
                onClick={() => handlePropertyTypeChange('BUY')}
                sx={{
                  backgroundColor: filters.propertyType === 'BUY' ? 'var(--color-primary)' : 'transparent',
                  color: filters.propertyType === 'BUY' ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1
                }}
              >
                BUY
              </Button>
              <Button
                variant={filters.propertyType === 'RENT' ? 'contained' : 'outlined'}
                onClick={() => handlePropertyTypeChange('RENT')}
                sx={{
                  backgroundColor: filters.propertyType === 'RENT' ? 'var(--color-primary)' : 'transparent',
                  color: filters.propertyType === 'RENT' ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1
                }}
              >
                RENT
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Mobile Filter Drawer */}
      {isMobile && (
        <Drawer
          anchor="bottom"
          open={showFiltersDrawer}
          onClose={() => setShowFiltersDrawer(false)}
          sx={{
            '& .MuiPaper-root': {
              maxHeight: '90vh',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              zIndex: 'var(--z-drawer)',
            }
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid var(--color-border)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                Filters
              </Typography>
              <IconButton onClick={() => setShowFiltersDrawer(false)} sx={{ color: 'var(--color-primary)' }}>
                <Close />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ p: 2, maxHeight: '70vh', overflowY: 'auto' }}>
            {/* Property Type */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: 'var(--color-text-primary)', mb: 2, fontWeight: 600 }}>
                Property Type
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['Houses', 'Condos/Co-ops', 'Townhomes', 'Multi-family', 'Manufactured', 'Lots/Land', 'Apartments'].map(type => {
                  const isActive = filters.type === type;
                  return (
                    <Chip
                      key={type}
                      label={type}
                      clickable
                      variant={isActive ? 'filled' : 'outlined'}
                      onClick={() => handleFilterChange('type', isActive ? '' : type)}
                      sx={{
                        backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                        color: isActive ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                        borderColor: 'var(--color-primary)'
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Price Range */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: 'var(--color-text-primary)', mb: 2, fontWeight: 600 }}>
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-primary)'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Max Price"
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-primary)'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Beds & Baths */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: 'var(--color-text-primary)', mb: 2, fontWeight: 600 }}>
                Beds & Baths
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Bedrooms</InputLabel>
                    <Select
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                      sx={{
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-primary)'
                      }}
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
                  <FormControl fullWidth>
                    <InputLabel>Bathrooms</InputLabel>
                    <Select
                      value={filters.bathrooms}
                      onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                      sx={{
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      <MenuItem value="">Any</MenuItem>
                      <MenuItem value="1">1+</MenuItem>
                      <MenuItem value="1.5">1.5+</MenuItem>
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
              <Typography variant="subtitle1" sx={{ color: 'var(--color-text-primary)', mb: 2, fontWeight: 600 }}>
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
                        color: isActive ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                        borderColor: 'var(--color-primary)'
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 2, borderTop: '1px solid var(--color-border)' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={clearAllFilters}
                sx={{
                  flex: 1,
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Clear All
              </Button>
              <Button
                variant="contained"
                onClick={() => setShowFiltersDrawer(false)}
                sx={{
                  flex: 2,
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-contrast)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                View {properties.length} Properties
              </Button>
            </Box>
          </Box>
        </Drawer>
      )}

      {/* Desktop Content */}
      {!isMobile && (
        <Box sx={{
          maxWidth: '1400px',
          mx: 'auto',
          px: 4,
          py: 2
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h3" sx={{
                color: 'var(--color-primary)',
                fontWeight: 700
              }}>
                All Properties
              </Typography>
              <IconButton
                onClick={requestLocation}
                disabled={locationLoading}
                sx={{
                  backgroundColor: userLocation ? 'var(--color-primary)' : 'var(--color-background-secondary)',
                  color: userLocation ? 'white' : 'var(--color-text-muted)'
                }}
                title={userLocation ? 'Location detected' : 'Detect my location'}
              >
                {locationLoading ? <CircularProgress size={20} /> : <MyLocation />}
              </IconButton>
            </Box>
            <Typography variant="h6" sx={{
              color: 'var(--color-text-muted)',
              fontWeight: 500
            }}>
              {properties.length} LISTINGS
              {userLocation && (
                <Chip
                  label="Sorted by distance"
                  size="small"
                  sx={{
                    ml: 2,
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)'
                  }}
                />
              )}
            </Typography>
            {locationError && (
              <Alert severity="warning" sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
                {locationError}
              </Alert>
            )}
          </Box>

          <Box sx={{
            display: 'flex',
            gap: { xs: 2, md: 3 },
            flexDirection: { xs: 'column', lg: 'row' },
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            <Box sx={{
              flex: { xs: 1, lg: '0 0 60%' },
              minWidth: 0,
              overflow: 'visible'
            }}>
              <PropertyList
                properties={properties}
                similarProperties={similarProperties}
                loading={loading}
                error={error}
                emptyMessage="No properties found matching your criteria"
                columns={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}
                onPropertyClick={(property) => {
                  const slug = property.slug || property.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || property._id;
                  router.push(`/properties/${slug}`);
                }}
              />
            </Box>
            <Box sx={{
              flex: { xs: 1, lg: '0 0 40%' },
              position: { xs: 'static', lg: 'sticky' },
              top: { lg: 20 },
              height: { lg: 'auto' },
              minWidth: 0,
              overflow: 'visible'
            }}>
              <PropertiesMap
                properties={properties}
                selectedProperty={selectedProperty}
                userLocation={userLocation}
                onMarkerClick={handlePropertyClick}
                height="600px"
                searchQuery={filters.search}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Mobile Properties List */}
      {isMobile && (
        <PropertyList
          properties={properties}
          similarProperties={similarProperties}
          loading={loading}
          error={error}
          emptyMessage="No properties found matching your criteria"
          columns={{ xs: 12, sm: 6, md: 4 }}
          onPropertyClick={(property) => router.push(`/properties/${property._id}`)}
        />
      )}

      {/* Error Message */}
      {error && (
        <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, md: 4 }, mb: 3 }}>
          <Alert severity="error" sx={{ backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)' }}>
            {error}
          </Alert>
        </Box>
      )}
      </Box>
    </Box>
  );
};

const PropertiesPage: React.FC = () => {
  return (
    <Suspense fallback={
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--color-bg)'
      }}>
        <CircularProgress sx={{ color: 'var(--color-primary)' }} />
      </Box>
    }>
      <PropertiesPageContent />
    </Suspense>
  );
};

export default PropertiesPage;
