import React, { useEffect, useRef, useState } from 'react';
import { useProperties } from '../../context/PropertiesContext';
import { useSearchParams } from 'react-router-dom';
import { 
  Box, Grid, Typography, CircularProgress, Button, 
  Container, Pagination, Stack, useMediaQuery, useTheme,
  Drawer, IconButton, Divider
} from '@mui/material';
import PropertyCard from './PropertyCard';
import { Add, Refresh, FilterList, Close, Search } from '@mui/icons-material';
import BedBath from './BedBath';
import HomeType from './HomeType';
import More from './More';
import PriceDropdown from './PriceDropdown';
import './PropertyList.css';

const PropertyList = () => {
  const { properties, loading, error, getProperties } = useProperties();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLoad = useRef(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [page, setPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const itemsPerPage = isMobile ? 6 : 12;

  // Initialize filters from URL or defaults
  const [filters, setFilters] = useState(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      search: params.search || '',
      propertyType: params.propertyType || 'ALL',
      type: params.type || '',
      city: params.city || '',
      state: params.state || '',
      priceMin: params.priceMin || '',
      priceMax: params.priceMax || '',
      bedrooms: params.bedrooms || '',
      bathrooms: params.bathrooms || '',
      amenities: params.amenities ? params.amenities.split(',') : [],
      minArea: params.minArea || '',
      maxArea: params.maxArea || ''
    };
  });

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

  // Fetch properties when filters change
  useEffect(() => {
    const fetchData = async () => {
      const apiParams = {
        // Your API params here
      };

      await getProperties(apiParams);
      
      const newSearchParams = new URLSearchParams();
      Object.entries(apiParams).forEach(([key, value]) => {
        if (value) newSearchParams.set(key, value);
      });
      setSearchParams(newSearchParams);

      setTimeout(() => setIsLoaded(true), 100);
    };

    fetchData();
  }, [filters, getProperties, setSearchParams]);

  // Handler for property type change
  const handlePropertyTypeChange = (newType) => {
    setFilters(prev => ({ ...prev, propertyType: newType }));
    setPage(1);
  };

  // Generic filter update handler
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  // Remove specific filter
  const removeFilter = (filterKey) => {
    const updatedFilters = {
      ...filters,
      [filterKey]: Array.isArray(filters[filterKey]) ? [] : ''
    };
    
    setFilters(updatedFilters);
    
    if (filterKey === 'type') {
      handleHomeTypeFilter('');
    } else if (filterKey === 'bedrooms' || filterKey === 'bathrooms') {
      handleBedBathFilter('', '');
    } else if (filterKey === 'priceMin' || filterKey === 'priceMax') {
      handlePriceFilter('', '');
    }
    
    setPage(1);
  };

  // Specialized filter handlers
  const handlePriceFilter = (min, max) => {
    handleFilterChange({ 
      priceMin: min ? min.toString() : '',
      priceMax: max ? max.toString() : '' 
    });
  };

  const handleBedBathFilter = (bedrooms, bathrooms) => {
    handleFilterChange({ 
      bedrooms: bedrooms ? bedrooms.toString() : '',
      bathrooms: bathrooms ? bathrooms.toString() : '' 
    });
  };

  const handleHomeTypeFilter = (type) => {
    const typeMap = {
      'Houses': 'House',
      'Condos/Co-ops': 'Condo',
      'Townhomes': 'Townhouse',
      'Multi-family': 'Apartment',
      'Manufactured': 'Manufactured',
      'Lots/Land': 'Land',
      'Apartments': 'Apartment'
    };
    
    const dbType = typeMap[type] || type;
    handleFilterChange({ type: dbType });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterChange({ search: filters.search });
    if (isMobile) setSearchExpanded(false);
  };

  // Filter properties client-side
  const filteredProperties = properties?.filter(property => {
    // Your filtering logic here
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
        minHeight: '50vh',
        background: '#08171A'
      }}>
        <CircularProgress size={isMobile ? 40 : 60} sx={{ color: '#78CADC' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center', color: 'white', background: '#08171A' }}>
        <Typography color="error" gutterBottom>
          Error loading properties
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'white' }}>{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => getProperties({})}
          startIcon={<Refresh />}
          size={isMobile ? 'small' : 'medium'}
          sx={{ backgroundColor: '#78CADC', '&:hover': { backgroundColor: '#5cb3c5' } }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  // Mobile Filters Drawer
  const renderMobileFilters = () => (
    <Drawer
      anchor="right"
      open={mobileFiltersOpen}
      onClose={() => setMobileFiltersOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: '85vw',
          maxWidth: '400px',
          backgroundColor: '#0B1011',
          color: 'white',
          padding: '20px'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={() => setMobileFiltersOpen(false)} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>
      <Divider sx={{ bgcolor: '#333', mb: 3 }} />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Property Type</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {['ALL', 'BUY', 'RENT'].map(type => (
              <Button
                key={type}
                variant={filters.propertyType === type ? 'contained' : 'outlined'}
                onClick={() => handlePropertyTypeChange(type)}
                sx={{
                  flex: 1,
                  backgroundColor: filters.propertyType === type ? '#78CADC' : 'transparent',
                  color: filters.propertyType === type ? '#08171A' : 'white',
                  borderColor: '#78CADC',
                  '&:hover': {
                    backgroundColor: filters.propertyType === type ? '#5cb3c5' : 'rgba(120, 202, 220, 0.1)'
                  }
                }}
              >
                {type}
              </Button>
            ))}
          </Box>
        </Box>
        
        <HomeType 
          onApply={handleHomeTypeFilter}
          currentType={filters.type}
        />
        
        <PriceDropdown 
          activeBtn={filters.propertyType === 'RENT' ? 'RENT' : 'BUY'} 
          onApply={handlePriceFilter}
          currentMin={filters.priceMin}
          currentMax={filters.priceMax}
        />
        
        <BedBath 
          onApply={handleBedBathFilter}
          currentBedrooms={filters.bedrooms}
          currentBathrooms={filters.bathrooms}
        />
        
        <More 
          onApply={(moreFilters) => handleFilterChange(moreFilters)}
          currentFilters={filters}
          amenityOptions={amenityOptions}
        />
      </Box>
      
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => setMobileFiltersOpen(false)}
          sx={{
            backgroundColor: '#78CADC',
            color: '#08171A',
            '&:hover': { backgroundColor: '#5cb3c5' }
          }}
        >
          Apply Filters
        </Button>
      </Box>
    </Drawer>
  );

  return (
    <div className={`main-container ${isLoaded ? 'fade-in-delay-1' : ''}`}>
      {/* Mobile Search Header */}
      {isMobile && !searchExpanded && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: '#08171A',
          position: 'sticky',
          top: 0,
          zIndex: 1100
        }}>
          <IconButton onClick={() => setSearchExpanded(true)} sx={{ color: 'white' }}>
            <Search />
          </IconButton>
          <IconButton onClick={() => setMobileFiltersOpen(true)} sx={{ color: 'white' }}>
            <FilterList />
          </IconButton>
        </Box>
      )}

      {/* Expanded Mobile Search */}
      {isMobile && searchExpanded && (
        <Box sx={{
          padding: '12px 16px',
          backgroundColor: '#08171A',
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <IconButton onClick={() => setSearchExpanded(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
          <form onSubmit={handleSearchSubmit} style={{ flex: 1 }}>
            <input 
              type="text" 
              className="mobile-search-input"
              placeholder="Search by location..." 
              value={filters.search} 
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              autoFocus
            />
          </form>
        </Box>
      )}

      {/* Desktop Navbar with search */}
      {!isMobile && (
        <div className="Navbar">
          <form onSubmit={handleSearchSubmit} className="search-container slide-in-left">
            <input 
              type="searchbar" 
              placeholder="SEARCH BY LOCATION (STATE OR CITY)" 
              value={filters.search} 
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            <button type="submit" className="search-button">
              <SearchIcon />
            </button>
          </form>
          <div className="NavbarBtn slide-in-right">
            <div className="BuyRentToggle">
              {['ALL', 'BUY', 'RENT'].map(type => (
                <button 
                  key={type}
                  id={`${type}Btn`}
                  className={`${filters.propertyType === type ? 'bg-[#78CADC] text-black' : 'bg-black-400 text-white'}`}
                  onClick={() => handlePropertyTypeChange(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="OtherNavbarBtn">
              <HomeType 
                onApply={handleHomeTypeFilter}
                currentType={filters.type}
              />
              <PriceDropdown 
                activeBtn={filters.propertyType === 'RENT' ? 'RENT' : 'BUY'} 
                onApply={handlePriceFilter}
                currentMin={filters.priceMin}
                currentMax={filters.priceMax}
              />
              <BedBath 
                onApply={handleBedBathFilter}
                currentBedrooms={filters.bedrooms}
                currentBathrooms={filters.bathrooms}
              />
              <More 
                onApply={(moreFilters) => handleFilterChange(moreFilters)}
                currentFilters={filters}
                amenityOptions={amenityOptions}
              />
              <button id="SaveBtn" className="btn-animate">SAVE SEARCH</button>
            </div>
          </div>
        </div>
      )}

      {/* Render mobile filters drawer */}
      {renderMobileFilters()}

      {/* Breadcrumb - Hidden on mobile to save space */}
      {!isMobile && (
        <div className="breadcrumb fade-in-delay-1">
          <a href="/">HOME</a>
          <span className="separator">&gt;</span>
          {filters.propertyType === 'BUY' && (
            <>
              <a href="#">BUY</a>
              <span className="separator">&gt;</span>
            </>
          )}
          {filters.propertyType === 'RENT' && (
            <>
              <a href="#">RENT</a>
              <span className="separator">&gt;</span>
            </>
          )}
          <a href="#">PROPERTIES</a>
        </div>
      )}

      {/* Page Title */}
      <div className="page-title fade-in-delay-2" style={{ padding: isMobile ? '16px' : undefined }}>
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2.5rem' }}>
          {filters.propertyType === 'RENT' ? 'Luxury Properties for ' : filters.propertyType === 'BUY' ? 'Luxury Properties for ' : 'All Properties '}
          <span>{filters.propertyType === 'RENT' ? 'Rent' : filters.propertyType === 'BUY' ? 'Sale' : ''}</span>
        </h1>
        <div className="listings-count">
          {filteredProperties.length} LISTING{filteredProperties.length !== 1 ? 'S' : ''}
        </div>
      </div>

      {/* Filter Tags - Scrollable on mobile */}
      {Object.entries(filters).filter(([key, value]) => 
        value && (Array.isArray(value) ? value.length > 0 : true)).length > 0 && (
        <div 
          className="filter-tags fade-in-delay-3"
          style={{
            padding: isMobile ? '8px 16px' : '0 2rem',
            overflowX: isMobile ? 'auto' : 'visible',
            whiteSpace: isMobile ? 'nowrap' : 'wrap',
            flexWrap: isMobile ? 'nowrap' : 'wrap'
          }}
        >
          {Object.entries(filters).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            
            if (Array.isArray(value)) {
              return value.map(item => (
                <div key={`${key}-${item}`} className="filter-tag" style={{ margin: isMobile ? '0 4px' : undefined }}>
                  <span className="filter-label">
                    {key.toUpperCase()}: {item}
                  </span>
                  <button onClick={() => {
                    const updatedAmenities = filters.amenities.filter(a => a !== item);
                    handleFilterChange({ amenities: updatedAmenities });
                  }}>
                    <CloseIcon fontSize={isMobile ? 'small' : 'medium'} />
                  </button>
                </div>
              ));
            }
            
            return (
              <div key={key} className="filter-tag" style={{ margin: isMobile ? '0 4px' : undefined }}>
                <span className="filter-label">
                  {key.toUpperCase()}: {value}
                </span>
                <button onClick={() => removeFilter(key)}>
                  <CloseIcon fontSize={isMobile ? 'small' : 'medium'} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!properties || properties.length === 0 ? (
        <Container maxWidth="md" className="empty-state fade-in-delay-4" sx={{ py: isMobile ? 3 : 4 }}>
          <Typography variant="h6" gutterBottom>
            No properties found matching your criteria
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Try adjusting your filters or search terms
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => getProperties({})}
              startIcon={<Refresh />}
              size={isMobile ? 'small' : 'medium'}
              sx={{ 
                backgroundColor: '#78CADC', 
                '&:hover': { 
                  backgroundColor: '#5cb3c5', 
                  transform: 'translateY(-2px)', 
                  boxShadow: '0 6px 10px rgba(0,0,0,0.2)' 
                },
                transition: 'all 0.3s ease'
              }}
            >
              Refresh
            </Button>
            <Button 
              variant="outlined" 
              href="/add-property"
              startIcon={<Add />}
              size={isMobile ? 'small' : 'medium'}
              sx={{ 
                borderColor: '#78CADC', 
                color: 'white',
                '&:hover': { 
                  borderColor: '#5cb3c5', 
                  transform: 'translateY(-2px)', 
                  boxShadow: '0 6px 10px rgba(0,0,0,0.2)' 
                },
                transition: 'all 0.3s ease'
              }}
            >
              Add Property
            </Button>
          </Box>
        </Container>
      ) : (
        <>
          <div 
            className="property-listings fade-in-delay-4"
            style={{ 
              padding: isMobile ? '0 8px' : '0 2rem',
              flexDirection: isMobile ? 'column' : 'row'
            }}
          >
            <div 
              className="property-grid"
              style={{
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: isMobile ? '8px' : '2rem'
              }}
            >
              {paginatedProperties.map(property => (
                <PropertyCard 
                  key={property._id} 
                  property={property} 
                  isMobile={isMobile}
                />
              ))}
            </div>
            
            {!isMobile && (
              <div className="map-container">
                <div className="map-placeholder">
                  <span>View larger map</span>
                </div>
              </div>
            )}
          </div>

          {filteredProperties.length > itemsPerPage && (
            <Stack spacing={1} className="pagination-container fade-in-delay-4">
              <Pagination
                count={Math.ceil(filteredProperties.length / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
                siblingCount={isMobile ? 0 : 1}
                boundaryCount={isMobile ? 0 : 1}
                className="custom-pagination"
                sx={{
                  '& .MuiPaginationItem-root': { color: 'white' },
                  '& .MuiPaginationItem-root.Mui-selected': { 
                    backgroundColor: '#78CADC', 
                    color: '#08171A' 
                  },
                  '& .MuiPaginationItem-root:hover': { 
                    backgroundColor: 'rgba(120, 202, 220, 0.2)' 
                  },
                }}
              />
              <Typography variant="caption" className="pagination-count">
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