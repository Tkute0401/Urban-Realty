'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Checkbox,
  FormControlLabel,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme as useMuiTheme
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Close, 
  LocationOn,
  Home,
  LocalHotel,
  Bathtub,
  SquareFoot
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeProvider';
import PropertyList from '@/components/property/PropertyList';
import http from '@/lib/services/http';
import PropertyMap from '@/components/property/PropertyMap';

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
  };
  images?: Array<{ url: string }>;
  projectDetails?: {
    launchDate?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface Filters {
  search: string;
  type: string;
  status: string;
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  bedrooms: number[];
  bathrooms: number[];
  city: string;
  amenities: string[];
}

const PropertiesPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    type: '',
    status: '',
    minPrice: 0,
    maxPrice: 100000000,
    minArea: 0,
    maxArea: 10000,
    bedrooms: [],
    bathrooms: [],
    city: '',
    amenities: []
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);

  const isDark = theme === 'dark';

  // Load properties from API
  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '' && value !== 0) {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              queryParams.append(key, value.join(','));
            }
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
      
      queryParams.append('page', currentPage.toString());
      queryParams.append('limit', '12');

      const response = await http.get(`/api/v1/properties?${queryParams.toString()}`);
      const data = response.data;
      setProperties(data.properties || []);
      setTotalPages(data.totalPages || 1);
      setTotalProperties(data.total || 0);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  // Load properties on mount and when filters change
  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  // Initialize filters from URL params
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const city = searchParams.get('city') || '';
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '100000000');

    setFilters(prev => ({
      ...prev,
      search,
      type,
      status,
      city,
      minPrice,
      maxPrice
    }));
  }, [searchParams]);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = () => {
    // Update URL with current filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 0) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.append(key, value.join(','));
          }
        } else {
          params.append(key, value.toString());
        }
      }
    });
    
    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      status: '',
      minPrice: 0,
      maxPrice: 100000000,
      minArea: 0,
      maxArea: 10000,
      bedrooms: [],
      bathrooms: [],
      city: '',
      amenities: []
    });
    setCurrentPage(1);
    router.push('/properties');
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const propertyTypes = [
    'Apartment', 'Villa', 'House', 'Land', 'Commercial', 'Office', 'Shop'
  ];

  const amenities = [
    'Parking', 'Gym', 'Swimming Pool', 'Garden', 'Security', 'Lift', 
    'Power Backup', 'Water Supply', 'Internet', 'Air Conditioning'
  ];

  const bedroomOptions = [1, 2, 3, 4, 5, 6];
  const bathroomOptions = [1, 2, 3, 4, 5];

  const FilterSection = () => (
    <Paper sx={{
      p: 3,
      background: isDark ? 'rgba(11, 16, 17, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
      borderRadius: '12px'
    }}>
      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search properties..."
        value={filters.search}
        onChange={(e) => handleFilterChange('search', e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#78CADC' }} />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Property Type */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Property Type</InputLabel>
        <Select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          label="Property Type"
        >
          <MenuItem value="">All Types</MenuItem>
          {propertyTypes.map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Status */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          label="Status"
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="For Sale">For Sale</MenuItem>
          <MenuItem value="For Rent">For Rent</MenuItem>
        </Select>
      </FormControl>

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>
          Price Range: ₹{filters.minPrice.toLocaleString()} - ₹{filters.maxPrice.toLocaleString()}
        </Typography>
        <Slider
          value={[filters.minPrice, filters.maxPrice]}
          onChange={(_, newValue) => {
            const [min, max] = newValue as number[];
            handleFilterChange('minPrice', min);
            handleFilterChange('maxPrice', max);
          }}
          min={0}
          max={100000000}
          step={100000}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
        />
      </Box>

      {/* Area Range */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>
          Area Range: {filters.minArea} - {filters.maxArea} sqft
        </Typography>
        <Slider
          value={[filters.minArea, filters.maxArea]}
          onChange={(_, newValue) => {
            const [min, max] = newValue as number[];
            handleFilterChange('minArea', min);
            handleFilterChange('maxArea', max);
          }}
          min={0}
          max={10000}
          step={100}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value} sqft`}
        />
      </Box>

      {/* Bedrooms */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Bedrooms</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {bedroomOptions.map(beds => (
            <Chip
              key={beds}
              label={`${beds} Bed`}
              onClick={() => {
                const newBeds = filters.bedrooms.includes(beds)
                  ? filters.bedrooms.filter(b => b !== beds)
                  : [...filters.bedrooms, beds];
                handleFilterChange('bedrooms', newBeds);
              }}
              color={filters.bedrooms.includes(beds) ? 'primary' : 'default'}
              variant={filters.bedrooms.includes(beds) ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      {/* Bathrooms */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Bathrooms</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {bathroomOptions.map(baths => (
            <Chip
              key={baths}
              label={`${baths} Bath`}
              onClick={() => {
                const newBaths = filters.bathrooms.includes(baths)
                  ? filters.bathrooms.filter(b => b !== baths)
                  : [...filters.bathrooms, baths];
                handleFilterChange('bathrooms', newBaths);
              }}
              color={filters.bathrooms.includes(baths) ? 'primary' : 'default'}
              variant={filters.bathrooms.includes(baths) ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      {/* Amenities */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Amenities</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {amenities.map(amenity => (
            <Chip
              key={amenity}
              label={amenity}
              onClick={() => {
                const newAmenities = filters.amenities.includes(amenity)
                  ? filters.amenities.filter(a => a !== amenity)
                  : [...filters.amenities, amenity];
                handleFilterChange('amenities', newAmenities);
              }}
              color={filters.amenities.includes(amenity) ? 'primary' : 'default'}
              variant={filters.amenities.includes(amenity) ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            flex: 1,
            background: '#78CADC',
            '&:hover': { background: '#5fb4c9' }
          }}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          onClick={clearFilters}
          sx={{ flex: 1 }}
        >
          Clear
        </Button>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{
      background: isDark ? 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh'
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              color: isDark ? 'white' : 'text.primary'
            }}
          >
            Properties
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
              mb: 3
            }}
          >
            {totalProperties} properties found
          </Typography>

          {/* Mobile Filter Button */}
          {isMobile && (
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilterDrawerOpen(true)}
              sx={{ mb: 3 }}
            >
              Filters
            </Button>
          )}
        </Box>

        <Grid container spacing={4}>
          {/* Desktop Filters */}
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <FilterSection />
            </Grid>
          )}

          {/* Properties and Map */}
          <Grid item xs={12} md={!isMobile ? 9 : 12}>
            <Grid container spacing={4}>
              {/* Properties List */}
              <Grid item xs={12} lg={selectedProperty ? 8 : 12}>
                <PropertyList
                  properties={properties}
                  loading={loading}
                  error={error}
                  onPropertyClick={handlePropertyClick}
                  selectedProperty={selectedProperty}
                  showPagination={true}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </Grid>

              {/* Map */}
              {selectedProperty && selectedProperty.location && (
                <Grid item xs={12} lg={4}>
                  <Box sx={{ position: 'sticky', top: 100 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: isDark ? 'white' : 'text.primary' }}>
                      Location
                    </Typography>
                    <PropertyMap
                      latitude={selectedProperty.location.latitude}
                      longitude={selectedProperty.location.longitude}
                      address={`${selectedProperty.address?.street || ''} ${selectedProperty.address?.city || ''} ${selectedProperty.address?.state || ''}`.trim()}
                      height="400px"
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="right"
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: '100%',
              maxWidth: 400,
              background: isDark ? '#0B1011' : '#ffffff'
            }
          }}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <Box sx={{ p: 2 }}>
            <FilterSection />
          </Box>
        </Drawer>
      </Container>
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
        <Typography>Loading...</Typography>
      </Box>
    }>
      <PropertiesPageContent />
    </Suspense>
  );
};

export default PropertiesPage;
