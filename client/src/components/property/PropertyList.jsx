import React, { useEffect, useRef, useState } from 'react';
import { useProperties } from '../../context/PropertiesContext';
import { useSearchParams } from 'react-router-dom';
import { 
  Box, Grid, Typography, CircularProgress, Button, 
  Container, Pagination, Stack, useMediaQuery, useTheme
} from '@mui/material';
import PropertyCard from './PropertyCard';
import { Add, Refresh } from '@mui/icons-material';

const PropertyList = () => {
  const { properties, loading, error, getProperties } = useProperties();
  const [searchParams] = useSearchParams();
  const initialLoad = useRef(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeBtn, setActiveBtn] = useState('BUY');
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    price: '',
    type: ''
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    const urlSearchTerm = searchParams.get('search');
    const urlType = searchParams.get('type');
    const urlStatus = searchParams.get('status');
    
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
    
    if (urlType) {
      const typeMap = {
        'For Sale': 'BUY',
        'For Rent': 'RENT',
        'Land': 'LAND'
      };
      setActiveBtn(typeMap[urlType] || 'BUY');
      setFilters(prev => ({ ...prev, type: urlType }));
    }

    if (urlStatus) {
      setActiveBtn(urlStatus === 'For Rent' ? 'RENT' : 'BUY');
    }

    const fetchParams = {};
    if (urlSearchTerm) fetchParams.search = urlSearchTerm;
    if (urlType) fetchParams.type = urlType;
    if (urlStatus) fetchParams.status = urlStatus;
    
    getProperties(fetchParams);
    setIsLoaded(true);
  }, [searchParams, getProperties]);

  const removeFilter = (filterKey) => {
    const updatedFilters = { ...filters };
    delete updatedFilters[filterKey];
    setFilters(updatedFilters);
    // You might want to refetch properties here without the filter
  };

  const filteredProperties = properties?.filter(property => {
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

  if (!properties || properties.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          No properties found
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
        <a href="#" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s ease' }}>{activeBtn}</a>
        <span className="separator" style={{ color: '#555', margin: '0 4px' }}>&gt;</span>
        <a href="#" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s ease' }}>PROPERTIES</a>
      </div>

      <div className="page-title fade-in-delay-2" style={{ 
        padding: '0 2rem',
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          marginBottom: '0.5rem',
          fontWeight: 'bold'
        }}>
          {activeBtn === 'RENT' ? 'Rental' : 'Luxury'} Properties {activeBtn === 'RENT' ? 'for Rent' : 'for Sale'}
        </h1>
        <div className="listings-count" style={{ fontSize: '1rem', color: '#ccc' }}>
          {filteredProperties.length} LISTINGS
        </div>
      </div>

      {Object.keys(filters).filter(k => filters[k]).length > 0 && (
        <div className="filter-tags fade-in-delay-3" style={{ 
          display: 'flex',
          gap: '1rem',
          padding: '0 2rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {Object.entries(filters).map(([key, value]) => (
            value && (
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
            )
          ))}
        </div>
      )}

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
    </div>
  );
};

export default PropertyList;