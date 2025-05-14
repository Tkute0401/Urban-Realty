import React, { useEffect, useRef, useState } from 'react';
import { useProperties } from '../../context/PropertiesContext';
import { useSearchParams } from 'react-router-dom';
import { 
  Box, Grid, Typography, CircularProgress, Button, 
  Container, Pagination, Stack, useMediaQuery, useTheme,
  Drawer, IconButton
} from '@mui/material';
import PropertyCard from './PropertyCard';
import { Add, Refresh, Menu, FilterList } from '@mui/icons-material';
import BedBath from './BedBath';
import HomeType from './HomeType';
import More from './More';
import PriceDropdown from './PriceDropdown';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
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
  };

  // Filter properties client-side
  const filteredProperties = properties?.filter(property => {
    // Your filter logic here
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

  // Mobile filter drawer content
  const renderMobileFilters = () => (
    <div className="mobile-filters">
      <div className="filter-section">
        <h3>Property Type</h3>
        <div className="BuyRentToggle mobile-toggle">
          <button 
            className={`${filters.propertyType === 'ALL' ? 'active' : ''}`} 
            onClick={() => handlePropertyTypeChange('ALL')}
          >
            ALL
          </button>
          <button 
            className={`${filters.propertyType === 'BUY' ? 'active' : ''}`} 
            onClick={() => handlePropertyTypeChange('BUY')}
          >
            BUY
          </button>
          <button 
            className={`${filters.propertyType === 'RENT' ? 'active' : ''}`}
            onClick={() => handlePropertyTypeChange('RENT')}
          >
            RENT
          </button>
        </div>
      </div>

      <div className="filter-section">
        <HomeType 
          onApply={handleHomeTypeFilter}
          currentType={filters.type}
        />
      </div>

      <div className="filter-section">
        <PriceDropdown 
          activeBtn={filters.propertyType === 'RENT' ? 'RENT' : 'BUY'} 
          onApply={handlePriceFilter}
          currentMin={filters.priceMin}
          currentMax={filters.priceMax}
        />
      </div>

      <div className="filter-section">
        <BedBath 
          onApply={handleBedBathFilter}
          currentBedrooms={filters.bedrooms}
          currentBathrooms={filters.bathrooms}
        />
      </div>

      <div className="filter-section">
        <More 
          onApply={(moreFilters) => handleFilterChange(moreFilters)}
          currentFilters={filters}
          amenityOptions={amenityOptions}
        />
      </div>

      <Button 
        variant="contained"
        fullWidth
        onClick={() => setMobileFiltersOpen(false)}
        sx={{ 
          mt: 2,
          backgroundColor: '#78CADC',
          color: '#08171A',
          '&:hover': {
            backgroundColor: '#5cb3c5'
          }
        }}
      >
        Apply Filters
      </Button>
    </div>
  );

  return (
    <div className={`main-container ${isLoaded ? 'fade-in-delay-1' : ''}`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="mobile-header">
          <IconButton onClick={() => setMobileFiltersOpen(true)}>
            <FilterList sx={{ color: '#78CADC' }} />
          </IconButton>
          <form onSubmit={handleSearchSubmit} className="mobile-search">
            <input 
              type="search" 
              placeholder="Search location..." 
              value={filters.search} 
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            <button type="submit">
              <SearchIcon />
            </button>
          </form>
        </div>
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
              <button 
                id="AllBtn" 
                className={`${filters.propertyType === 'ALL' ? 'active' : ''}`} 
                onClick={() => handlePropertyTypeChange('ALL')}
              >
                ALL
              </button>
              <button 
                id="BuyBtn" 
                className={`${filters.propertyType === 'BUY' ? 'active' : ''}`} 
                onClick={() => handlePropertyTypeChange('BUY')}
              >
                BUY
              </button>
              <button 
                id="RentBtn" 
                className={`${filters.propertyType === 'RENT' ? 'active' : ''}`}
                onClick={() => handlePropertyTypeChange('RENT')}
              >
                RENT
              </button>
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

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '85%',
            maxWidth: '350px',
            backgroundColor: '#0B1011',
            color: 'white',
            padding: '20px'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <IconButton onClick={() => setMobileFiltersOpen(false)}>
            <CloseIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
        {renderMobileFilters()}
      </Drawer>

      {/* Breadcrumb */}
      <div className={`breadcrumb ${isMobile ? 'mobile-breadcrumb' : ''} fade-in-delay-1`}>
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

      {/* Page Title */}
      <div className={`page-title ${isMobile ? 'mobile-page-title' : ''} fade-in-delay-2`}>
        <h1>
          {filters.propertyType === 'RENT' ? 'Luxury Properties for ' : filters.propertyType === 'BUY' ? 'Luxury Properties for ' : 'All Properties '}
          <span>{filters.propertyType === 'RENT' ? 'Rent' : filters.propertyType === 'BUY' ? 'Sale' : ''}</span>
        </h1>
        <div className="listings-count">
          {filteredProperties.length} LISTING{filteredProperties.length !== 1 ? 'S' : ''}
        </div>
      </div>

      {/* Filter Tags */}
      {Object.entries(filters).filter(([key, value]) => 
        value && (Array.isArray(value) ? value.length > 0 : true))
        .length > 0 && (
        <div className={`filter-tags ${isMobile ? 'mobile-filter-tags' : ''} fade-in-delay-3`}>
          {Object.entries(filters).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            
            if (Array.isArray(value)) {
              return value.map(item => (
                <div key={`${key}-${item}`} className="filter-tag">
                  <span className="filter-label">
                    {key.toUpperCase()}: {item}
                  </span>
                  <button onClick={() => {
                    const updatedAmenities = filters.amenities.filter(a => a !== item);
                    handleFilterChange({ amenities: updatedAmenities });
                  }}>
                    <CloseIcon />
                  </button>
                </div>
              ));
            }
            
            return (
              <div key={key} className="filter-tag">
                <span className="filter-label">
                  {key.toUpperCase()}: {value}
                </span>
                <button onClick={() => removeFilter(key)}>
                  <CloseIcon />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!properties || properties.length === 0 ? (
        <Container maxWidth="md" className={`empty-state ${isMobile ? 'mobile-empty-state' : ''} fade-in-delay-4`}>
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
          <div className={`property-listings ${isMobile ? 'mobile-property-listings' : ''} fade-in-delay-4`}>
            <div className={`property-grid ${isMobile ? 'mobile-property-grid' : ''}`}>
              {paginatedProperties.map(property => (
                <PropertyCard key={property._id} property={property} isMobile={isMobile} />
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
            <Stack spacing={1} className={`pagination-container ${isMobile ? 'mobile-pagination' : ''} fade-in-delay-4`}>
              <Pagination
                count={Math.ceil(filteredProperties.length / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
                siblingCount={isMobile ? 0 : 1}
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