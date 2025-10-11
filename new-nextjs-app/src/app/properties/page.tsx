'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, TextField, Button, Grid, Card, CardContent, CardMedia, Chip, Pagination, CircularProgress, Alert } from '@mui/material';
import { Search, FilterList, LocationOn, Bed, Bathroom, SquareFoot } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useProperties } from '@/contexts/PropertiesContext';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeProvider';
import http from '@/lib/services/http';

interface Property {
  _id: string;
  title: string;
  buildingName?: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  status: string;
  description?: string;
  address?: {
    street?: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  images?: Array<{ url: string; alt?: string; caption?: string }>;
  projectDetails?: {
    launchDate?: string;
    possessionDate?: string;
    developer?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  amenities?: string[];
  highlights?: string[];
  floorPlan?: {
    image: string;
    description: string;
  };
  nearbyPlaces?: Array<{
    name: string;
    type: string;
    distance: string;
  }>;
  similarProperties?: Property[];
  createdAt?: string;
  updatedAt?: string;
}

interface Filters {
  search: string;
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  city: string;
}

const PropertiesPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // State management
  const [mounted, setMounted] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<Filters>({
    search: '',
    minPrice: 0,
    maxPrice: 100000000,
    minArea: 0,
    maxArea: 10000,
    bedrooms: 0,
    bathrooms: 0,
    type: '',
    city: ''
  });

  // Client-side mounting check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize filters from URL params
  useEffect(() => {
    if (!mounted) return;

    const search = searchParams.get('search') || '';
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '100000000');
    const minArea = parseInt(searchParams.get('minArea') || '0');
    const maxArea = parseInt(searchParams.get('maxArea') || '10000');
    const bedrooms = parseInt(searchParams.get('bedrooms') || '0');
    const bathrooms = parseInt(searchParams.get('bathrooms') || '0');
    const type = searchParams.get('type') || '';
    const city = searchParams.get('city') || '';

    setFilters({
      search,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      bedrooms,
      bathrooms,
      type,
      city
    });
  }, [searchParams, mounted]);

  // Load properties function
  const loadProperties = useCallback(async () => {
    if (!mounted) return;

    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(filters.search && { search: filters.search }),
        ...(filters.minPrice > 0 && { minPrice: filters.minPrice.toString() }),
        ...(filters.maxPrice < 100000000 && { maxPrice: filters.maxPrice.toString() }),
        ...(filters.minArea > 0 && { minArea: filters.minArea.toString() }),
        ...(filters.maxArea < 10000 && { maxArea: filters.maxArea.toString() }),
        ...(filters.bedrooms > 0 && { bedrooms: filters.bedrooms.toString() }),
        ...(filters.bathrooms > 0 && { bathrooms: filters.bathrooms.toString() }),
        ...(filters.type && { type: filters.type }),
        ...(filters.city && { city: filters.city })
      });

      const response = await http.get(`/api/v1/properties?${queryParams}`);
      const data = response.data;

      if (data.success) {
        setProperties(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.count || 0);
      } else {
        setError('Failed to load properties');
      }
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [mounted, currentPage, filters]);

  // Load properties when filters or page changes
  useEffect(() => {
    if (mounted) {
      loadProperties();
    }
  }, [loadProperties, mounted]);

  // Handle filter changes
  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    loadProperties();
  };

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Handle property click
  const handlePropertyClick = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Show loading state until mounted
  if (!mounted) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <CircularProgress size={60} sx={{ color: '#78CADC' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: isDark 
        ? 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)' 
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: 4
    }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              color: isDark ? '#ffffff' : '#1a202c',
              textAlign: 'center'
            }}
          >
            Find Your Dream Property
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: isDark ? '#a0aec0' : '#4a5568',
              textAlign: 'center',
              mb: 3
            }}
          >
            Discover {totalCount} properties available
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Card sx={{ 
          mb: 4, 
          background: isDark ? '#1a202c' : '#ffffff',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by location, property type, or keywords..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                sx={{ flex: 1, minWidth: '300px' }}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: '#78CADC' }} />
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  background: '#78CADC',
                  '&:hover': { background: '#5a9bb8' },
                  px: 4
                }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowFilters(!showFilters)}
                startIcon={<FilterList />}
                sx={{ borderColor: '#78CADC', color: '#78CADC' }}
              >
                Filters
              </Button>
            </Box>

            {/* Advanced Filters */}
            {showFilters && (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
                gap: 2,
                mt: 2,
                pt: 2,
                borderTop: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`
              }}>
                <TextField
                  label="Min Price"
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
                  sx={{ minWidth: '120px' }}
                />
                <TextField
                  label="Max Price"
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 100000000)}
                  sx={{ minWidth: '120px' }}
                />
                <TextField
                  label="Min Area (sq ft)"
                  type="number"
                  value={filters.minArea}
                  onChange={(e) => handleFilterChange('minArea', parseInt(e.target.value) || 0)}
                  sx={{ minWidth: '120px' }}
                />
                <TextField
                  label="Max Area (sq ft)"
                  type="number"
                  value={filters.maxArea}
                  onChange={(e) => handleFilterChange('maxArea', parseInt(e.target.value) || 10000)}
                  sx={{ minWidth: '120px' }}
                />
                <TextField
                  label="Bedrooms"
                  type="number"
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', parseInt(e.target.value) || 0)}
                  sx={{ minWidth: '120px' }}
                />
                <TextField
                  label="Bathrooms"
                  type="number"
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', parseInt(e.target.value) || 0)}
                  sx={{ minWidth: '120px' }}
                />
                <TextField
                  label="Property Type"
                  select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  SelectProps={{ native: true }}
                  sx={{ minWidth: '120px' }}
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                </TextField>
                <TextField
                  label="City"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  sx={{ minWidth: '120px' }}
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ color: '#78CADC' }} />
          </Box>
        )}

        {/* Properties Grid */}
        {!loading && properties.length > 0 && (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {properties.map((property) => (
                <Grid item xs={12} sm={6} md={4} key={property._id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      background: isDark ? '#1a202c' : '#ffffff',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                    onClick={() => handlePropertyClick(property._id)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={property.images?.[0]?.url || '/placeholder-property.jpg'}
                      alt={property.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        sx={{ 
                          fontWeight: 'bold', 
                          mb: 1,
                          color: isDark ? '#ffffff' : '#1a202c',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {property.title}
                      </Typography>
                      
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: '#78CADC', 
                          fontWeight: 'bold', 
                          mb: 2 
                        }}
                      >
                        {formatPrice(property.price)}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ fontSize: 16, color: '#78CADC', mr: 0.5 }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: isDark ? '#a0aec0' : '#4a5568',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {property.address?.street}, {property.address?.city}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Bed sx={{ fontSize: 16, color: '#78CADC', mr: 0.5 }} />
                          <Typography variant="body2">{property.bedrooms}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Bathroom sx={{ fontSize: 16, color: '#78CADC', mr: 0.5 }} />
                          <Typography variant="body2">{property.bathrooms}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SquareFoot sx={{ fontSize: 16, color: '#78CADC', mr: 0.5 }} />
                          <Typography variant="body2">{property.area} sq ft</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={property.type} 
                          size="small" 
                          sx={{ 
                            background: '#78CADC', 
                            color: 'white',
                            textTransform: 'capitalize'
                          }} 
                        />
                        <Chip 
                          label={property.status} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            borderColor: '#78CADC', 
                            color: '#78CADC',
                            textTransform: 'capitalize'
                          }} 
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: isDark ? '#ffffff' : '#1a202c'
                    },
                    '& .MuiPaginationItem-root.Mui-selected': {
                      background: '#78CADC',
                      color: 'white'
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}

        {/* No Properties Found */}
        {!loading && properties.length === 0 && !error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: isDark ? '#ffffff' : '#1a202c',
                mb: 2 
              }}
            >
              No properties found
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: isDark ? '#a0aec0' : '#4a5568',
                mb: 3 
              }}
            >
              Try adjusting your search criteria
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setFilters({
                  search: '',
                  minPrice: 0,
                  maxPrice: 100000000,
                  minArea: 0,
                  maxArea: 10000,
                  bedrooms: 0,
                  bathrooms: 0,
                  type: '',
                  city: ''
                });
                setCurrentPage(1);
              }}
              sx={{
                background: '#78CADC',
                '&:hover': { background: '#5a9bb8' }
              }}
            >
              Clear Filters
            </Button>
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
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <CircularProgress size={60} sx={{ color: '#78CADC' }} />
      </Box>
    }>
      <PropertiesPageContent />
    </Suspense>
  );
};

export default PropertiesPage;