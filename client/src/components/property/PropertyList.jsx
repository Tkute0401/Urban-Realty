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
import './PropertyList.css';
// Icon components from MainPage
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ZoomIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 19c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"></path>
    <path d="m21 21-4.3-4.3"></path>
    <path d="M8 11h6"></path>
    <path d="M11 8v6"></path>
  </svg>
);

const GalleryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <path d="m21 15-5-5L5 21"></path>
  </svg>
);

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
    
    // Short delay to allow for animation to start
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
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
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
    getProperties({
      ...filters,
      search: searchTerm,
      status: propertyType === 'ALL' ? '' : propertyType === 'BUY' ? 'For Sale' : 'For Rent'
    });
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
          onClick={getProperties}
          startIcon={<Refresh />}
          size={isMobile ? 'small' : 'medium'}
          sx={{ backgroundColor: '#78CADC', '&:hover': { backgroundColor: '#5cb3c5' } }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <div className={`main-container ${isLoaded ? 'fade-in-delay-1' : ''}`}>
      {/* Navbar with search */}
      <div className="Navbar">
        <form onSubmit={handleSearchSubmit} className="search-container slide-in-left">
          <input 
            type="searchbar" 
            placeholder="SEARCH BY LOCATION (STATE OR CITY)" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <SearchIcon />
          </button>
        </form>
        <div className="NavbarBtn slide-in-right">
        <div className="BuyRentToggle">
  <button 
    id="AllBtn" 
    className={`${propertyType === 'ALL' ? 'bg-[#78CADC] text-black' : 'bg-black-400 text-white'}`} 
    onClick={() => handlePropertyTypeChange(null, 'ALL')}
  >
    ALL
  </button>
  <button 
    id="BuyBtn" 
    className={`${propertyType === 'BUY' ? 'bg-[#78CADC] text-black' : 'bg-black-400 text-white'}`} 
    onClick={() => handlePropertyTypeChange(null, 'BUY')}
  >
    BUY
  </button>
  <button 
    id="RentBtn" 
    className={`${propertyType === 'RENT' ? 'bg-[#78CADC] text-black' : 'bg-black-400 text-white'}`}
    onClick={() => handlePropertyTypeChange(null, 'RENT')}
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
            <More 
              onApply={(moreFilters) => handleFilterChange(moreFilters)}
              currentFilters={filters}
              amenityOptions={amenityOptions}
            />
            <button id="SaveBtn" className="btn-animate">SAVE SEARCH</button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="breadcrumb fade-in-delay-1">
        <a href="/">HOME</a>
        <span className="separator">&gt;</span>
        {propertyType === 'BUY' && (
          <>
            <a href="#">BUY</a>
            <span className="separator">&gt;</span>
          </>
        )}
        {propertyType === 'RENT' && (
          <>
            <a href="#">RENT</a>
            <span className="separator">&gt;</span>
          </>
        )}
        <a href="#">PROPERTIES</a>
      </div>

      {/* Page Title */}
      <div className="page-title fade-in-delay-2">
        <h1>
          {propertyType === 'RENT' ? 'Luxury Properties for ' : propertyType === 'BUY' ? 'Luxury Properties for ' : 'All Properties '}
          <span>{propertyType === 'RENT' ? 'Rent' : propertyType === 'BUY' ? 'Sale' : ''}</span>
        </h1>
        <div className="listings-count">
          {filteredProperties.length} LISTING{filteredProperties.length !== 1 ? 'S' : ''}
        </div>
      </div>

      {/* Filter Tags */}
      {Object.entries(filters).filter(([key, value]) => 
        value && (Array.isArray(value) ? value.length > 0 : true))
        .length > 0 && (
        <div className="filter-tags fade-in-delay-3">
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
        <Container maxWidth="md" className="empty-state fade-in-delay-4">
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
            sx={{ 
              mr: 1, 
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
              ml: 1, 
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
        </Container>
      ) : (
        <>
          <div className="property-listings fade-in-delay-4">
            <div className="property-grid">
              {paginatedProperties.map(property => (
                <PropertyCard key={property._id} property={property} />
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
                className="custom-pagination"
                sx={{
                  '& .MuiPaginationItem-root': { color: 'white' },
                  '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: '#78CADC', color: '#08171A' },
                  '& .MuiPaginationItem-root:hover': { backgroundColor: 'rgba(120, 202, 220, 0.2)' },
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