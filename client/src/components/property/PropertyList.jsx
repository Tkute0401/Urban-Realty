import React, { useEffect, useRef, useState } from 'react';
import { useProperties } from '../../context/PropertiesContext';
import { useSearchParams } from 'react-router-dom';
import { 
  Box, Grid, Typography, CircularProgress, Button, 
  Container, Pagination, Stack, useMediaQuery, useTheme,
  ToggleButtonGroup, ToggleButton
} from '@mui/material';
import PropertyCard from './PropertyCard';
import { Add, Refresh } from '@mui/icons-material';
import BedBath from './BedBath';
import HomeType from './HomeType';
import More from './More';
import PriceDropdown from './PriceDropdown';

const PropertyList = () => {
  const { properties, loading, error, getProperties } = useProperties();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLoad = useRef(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('ALL');
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    priceMin: '',
    priceMax: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    minArea: '',
    maxArea: ''
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const itemsPerPage = 12;

  const amenityOptions = [
    'Parking',
    'Swimming Pool',
    'Gym',
    'Security',
    'Garden',
    'Balcony',
    'WiFi',
    'Air Conditioning',
    'Furnished',
    'Pet Friendly',
    'Elevator',
    'Laundry',
    'Storage'
  ];

  useEffect(() => {
    const urlSearchTerm = searchParams.get('search');
    const urlType = searchParams.get('type');
    const urlStatus = searchParams.get('status');
    const urlCity = searchParams.get('city');
    const urlState = searchParams.get('state');
    const urlPriceMin = searchParams.get('priceMin');
    const urlPriceMax = searchParams.get('priceMax');
    const urlBedrooms = searchParams.get('bedrooms');
    const urlBathrooms = searchParams.get('bathrooms');
    const urlAmenities = searchParams.get('amenities');
    const urlMinArea = searchParams.get('minArea');
    const urlMaxArea = searchParams.get('maxArea');
    const urlPropertyType = searchParams.get('propertyType');
    
    if (urlSearchTerm) setSearchTerm(urlSearchTerm);
    
    if (urlPropertyType) {
      setPropertyType(urlPropertyType);
    }

    if (urlType) {
      setFilters(prev => ({ ...prev, type: urlType }));
    }

    if (urlStatus) {
      setFilters(prev => ({ ...prev, status: urlStatus }));
    }

    const newFilters = {};
    if (urlCity) newFilters.city = urlCity;
    if (urlState) newFilters.state = urlState;
    if (urlPriceMin) newFilters.priceMin = urlPriceMin;
    if (urlPriceMax) newFilters.priceMax = urlPriceMax;
    if (urlBedrooms) newFilters.bedrooms = urlBedrooms;
    if (urlBathrooms) newFilters.bathrooms = urlBathrooms;
    if (urlAmenities) newFilters.amenities = urlAmenities.split(',');
    if (urlMinArea) newFilters.minArea = urlMinArea;
    if (urlMaxArea) newFilters.maxArea = urlMaxArea;

    setFilters(prev => ({ ...prev, ...newFilters }));

    const fetchParams = {
      ...(urlSearchTerm && { search: urlSearchTerm }),
      ...(urlType && { type: urlType }),
      ...(urlStatus && { status: urlStatus }),
      ...newFilters
    };
    
    getProperties(fetchParams);
    setIsLoaded(true);
  }, [searchParams, getProperties]);

  const handlePropertyTypeChange = (event, newType) => {
    if (newType !== null) {
      setPropertyType(newType);
      const params = new URLSearchParams(searchParams);
      params.set('propertyType', newType);
      setSearchParams(params);
      
      const statusFilter = newType === 'ALL' ? null : newType === 'BUY' ? 'For Sale' : 'For Rent';
      
      const updatedFilters = { ...filters };
      if (statusFilter) {
        updatedFilters.status = statusFilter;
      } else {
        delete updatedFilters.status;
      }
      
      getProperties(updatedFilters);
      setPage(1);
    }
  };

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    const params = new URLSearchParams(searchParams);
    if (searchTerm) params.set('search', searchTerm);
    if (updatedFilters.type) params.set('type', updatedFilters.type);
    if (updatedFilters.city) params.set('city', updatedFilters.city);
    if (updatedFilters.state) params.set('state', updatedFilters.state);
    if (updatedFilters.priceMin) params.set('priceMin', updatedFilters.priceMin);
    if (updatedFilters.priceMax) params.set('priceMax', updatedFilters.priceMax);
    if (updatedFilters.bedrooms) params.set('bedrooms', updatedFilters.bedrooms);
    if (updatedFilters.bathrooms) params.set('bathrooms', updatedFilters.bathrooms);
    if (updatedFilters.amenities?.length > 0) params.set('amenities', updatedFilters.amenities.join(','));
    if (updatedFilters.minArea) params.set('minArea', updatedFilters.minArea);
    if (updatedFilters.maxArea) params.set('maxArea', updatedFilters.maxArea);
    
    setSearchParams(params);
    getProperties({
      ...updatedFilters,
      status: propertyType === 'ALL' ? '' : propertyType === 'BUY' ? 'For Sale' : 'For Rent'
    });
    setPage(1);
  };

  const removeFilter = (filterKey) => {
    const updatedFilters = { ...filters };
    updatedFilters[filterKey] = filterKey === 'amenities' ? [] : '';
    setFilters(updatedFilters);
    
    const params = new URLSearchParams(searchParams);
    params.delete(filterKey);
    setSearchParams(params);
    
    getProperties({
      ...updatedFilters,
      status: propertyType === 'ALL' ? '' : propertyType === 'BUY' ? 'For Sale' : 'For Rent'
    });
    setPage(1);
  };

  const handlePriceFilter = (min, max) => {
    handleFilterChange({ priceMin: min, priceMax: max });
  };

  const handleBedBathFilter = (bedrooms, bathrooms) => {
    handleFilterChange({ bedrooms, bathrooms });
  };

  const handleHomeTypeFilter = (type) => {
    handleFilterChange({ type });
  };

  const filteredProperties = properties?.filter(property => {
    if (propertyType !== 'ALL') {
      const statusMatch = propertyType === 'BUY' 
        ? property.status === 'For Sale' 
        : property.status === 'For Rent';
      if (!statusMatch) return false;
    }
    
    if (searchTerm) {
      const matchesSearch = 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address?.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.buildingName?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
    }
    
    if (filters.type && property.type !== filters.type) return false;
    
    if (filters.city && property.address.city.toLowerCase() !== filters.city.toLowerCase()) return false;
    
    if (filters.state && property.address.state.toLowerCase() !== filters.state.toLowerCase()) return false;
    
    if (filters.priceMin && property.price < parseInt(filters.priceMin)) return false;
    if (filters.priceMax && property.price > parseInt(filters.priceMax)) return false;
    
    if (filters.bedrooms) {
      if (filters.bedrooms.endsWith('+')) {
        const minBedrooms = parseInt(filters.bedrooms);
        if (property.bedrooms < minBedrooms) return false;
      } else if (property.bedrooms !== parseInt(filters.bedrooms)) {
        return false;
      }
    }
    
    if (filters.bathrooms) {
      if (filters.bathrooms.endsWith('+')) {
        const minBathrooms = parseFloat(filters.bathrooms);
        if (property.bathrooms < minBathrooms) return false;
      } else if (property.bathrooms !== parseFloat(filters.bathrooms)) {
        return false;
      }
    }
    
    if (filters.minArea && property.area < parseInt(filters.minArea)) return false;
    if (filters.maxArea && property.area > parseInt(filters.maxArea)) return false;
    
    if (filters.amenities?.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity => 
        property.amenities.includes(amenity)
      );
      if (!hasAllAmenities) return false;
    }
    
    return true;
  }) || [];

  const paginatedProperties = filteredProperties.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && initialLoad.current) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '50vh'
      }}>
        <CircularProgress size={isMobile ? 40 : 60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          Error loading properties
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>{error}</Typography>
        <Button 
          variant="contained" 
          onClick={getProperties}
          startIcon={<Refresh />}
          size={isMobile ? 'small' : 'medium'}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <div className={`main-container ${isLoaded ? 'fade-in' : ''}`} style={{ 
      backgroundColor: '#08171A',
      color: 'white',
      minHeight: '100vh',
      padding: isMobile ? '1rem' : '2rem'
    }}>
      <div className="breadcrumb fade-in-delay-1" style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1rem 2rem',
        fontSize: '0.9rem'
      }}>
        <a href="/" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s ease' }}>HOME</a>
        <span className="separator" style={{ color: '#555', margin: '0 4px' }}>&gt;</span>
        <a href="#" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s ease' }}>PROPERTIES</a>
      </div>

      <div className="page-title fade-in-delay-2" style={{ 
        padding: '0 2rem',
        marginBottom: '1rem'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          marginBottom: '0.5rem',
          fontWeight: 'bold'
        }}>
          {propertyType === 'RENT' ? 'Rental' : propertyType === 'BUY' ? 'Luxury' : ''} Properties{' '}
          {propertyType === 'RENT' ? 'for Rent' : propertyType === 'BUY' ? 'for Sale' : ''}
        </h1>
        <div className="listings-count" style={{ fontSize: '1rem', color: '#ccc', marginBottom: '1rem' }}>
          {filteredProperties.length} LISTINGS
        </div>
      </div>

      {/* Combined toggle and filters row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Toggle buttons (left side) */}
        <ToggleButtonGroup
          value={propertyType}
          exclusive
          onChange={handlePropertyTypeChange}
          aria-label="property type"
          sx={{
            '& .MuiToggleButton-root': {
              color: 'white',
              borderColor: '#333',
              '&.Mui-selected': {
                backgroundColor: '#78CADC',
                color: '#08171A',
                '&:hover': {
                  backgroundColor: '#5cb3c5'
                }
              },
              '&:hover': {
                backgroundColor: '#1a2a30'
              }
            }
          }}
        >
          <ToggleButton value="ALL" aria-label="all properties">
            All
          </ToggleButton>
          <ToggleButton value="BUY" aria-label="buy properties">
            Buy
          </ToggleButton>
          <ToggleButton value="RENT" aria-label="rent properties">
            Rent
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Filter buttons (right side) */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: isMobile ? 'center' : 'flex-end'
        }}>
          <PriceDropdown 
            activeBtn={propertyType === 'RENT' ? 'RENT' : 'BUY'} 
            onApply={handlePriceFilter}
            currentMin={filters.priceMin}
            currentMax={filters.priceMax}
          />
          
          <BedBath 
            onApply={handleBedBathFilter}
            currentBedrooms={filters.bedrooms}
            currentBathrooms={filters.bathrooms}
          />
          
          <HomeType 
            onApply={handleHomeTypeFilter}
            currentType={filters.type}
          />
          
          <More 
            onApply={(moreFilters) => handleFilterChange(moreFilters)}
            currentFilters={filters}
            amenityOptions={amenityOptions}
          />
        </div>
      </div>

      {/* Active filters */}
      {Object.entries(filters).filter(([key, value]) => 
        value && (Array.isArray(value) ? value.length > 0 : true))
        .length > 0 && (
        <div className="filter-tags fade-in-delay-3" style={{ 
          display: 'flex',
          gap: '1rem',
          padding: '0 2rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          justifyContent: isMobile ? 'center' : 'flex-start'
        }}>
          {Object.entries(filters).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            
            if (Array.isArray(value)) {
              return value.map(item => (
                <div key={`${key}-${item}`} className="filter-tag" style={{ 
                  backgroundColor: '#0B1011',
                  border: '1px solid #333',
                  borderRadius: '50px',
                  padding: '0.5rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}>
                  <span className="filter-label" style={{ fontSize: '0.9rem' }}>
                    {key.toUpperCase()}: {item}
                  </span>
                  <button onClick={() => {
                    const updatedAmenities = filters.amenities.filter(a => a !== item);
                    handleFilterChange({ amenities: updatedAmenities });
                  }} style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    transition: 'transform 0.2s ease'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ));
            }
            
            return (
              <div key={key} className="filter-tag" style={{ 
                backgroundColor: '#0B1011',
                border: '1px solid #333',
                borderRadius: '50px',
                padding: '0.5rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}>
                <span className="filter-label" style={{ fontSize: '0.9rem' }}>
                  {key.toUpperCase()}: {value}
                </span>
                <button onClick={() => removeFilter(key)} style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0',
                  transition: 'transform 0.2s ease'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Property listings or empty state */}
      {!properties || properties.length === 0 ? (
        <Container maxWidth="md" sx={{ 
          py: 4, 
          textAlign: 'center',
          backgroundColor: 'rgba(11, 16, 17, 0.5)',
          borderRadius: '8px',
          margin: '2rem auto'
        }}>
          <Typography variant="h6" gutterBottom>
            No properties found matching your criteria
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Try adjusting your filters or search terms
          </Typography>
          <Button 
            variant="contained" 
            onClick={getProperties}
            startIcon={<Refresh />}
            size={isMobile ? 'small' : 'medium'}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button 
            variant="outlined" 
            href="/add-property"
            startIcon={<Add />}
            size={isMobile ? 'small' : 'medium'}
            sx={{ ml: 1 }}
          >
            Add Property
          </Button>
        </Container>
      ) : (
        <>
          <div className="property-listings fade-in-delay-4" style={{ 
            display: 'flex',
            padding: '0 2rem',
            gap: '2rem',
            position: 'relative',
            zIndex: 1,
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <div className="property-grid" style={{ 
              flex: 2,
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {paginatedProperties.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
            
            {!isMobile && (
              <div className="map-container" style={{ flex: 1, minHeight: '400px' }}>
                <div className="map-placeholder" style={{
                  backgroundColor: '#eee',
                  height: '100%',
                  minHeight: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#333',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  background: 'linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s infinite'
                }}>
                  <span>View larger map</span>
                </div>
              </div>
            )}
          </div>

          {filteredProperties.length > itemsPerPage && (
            <Stack spacing={1} sx={{ 
              mt: 4, 
              alignItems: 'center',
              padding: '0 2rem'
            }}>
              <Pagination
                count={Math.ceil(filteredProperties.length / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
                siblingCount={isMobile ? 0 : 1}
                sx={{ 
                  '& .MuiPaginationItem-root': { 
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    color: 'white'
                  },
                  '& .MuiPaginationItem-root.Mui-selected': {
                    backgroundColor: '#78CADC',
                    color: '#08171A'
                  }
                }}
              />
              <Typography variant="caption" color="#ccc">
                {paginatedProperties.length} of {filteredProperties.length} properties
              </Typography>
            </Stack>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyList;