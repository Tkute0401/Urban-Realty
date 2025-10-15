'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Pagination, 
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
  ArrowBack,
  LocationOn,
  Add,
  Refresh
} from '@mui/icons-material';
import { useProperties } from '@/contexts/PropertiesContext';
import PropertyList from '@/components/property/PropertyList';
import { useMediaQuery, useTheme } from '@mui/material';

const PropertiesPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { properties, loading, error, pagination, getProperties } = useProperties();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [mounted, setMounted] = useState(false);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [expandedSearch, setExpandedSearch] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [activeBtn, setActiveBtn] = useState('ALL');
  
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
    amenities: [] as string[],
    minArea: '',
    maxArea: ''
  });

  const amenityOptions = [
    'Parking', 'Swimming Pool', 'Gym', 'Security', 'Garden', 'Balcony',
    'WiFi', 'Air Conditioning', 'Furnished', 'Pet Friendly', 'Elevator',
    'Laundry', 'Storage', 'Conference Room', 'Kitchen'
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const city = searchParams.get('city') || '';
    const propertyType = searchParams.get('propertyType') || 'ALL';

    setFilters(prev => ({ ...prev, search, type, city, propertyType }));
  }, [searchParams, mounted]);

  useEffect(() => {
    if (mounted) {
      loadProperties();
    }
  }, [mounted]);

  const loadProperties = () => {
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
    if (filters.minArea) params.minArea = Number(filters.minArea);
    if (filters.maxArea) params.maxArea = Number(filters.maxArea);
    if (filters.propertyType !== 'ALL') {
      params.status = filters.propertyType === 'BUY' ? 'For Sale' : 'For Rent';
    }

    getProperties(params);
  };

  const handleSearch = () => {
    loadProperties();
    if (isMobile && expandedSearch) {
      setExpandedSearch(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePropertyTypeChange = (newType: string) => {
    setFilters(prev => ({ ...prev, propertyType: newType }));
    setActiveBtn(newType === 'RENT' ? 'RENT' : 'BUY');
    
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
      amenities: [],
      minArea: '',
      maxArea: ''
    });
    
    if (isMobile) {
      setShowFiltersDrawer(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    const params: any = { page, limit: 12 };
    if (filters.search) params.search = filters.search;
    if (filters.type) params.type = filters.type;
    if (filters.city) params.city = filters.city;
    if (filters.state) params.state = filters.state;
    if (filters.priceMin) params.minPrice = Number(filters.priceMin);
    if (filters.priceMax) params.maxPrice = Number(filters.priceMax);
    if (filters.bedrooms) params.bedrooms = Number(filters.bedrooms);
    if (filters.bathrooms) params.bathrooms = Number(filters.bathrooms);
    if (filters.amenities.length > 0) params.amenities = filters.amenities.join(',');
    if (filters.minArea) params.minArea = Number(filters.minArea);
    if (filters.maxArea) params.maxArea = Number(filters.maxArea);
    if (filters.propertyType !== 'ALL') {
      params.status = filters.propertyType === 'BUY' ? 'For Sale' : 'For Rent';
    }
    getProperties(params);
  };

  const formatPrice = (price: number) => {
    if (!price) return '₹0';
    const num = typeof price === 'string' ? parseInt(price) : price;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num).replace('₹', '₹');
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => 
    key !== 'propertyType' && key !== 'search' && value && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  if (!mounted) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--color-bg)'
      }}>
        <CircularProgress sx={{ color: 'var(--color-primary)' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-family-sans, "Poppins", sans-serif)'
    }}>
      {/* Mobile Search and Filter Bar */}
      {isMobile && (
        <Box sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          p: 2
        }}>
          {/* Enhanced Mobile Search */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search location, property type, or amenities..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'var(--color-border)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--color-primary)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--color-text-muted)'
                }
              }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'var(--color-primary)' }} />
              }}
            />
          </Box>
          
          {/* Filter Button and Buy/Rent Toggle */}
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
                fontWeight: 600,
                '&:hover': {
                  borderColor: 'var(--color-primary-hover)',
                  backgroundColor: 'var(--color-primary-light)'
                }
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
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by location, property type, or amenities..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    background: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'var(--color-border)'
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--color-primary)'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'var(--color-text-muted)'
                  }
                }}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'var(--color-primary)' }} />
                }}
              />
              
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
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)'
                  }
                }}
              >
                Search
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => setShowFiltersDrawer(true)}
                startIcon={<FilterList />}
                sx={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'var(--color-primary-hover)',
                    backgroundColor: 'var(--color-primary-light)'
                  }
                }}
              >
                Filters
              </Button>
            </Box>

            {/* Buy/Rent Toggle */}
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
            }
          }}
        >
          {/* Header */}
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

          {/* Filter Content */}
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
                        borderColor: 'var(--color-primary)',
                      '&:hover': {
                          backgroundColor: isActive ? 'var(--color-primary-hover)' : 'var(--color-primary-light)'
                        }
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
                        color: 'var(--color-text-primary)',
                        '& fieldset': {
                          borderColor: 'var(--color-border)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-muted)'
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
                        color: 'var(--color-text-primary)',
                        '& fieldset': {
                          borderColor: 'var(--color-border)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-text-muted)'
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
                    <InputLabel sx={{ color: 'var(--color-text-muted)' }}>Bedrooms</InputLabel>
                    <Select
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                      sx={{
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-primary)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'var(--color-border)'
                        }
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
                    <InputLabel sx={{ color: 'var(--color-text-muted)' }}>Bathrooms</InputLabel>
                    <Select
                      value={filters.bathrooms}
                      onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                      sx={{
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-primary)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'var(--color-border)'
                        }
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
                        borderColor: 'var(--color-primary)',
                        '&:hover': {
                          backgroundColor: isActive ? 'var(--color-primary-hover)' : 'var(--color-primary-light)'
                        }
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          </Box>

          {/* Footer */}
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
                onClick={() => {
                  loadProperties();
                  setShowFiltersDrawer(false);
                }}
                sx={{
                  flex: 2,
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-contrast)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)'
                  }
                }}
              >
                View {properties.length} Properties
              </Button>
            </Box>
          </Box>
        </Drawer>
      )}

      {/* Desktop Filter Sidebar */}
      {!isMobile && (
        <Box sx={{
          maxWidth: '1400px',
          mx: 'auto',
          px: 4,
          py: 2
        }}>
          <Grid container spacing={3}>
            {/* Filter Sidebar */}
            <Grid item xs={12} md={3}>
              <Paper sx={{
                p: 3,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                position: 'sticky',
                top: 100
              }}>
                <Typography variant="h6" sx={{ mb: 3, color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  Filters
                </Typography>

                {/* Property Type */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'var(--color-text-primary)', mb: 2, fontWeight: 600 }}>
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
                            borderColor: 'var(--color-primary)',
                            '&:hover': {
                              backgroundColor: isActive ? 'var(--color-primary-hover)' : 'var(--color-primary-light)'
                            }
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>

                {/* Price Range */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'var(--color-text-primary)', mb: 2, fontWeight: 600 }}>
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            background: 'var(--color-bg)',
                            color: 'var(--color-text-primary)',
                            '& fieldset': {
                              borderColor: 'var(--color-border)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--color-text-muted)'
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
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            background: 'var(--color-bg)',
                            color: 'var(--color-text-primary)',
                            '& fieldset': {
                              borderColor: 'var(--color-border)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: 'var(--color-text-muted)'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Beds & Baths */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'var(--color-text-primary)', mb: 2, fontWeight: 600 }}>
                    Beds & Baths
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ color: 'var(--color-text-muted)' }}>Bedrooms</InputLabel>
                        <Select
                          value={filters.bedrooms}
                          onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                          sx={{
                            background: 'var(--color-bg)',
                            color: 'var(--color-text-primary)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'var(--color-border)'
                            }
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
                      <FormControl fullWidth size="small">
                        <InputLabel sx={{ color: 'var(--color-text-muted)' }}>Bathrooms</InputLabel>
                        <Select
                          value={filters.bathrooms}
                          onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                          sx={{
                            background: 'var(--color-bg)',
                            color: 'var(--color-text-primary)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'var(--color-border)'
                            }
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
                  <Typography variant="subtitle2" sx={{ color: 'var(--color-text-primary)', mb: 2, fontWeight: 600 }}>
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
                          size="small"
                          sx={{
                            backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                            color: isActive ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                            borderColor: 'var(--color-primary)',
                            '&:hover': {
                              backgroundColor: isActive ? 'var(--color-primary-hover)' : 'var(--color-primary-light)'
                            }
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>

                {/* Filter Actions */}
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
                    onClick={handleSearch}
                    sx={{
                      flex: 1,
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-primary-contrast)',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'var(--color-primary-hover)'
                      }
                    }}
                  >
                    Apply
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Properties List */}
            <Grid item xs={12} md={9}>
              <PropertyList
                properties={properties}
                loading={loading}
                error={error}
                emptyMessage="No properties found matching your criteria"
                columns={{ xs: 12, sm: 6, md: 4 }}
                onPropertyClick={(property) => router.push(`/properties/${property._id}`)}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Mobile Properties List */}
      {isMobile && (
        <PropertyList
          properties={properties}
          loading={loading}
          error={error}
          emptyMessage="No properties found matching your criteria"
          columns={{ xs: 12, sm: 6, md: 4 }}
          onPropertyClick={(property) => router.push(`/properties/${property._id}`)}
        />
      )}

      {/* Page Title */}
      <Box sx={{ 
        maxWidth: '1400px', 
        mx: 'auto', 
        px: { xs: 2, md: 4 },
        py: 4,
        textAlign: 'center'
      }}>
                      <Typography 
          variant="h3" 
                        sx={{ 
            color: 'var(--color-text-primary)', 
                          fontWeight: 'bold', 
            mb: 2,
            fontSize: { xs: '28px', sm: '36px', md: '48px' }
                        }}
                      >
          {filters.propertyType === 'RENT' ? 'Luxury Properties for ' : filters.propertyType === 'BUY' ? 'Luxury Properties for ' : 'All '}
          <span style={{ color: 'var(--color-primary)' }}>
            {filters.propertyType === 'RENT' ? 'Rent' : filters.propertyType === 'BUY' ? 'Sale' : 'Properties'}
          </span>
                      </Typography>
                        <Typography 
          variant="h6" 
                          sx={{ 
            color: 'var(--color-text-muted)',
            fontSize: { xs: '16px', sm: '18px', md: '20px' }
          }}
        >
          {properties.length} LISTING{properties.length !== 1 ? 'S' : ''}
                        </Typography>
                      </Box>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <Box sx={{ 
          maxWidth: '1400px', 
          mx: 'auto', 
          px: { xs: 2, md: 4 },
          mb: 3
        }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {Object.entries(filters).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0) || key === 'propertyType') return null;
              
              if (Array.isArray(value)) {
                return value.map(item => (
                        <Chip 
                    key={`${key}-${item}`}
                    label={`${key}: ${item}`}
                    onDelete={() => {
                      const newAmenities = filters.amenities.filter(a => a !== item);
                      handleFilterChange('amenities', newAmenities);
                    }}
                          sx={{ 
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      border: '1px solid var(--color-primary)',
                      '& .MuiChip-deleteIcon': {
                        color: 'var(--color-primary)'
                      }
                    }}
                  />
                ));
              }
              
              return (
                        <Chip 
                  key={key}
                  label={`${key}: ${value}`}
                  onDelete={() => handleFilterChange(key, '')}
                          sx={{ 
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)',
                    '& .MuiChip-deleteIcon': {
                      color: 'var(--color-primary)'
                    }
                  }}
                />
              );
            })}
            
            {activeFilterCount > 0 && (
              <Button
                variant="text"
                onClick={clearAllFilters}
                sx={{
                  color: 'var(--color-primary)',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Clear all
              </Button>
            )}
          </Box>
        </Box>
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