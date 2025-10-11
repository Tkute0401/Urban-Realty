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
  InputLabel
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import { useProperties } from '@/contexts/PropertiesContext';
import PropertyList from '@/components/property/PropertyList';

const PropertiesPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { properties, loading, error, pagination, getProperties } = useProperties();
  
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    city: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const city = searchParams.get('city') || '';

    setFilters(prev => ({ ...prev, search, type, city }));
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
    if (filters.status) params.status = filters.status;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.bedrooms) params.bedrooms = filters.bedrooms;
    if (filters.city) params.city = filters.city;

    getProperties(params);
  };

  const handleSearch = () => {
    loadProperties();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    getProperties({ ...filters, page, limit: 12 });
  };

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
      py: 4
    }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              color: 'var(--color-text-primary)'
            }}
          >
            Find Your Dream Property
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'var(--color-text-muted)',
              mb: 3
            }}
          >
            Discover {pagination.total} properties available
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Card sx={{ 
          mb: 4, 
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
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
                sx={{ 
                  flex: 1, 
                  minWidth: '300px',
                  '& .MuiOutlinedInput-root': {
                    background: 'var(--color-bg)',
                    color: 'var(--color-text-primary)',
                    '& fieldset': {
                      borderColor: 'var(--color-border)'
                    }
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
                  background: 'var(--color-primary)',
                  color: 'var(--color-primary-contrast)',
                  '&:hover': { background: 'var(--color-primary-hover)' },
                  px: 4
                }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowFilters(!showFilters)}
                startIcon={<FilterList />}
                sx={{ 
                  borderColor: 'var(--color-primary)', 
                  color: 'var(--color-primary)',
                  '&:hover': {
                    borderColor: 'var(--color-primary-hover)',
                    background: 'var(--color-primary-light)'
                  }
                }}
              >
                Filters
              </Button>
            </Box>

            {/* Advanced Filters */}
            {showFilters && (
              <Grid container spacing={2} sx={{ 
                mt: 2,
                pt: 2,
                borderTop: '1px solid var(--color-border)'
              }}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'var(--color-text-muted)' }}>Property Type</InputLabel>
                    <Select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      sx={{
                        background: 'var(--color-bg)',
                        color: 'var(--color-text-primary)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'var(--color-border)'
                        }
                      }}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="Apartment">Apartment</MenuItem>
                      <MenuItem value="House">House</MenuItem>
                      <MenuItem value="Villa">Villa</MenuItem>
                      <MenuItem value="Condo">Condo</MenuItem>
                      <MenuItem value="Commercial">Commercial</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'var(--color-text-muted)' }}>Status</InputLabel>
                    <Select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      sx={{
                        background: 'var(--color-bg)',
                        color: 'var(--color-text-primary)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'var(--color-border)'
                        }
                      }}
                    >
                      <MenuItem value="">All Status</MenuItem>
                      <MenuItem value="For Sale">For Sale</MenuItem>
                      <MenuItem value="For Rent">For Rent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Min Price"
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
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
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Max Price"
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
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
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Bedrooms"
                    type="number"
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
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
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="City"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
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
            )}
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Properties List */}
        <PropertyList
          properties={properties}
          loading={loading}
          error={error}
          emptyMessage="No properties found"
          columns={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          onPropertyClick={(property) => router.push(`/properties/${property._id}`)}
        />

        {/* Pagination */}
        {!loading && properties.length > 0 && pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'var(--color-text-primary)'
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  background: 'var(--color-primary)',
                  color: 'var(--color-primary-contrast)'
                }
              }}
            />
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
