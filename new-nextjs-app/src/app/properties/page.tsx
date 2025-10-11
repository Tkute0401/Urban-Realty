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
  Stack
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
        background: '#08171A'
      }}>
        <CircularProgress sx={{ color: '#78CADC' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#08171A',
      fontFamily: '"Poppins", sans-serif'
    }}>
      {/* Mobile Search and Filter Bar */}
      {isMobile && (
        <Box sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: '#08171A',
          borderBottom: '1px solid rgba(120, 202, 220, 0.2)',
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
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'rgba(120, 202, 220, 0.3)'
                  },
                  '&:hover fieldset': {
                    borderColor: '#78CADC'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)'
                }
              }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: '#78CADC' }} />
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
                borderColor: '#78CADC',
                color: '#78CADC',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#5fb4c9',
                  backgroundColor: 'rgba(120, 202, 220, 0.1)'
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
                    backgroundColor: '#78CADC',
                    color: '#0B1011',
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
                  backgroundColor: filters.propertyType === 'ALL' ? '#78CADC' : 'transparent',
                  color: filters.propertyType === 'ALL' ? '#0B1011' : '#78CADC',
                  borderColor: '#78CADC',
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
                  backgroundColor: filters.propertyType === 'BUY' ? '#78CADC' : 'transparent',
                  color: filters.propertyType === 'BUY' ? '#0B1011' : '#78CADC',
                  borderColor: '#78CADC',
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
                  backgroundColor: filters.propertyType === 'RENT' ? '#78CADC' : 'transparent',
                  color: filters.propertyType === 'RENT' ? '#0B1011' : '#78CADC',
                  borderColor: '#78CADC',
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
          background: '#08171A',
          borderBottom: '1px solid rgba(120, 202, 220, 0.2)',
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
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(120, 202, 220, 0.3)'
                    },
                    '&:hover fieldset': {
                      borderColor: '#78CADC'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)'
                  }
                }}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: '#78CADC' }} />
                }}
              />
              
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  backgroundColor: '#78CADC',
                  color: '#0B1011',
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#5fb4c9'
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
                  borderColor: '#78CADC',
                  color: '#78CADC',
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#5fb4c9',
                    backgroundColor: 'rgba(120, 202, 220, 0.1)'
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
                  backgroundColor: filters.propertyType === 'ALL' ? '#78CADC' : 'transparent',
                  color: filters.propertyType === 'ALL' ? '#0B1011' : '#78CADC',
                  borderColor: '#78CADC',
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
                  backgroundColor: filters.propertyType === 'BUY' ? '#78CADC' : 'transparent',
                  color: filters.propertyType === 'BUY' ? '#0B1011' : '#78CADC',
                  borderColor: '#78CADC',
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
                  backgroundColor: filters.propertyType === 'RENT' ? '#78CADC' : 'transparent',
                  color: filters.propertyType === 'RENT' ? '#0B1011' : '#78CADC',
                  borderColor: '#78CADC',
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
              backgroundColor: '#0B1011',
              color: 'white',
            }
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(120, 202, 220, 0.2)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Filters
              </Typography>
              <IconButton onClick={() => setShowFiltersDrawer(false)} sx={{ color: '#78CADC' }}>
                <Close />
              </IconButton>
            </Box>
          </Box>

          {/* Filter Content */}
          <Box sx={{ p: 2, maxHeight: '70vh', overflowY: 'auto' }}>
            {/* Property Type */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
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
                        backgroundColor: isActive ? '#78CADC' : 'transparent',
                        color: isActive ? '#0B1011' : '#78CADC',
                        borderColor: '#78CADC',
                        '&:hover': {
                          backgroundColor: isActive ? '#5fb4c9' : 'rgba(120, 202, 220, 0.1)'
                        }
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Price Range */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
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
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(120, 202, 220, 0.3)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)'
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
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(120, 202, 220, 0.3)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Beds & Baths */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                Beds & Baths
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Bedrooms</InputLabel>
                    <Select
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(120, 202, 220, 0.3)'
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
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Bathrooms</InputLabel>
                    <Select
                      value={filters.bathrooms}
                      onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(120, 202, 220, 0.3)'
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
              <Typography variant="subtitle1" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
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
                        backgroundColor: isActive ? '#78CADC' : 'transparent',
                        color: isActive ? '#0B1011' : '#78CADC',
                        borderColor: '#78CADC',
                        '&:hover': {
                          backgroundColor: isActive ? '#5fb4c9' : 'rgba(120, 202, 220, 0.1)'
                        }
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ p: 2, borderTop: '1px solid rgba(120, 202, 220, 0.2)' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={clearAllFilters}
                sx={{
                  flex: 1,
                  borderColor: '#78CADC',
                  color: '#78CADC',
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
                  backgroundColor: '#78CADC',
                  color: '#0B1011',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#5fb4c9'
                  }
                }}
              >
                View {properties.length} Properties
              </Button>
            </Box>
          </Box>
        </Drawer>
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
            color: 'white', 
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '28px', sm: '36px', md: '48px' }
          }}
        >
          {filters.propertyType === 'RENT' ? 'Luxury Properties for ' : filters.propertyType === 'BUY' ? 'Luxury Properties for ' : 'All '}
          <span style={{ color: '#78CADC' }}>
            {filters.propertyType === 'RENT' ? 'Rent' : filters.propertyType === 'BUY' ? 'Sale' : 'Properties'}
          </span>
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
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
                      backgroundColor: 'rgba(120, 202, 220, 0.2)',
                      color: '#78CADC',
                      border: '1px solid #78CADC',
                      '& .MuiChip-deleteIcon': {
                        color: '#78CADC'
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
                    backgroundColor: 'rgba(120, 202, 220, 0.2)',
                    color: '#78CADC',
                    border: '1px solid #78CADC',
                    '& .MuiChip-deleteIcon': {
                      color: '#78CADC'
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
                  color: '#78CADC',
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
          <Alert severity="error" sx={{ backgroundColor: 'rgba(211, 47, 47, 0.1)', color: 'white' }}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Properties List */}
      <PropertyList
        properties={properties}
        loading={loading}
        error={error}
        emptyMessage="No properties found matching your criteria"
        columns={{ xs: 12, sm: 6, md: 4, lg: 3 }}
        onPropertyClick={(property) => router.push(`/properties/${property._id}`)}
      />

      {/* Pagination */}
      {!loading && properties.length > 0 && pagination.totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 4,
          pb: 4
        }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'white',
                fontSize: { xs: '14px', sm: '16px' }
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                backgroundColor: '#78CADC',
                color: '#0B1011',
                '&:hover': {
                  backgroundColor: '#5fb4c9'
                }
              },
              '& .MuiPaginationItem-root:hover': {
                backgroundColor: 'rgba(120, 202, 220, 0.2)'
              }
            }}
          />
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
        background: '#08171A'
      }}>
        <CircularProgress sx={{ color: '#78CADC' }} />
      </Box>
    }>
      <PropertiesPageContent />
    </Suspense>
  );
};

export default PropertiesPage;