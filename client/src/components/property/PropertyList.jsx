import React, { useEffect, useRef, useState } from 'react';
import { useProperties } from '../../context/PropertiesContext';
import { useSearchParams } from 'react-router-dom';
import { 
  Box, Grid, Typography, CircularProgress, Button, 
  Container, Pagination, Stack, useMediaQuery, useTheme,
  Drawer, IconButton, Collapse
} from '@mui/material';
import PropertyCard from './PropertyCard';
import PropertiesMap from './PropertiesMap';
import { 
  Add, Refresh, FilterAlt, KeyboardArrowDown, KeyboardArrowUp,
  ArrowBack, Close as CloseIcon, Search as SearchIcon, 
  Clear as ClearIcon, Tune as TuneIcon 
} from '@mui/icons-material';
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [page, setPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const itemsPerPage = 12;
  
  // Mobile specific state
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [expandedSearch, setExpandedSearch] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState(false);

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
        search: filters.search,
        type: filters.type,
        city: filters.city,
        state: filters.state,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        bedrooms: filters.bedrooms,
        bathrooms: filters.bathrooms,
        amenities: filters.amenities.join(','),
        minArea: filters.minArea,
        maxArea: filters.maxArea,
        status: filters.propertyType === 'ALL' ? '' : 
               filters.propertyType === 'BUY' ? 'For Sale' : 'For Rent'
      };

      await getProperties(apiParams);
      
      const newSearchParams = new URLSearchParams();
      Object.entries(apiParams).forEach(([key, value]) => {
        if (value) newSearchParams.set(key, value);
      });
      setSearchParams(newSearchParams);

      setTimeout(() => setIsLoaded(true), 100);
      initialLoad.current = false;
    };

    fetchData();
  }, [filters, getProperties, setSearchParams]);

  const handlePropertyTypeChange = (newType) => {
    setFilters(prev => ({
      ...prev,
      propertyType: newType
    }));
    setPage(1);
    setSelectedProperty(null);
    
    if (isMobile && showFiltersDrawer) {
      setShowFiltersDrawer(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    setPage(1);
    setSelectedProperty(null);
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
    setPage(1);
    setSelectedProperty(null);
    
    if (isMobile) {
      setShowFiltersDrawer(false);
    }
  };

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
    setSelectedProperty(null);
  };

  const handlePriceFilter = (min, max) => {
    handleFilterChange({ 
      priceMin: min ? min.toString() : '',
      priceMax: max ? max.toString() : '' 
    });
    
    if (isMobile) {
      setShowFiltersDrawer(false);
    }
  };

  const handleBedBathFilter = (bedrooms, bathrooms) => {
    handleFilterChange({ 
      bedrooms: bedrooms ? bedrooms.toString() : '',
      bathrooms: bathrooms ? bathrooms.toString() : '' 
    });
    
    if (isMobile) {
      setShowFiltersDrawer(false);
    }
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
    
    if (isMobile) {
      setShowFiltersDrawer(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterChange({ search: filters.search });
    
    if (isMobile && expandedSearch) {
      setExpandedSearch(false);
    }
  };

  const toggleSearch = () => {
    setExpandedSearch(!expandedSearch);
    if (!expandedSearch) {
      setTimeout(() => {
        const searchInput = document.getElementById('mobile-search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  const filteredProperties = properties?.filter(property => {
    if (filters.propertyType !== 'ALL') {
      const statusMatch = filters.propertyType === 'BUY' 
        ? property.status === 'For Sale' 
        : property.status === 'For Rent';
      if (!statusMatch) return false;
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        (property.title && property.title.toLowerCase().includes(searchLower)) ||
        (property.description && property.description.toLowerCase().includes(searchLower)) ||
        (property.address?.city && property.address.city.toLowerCase().includes(searchLower)) ||
        (property.address?.state && property.address.state.toLowerCase().includes(searchLower)) ||
        (property.buildingName && property.buildingName.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }
    
    if (filters.type && property.type !== filters.type) return false;
    
    if (filters.city && property.address?.city?.toLowerCase() !== filters.city.toLowerCase()) {
      return false;
    }
    if (filters.state && property.address?.state?.toLowerCase() !== filters.state.toLowerCase()) {
      return false;
    }
    
    if (filters.priceMin && property.price < parseInt(filters.priceMin)) return false;
    if (filters.priceMax && property.price > parseInt(filters.priceMax)) return false;
    
    if (filters.bedrooms) {
      if (filters.bedrooms === 'Any') {
      } else if (filters.bedrooms.endsWith('+')) {
        const minBedrooms = parseInt(filters.bedrooms);
        if (!property.bedrooms || property.bedrooms < minBedrooms) return false;
      } else {
        if (property.bedrooms !== parseInt(filters.bedrooms)) return false;
      }
    }
    
    if (filters.bathrooms) {
      if (filters.bathrooms === 'Any') {
      } else if (filters.bathrooms.endsWith('+')) {
        const minBathrooms = parseFloat(filters.bathrooms);
        if (!property.bathrooms || property.bathrooms < minBathrooms) return false;
      } else {
        if (property.bathrooms !== parseFloat(filters.bathrooms)) return false;
      }
    }
    
    if (filters.minArea && (!property.area || property.area < parseInt(filters.minArea))) return false;
    if (filters.maxArea && (!property.area || property.area > parseInt(filters.maxArea))) return false;
    
    if (filters.amenities?.length > 0) {
      if (!property.amenities || property.amenities.length === 0) return false;
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
    setSelectedProperty(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => 
    key !== 'propertyType' && key !== 'search' && value && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length;

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

  // Mobile Filter Drawer Content
  const filterDrawerContent = (
    <>
      <div className="mobile-drawer-header">
        <div className="mobile-drawer-title">Filters</div>
        <IconButton className="close-drawer-btn" onClick={() => setShowFiltersDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </div>
      
      <div className="mobile-drawer-content">
        <div className="mobile-filter-section">
          <div className="mobile-filter-section-title">Property Type</div>
          <div className="mobile-property-type-buttons">
            <button 
              className={`mobile-filter-button ${filters.propertyType === 'ALL' ? 'active' : ''}`} 
              onClick={() => handlePropertyTypeChange('ALL')}
            >
              ALL
            </button>
            <button 
              className={`mobile-filter-button ${filters.propertyType === 'BUY' ? 'active' : ''}`} 
              onClick={() => handlePropertyTypeChange('BUY')}
            >
              BUY
            </button>
            <button 
              className={`mobile-filter-button ${filters.propertyType === 'RENT' ? 'active' : ''}`}
              onClick={() => handlePropertyTypeChange('RENT')}
            >
              RENT
            </button>
          </div>
        </div>
        
        <div className="mobile-filter-section">
          <div className="mobile-filter-section-title">Home Type</div>
          <HomeType 
            onApply={handleHomeTypeFilter}
            currentType={filters.type}
            isMobile={true}
          />
        </div>
        
        <div className="mobile-filter-section">
          <div className="mobile-filter-section-title">Price Range</div>
          <PriceDropdown 
            activeBtn={filters.propertyType === 'RENT' ? 'RENT' : 'BUY'} 
            onApply={handlePriceFilter}
            currentMin={filters.priceMin}
            currentMax={filters.priceMax}
            isMobile={true}
          />
        </div>
        
        <div className="mobile-filter-section">
          <div className="mobile-filter-section-title">Beds & Baths</div>
          <BedBath 
            onApply={handleBedBathFilter}
            currentBedrooms={filters.bedrooms}
            currentBathrooms={filters.bathrooms}
            isMobile={true}
          />
        </div>
        
        <div className="mobile-filter-section">
          <div className="mobile-filter-section-title">More Filters</div>
          <More 
            onApply={(moreFilters) => handleFilterChange(moreFilters)}
            currentFilters={filters}
            amenityOptions={amenityOptions}
            isMobile={true}
          />
        </div>
      </div>
      
      <div className="mobile-drawer-footer">
        <button className="mobile-clear-filters" onClick={clearAllFilters}>
          Clear All
        </button>
        <button className="mobile-apply-filters" onClick={() => setShowFiltersDrawer(false)}>
          Show {filteredProperties.length} {filteredProperties.length === 1 ? 'Result' : 'Results'}
        </button>
      </div>
    </>
  );

  return (
    <div className={`main-container ${isLoaded ? 'fade-in-delay-1' : ''}`}>
      {/* Mobile Search and Filter Bar */}
      {isMobile && (
        <div className="mobile-top-bar slide-in-left">
          <div className={`mobile-search-container ${expandedSearch ? 'expanded' : ''}`}>
            {expandedSearch ? (
              <form onSubmit={handleSearchSubmit} className="mobile-search-form">
                <IconButton 
                  className="mobile-search-back" 
                  onClick={toggleSearch}
                  aria-label="Back"
                >
                  <ArrowBack />
                </IconButton>
                <input 
                  id="mobile-search-input"
                  type="text" 
                  placeholder="Search by location" 
                  value={filters.search} 
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="mobile-search-input"
                />
                {filters.search && (
                  <IconButton 
                    className="mobile-search-clear" 
                    onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                    aria-label="Clear search"
                  >
                    <ClearIcon />
                  </IconButton>
                )}
                <IconButton 
                  type="submit" 
                  className="mobile-search-submit"
                  aria-label="Search"
                >
                  <SearchIcon />
                </IconButton>
              </form>
            ) : (
              <button className="mobile-search-button" onClick={toggleSearch}>
                <SearchIcon />
                <span>Search</span>
              </button>
            )}
          </div>
          
          <button 
            className="mobile-filter-button"
            onClick={() => setShowFiltersDrawer(true)}
          >
            <FilterAlt />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
          </button>
          
          <div className="mobile-toggle-container">
            <button 
              className={`mobile-toggle-button ${filters.propertyType === 'ALL' ? 'active' : ''}`}
              onClick={() => handlePropertyTypeChange('ALL')}
            >
              All
            </button>
            <button 
              className={`mobile-toggle-button ${filters.propertyType === 'BUY' ? 'active' : ''}`}
              onClick={() => handlePropertyTypeChange('BUY')}
            >
              Buy
            </button>
            <button 
              className={`mobile-toggle-button ${filters.propertyType === 'RENT' ? 'active' : ''}`}
              onClick={() => handlePropertyTypeChange('RENT')}
            >
              Rent
            </button>
          </div>
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
                className={`${filters.propertyType === 'ALL' ? 'bg-[#78cadc] text-black' : 'bg-black-400 text-white'}`} 
                onClick={() => handlePropertyTypeChange('ALL')}
              >
                ALL
              </button>
              <button 
                id="BuyBtn" 
                className={`${filters.propertyType === 'BUY' ? 'bg-[#78cadc] text-black' : 'bg-black-400 text-white'}`} 
                onClick={() => handlePropertyTypeChange('BUY')}
              >
                BUY
              </button>
              <button 
                id="RentBtn" 
                className={`${filters.propertyType === 'RENT' ? 'bg-[#78cadc] text-black' : 'bg-black-400 text-white'}`}
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
      {isMobile && (
        <Drawer
          anchor="bottom"
          open={showFiltersDrawer}
          onClose={() => setShowFiltersDrawer(false)}
          className="mobile-filter-drawer"
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
          {filterDrawerContent}
        </Drawer>
      )}

      {/* Breadcrumb - Hidden on smallest screens */}
      <div className={`breadcrumb fade-in-delay-1 ${isMobile ? 'mobile-breadcrumb' : ''}`}>
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
      <div className="page-title fade-in-delay-2">
        <h1>
          {filters.propertyType === 'RENT' ? 'Luxury Properties for ' : filters.propertyType === 'BUY' ? 'Luxury Properties for ' : 'All '} <span className='highlight-words'>Properties</span>
          <span>{filters.propertyType === 'RENT' ? 'Rent' : filters.propertyType === 'BUY' ? 'Sale' : ''}</span>
        </h1>
        <div className="listings-count">
          {filteredProperties.length} LISTING{filteredProperties.length !== 1 ? 'S' : ''}
        </div>
      </div>

      {/* Active Filter Tags with responsive design */}
      {Object.entries(filters).filter(([key, value]) => 
        value && (Array.isArray(value) ? value.length > 0 : true) && 
        key !== 'propertyType'
      ).length > 0 && (
        <div className={`filter-tags fade-in-delay-3 ${isMobile ? 'mobile-filter-tags' : ''}`}>
          {isMobile && activeFilterCount > 3 && !expandedFilters ? (
            <>
              {Object.entries(filters)
                .filter(([key, value]) => 
                  value && (Array.isArray(value) ? value.length > 0 : true) && 
                  key !== 'propertyType'
                )
                .slice(0, 2)
                .map(([key, value]) => {
                  if (!value || (Array.isArray(value) && value.length === 0)) return null;
                  
                  if (Array.isArray(value)) {
                    return value.slice(0, 1).map(item => (
                      <div key={`${key}-${item}`} className="filter-tag">
                        <span className="filter-label">
                          {key === 'priceMin' ? 'Min $' : 
                           key === 'priceMax' ? 'Max $' : 
                           `${key.charAt(0).toUpperCase() + key.slice(1)}: `}
                          {item}
                        </span>
                        <button onClick={() => {
                          const updatedAmenities = filters.amenities.filter(a => a !== item);
                          handleFilterChange({ amenities: updatedAmenities });
                        }} aria-label="Remove filter">
                          <CloseIcon fontSize="small" />
                        </button>
                      </div>
                    ));
                  }
                  
                  return (
                    <div key={key} className="filter-tag">
                      <span className="filter-label">
                        {key === 'priceMin' ? 'Min $' : 
                         key === 'priceMax' ? 'Max $' : 
                         `${key.charAt(0).toUpperCase() + key.slice(1)}: `}
                        {value}
                      </span>
                      <button onClick={() => removeFilter(key)} aria-label="Remove filter">
                        <CloseIcon fontSize="small" />
                      </button>
                    </div>
                  );
                })}
                
                <button 
                  className="show-more-filters"
                  onClick={() => setExpandedFilters(true)}
                  aria-label="Show more filters"
                >
                  +{activeFilterCount - 2} more
                  <KeyboardArrowDown fontSize="small" />
                </button>
              </>
            ) : (
              <>
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || (Array.isArray(value) && value.length === 0) || key === 'propertyType') return null;
                  
                  if (Array.isArray(value)) {
                    return value.map(item => (
                      <div key={`${key}-${item}`} className="filter-tag">
                        <span className="filter-label">
                          {key === 'priceMin' ? 'Min $' : 
                           key === 'priceMax' ? 'Max $' : 
                           `${key.charAt(0).toUpperCase() + key.slice(1)}: `}
                          {item}
                        </span>
                        <button onClick={() => {
                          const updatedAmenities = filters.amenities.filter(a => a !== item);
                          handleFilterChange({ amenities: updatedAmenities });
                        }} aria-label="Remove filter">
                          <CloseIcon fontSize="small" />
                        </button>
                      </div>
                    ));
                  }
                  
                  return (
                    <div key={key} className="filter-tag">
                      <span className="filter-label">
                        {key === 'priceMin' ? 'Min $' : 
                         key === 'priceMax' ? 'Max $' : 
                         `${key.charAt(0).toUpperCase() + key.slice(1)}: `}
                        {value}
                      </span>
                      <button onClick={() => removeFilter(key)} aria-label="Remove filter">
                        <CloseIcon fontSize="small" />
                      </button>
                    </div>
                  );
                })}
                
                {isMobile && expandedFilters && (
                  <button 
                    className="show-less-filters"
                    onClick={() => setExpandedFilters(false)}
                    aria-label="Show fewer filters"
                  >
                    Show less
                    <KeyboardArrowUp fontSize="small" />
                  </button>
                )}
              </>
            )}
            
            {!isMobile && activeFilterCount > 0 && (
              <button 
                className="clear-all-filters"
                onClick={clearAllFilters}
                aria-label="Clear all filters"
              >
                Clear all
              </button>
            )}
        </div>
      )}

      {/* Properties Map - Hidden on mobile */}
      {!isMobile && (
        <div className="map-container">
          <PropertiesMap 
            
            properties={filteredProperties} 
            selectedProperty={selectedProperty}
            onMarkerClick={(property) => {
              setSelectedProperty(property);
              const cardElement = document.getElementById(`property-${property._id}`);
              if (cardElement) {
                cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                cardElement.classList.add('highlight-card');
                setTimeout(() => {
                  cardElement.classList.remove('highlight-card');
                }, 2000);
              }
            }}
          />
        </div>
      )}

      {/* Empty state with responsive design */}
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
            onClick={() => getProperties({})}
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
              ml: isMobile ? 0 : 1,
              mt: isMobile ? 2 : 0,
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
                <PropertyCard 
                  key={property._id} 
                  id={`property-${property._id}`}
                  property={property} 
                  isMobile={isMobile}
                  isSelected={selectedProperty?._id === property._id}
                  onClick={() => setSelectedProperty(property)}
                />
              ))}
            </div>
          </div>

          {/* Pagination with responsive design */}
          {filteredProperties.length > itemsPerPage && (
            <Stack spacing={1} className="pagination-container fade-in-delay-4">
              <Pagination
                count={Math.ceil(filteredProperties.length / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
                siblingCount={isMobile ? 0 : 1}
                boundaryCount={isMobile ? 1 : 2}
                className="custom-pagination"
                sx={{
                  '& .MuiPaginationItem-root': { 
                    color: 'white',
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  },
                  '& .MuiPaginationItem-root.Mui-selected': { 
                    backgroundColor: '#78CADC', 
                    color: '#08171A',
                    '&:hover': {
                      backgroundColor: '#5cb3c5'
                    }
                  },
                  '& .MuiPaginationItem-root:hover': { 
                    backgroundColor: 'rgba(120, 202, 220, 0.2)' 
                  },
                }}
              />
              <Typography 
                variant="caption" 
                className="pagination-count"
                sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
              >
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