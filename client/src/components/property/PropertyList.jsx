import { useEffect, useRef, useState } from 'react';
import { useProperties } from '../../context/PropertiesContext';
import { 
  Box, Grid, Typography, CircularProgress, Button, 
  Container, Pagination, Stack, useMediaQuery, useTheme,
  TextField, InputAdornment, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { Search, Refresh, Add, Tune, Map, GridView } from '@mui/icons-material';
import PropertyCard from './PropertyCard';

const PropertyList = () => {
  const { properties, loading, error, getProperties } = useProperties();
  const initialLoad = useRef(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('all');
  const itemsPerPage = 12;

  useEffect(() => {
    if (initialLoad.current) {
      getProperties();
      initialLoad.current = false;
    }
  }, [getProperties]);

  const filteredProperties = properties?.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      property.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  }) || [];

  const paginatedProperties = filteredProperties.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
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
    <Container maxWidth="xl" sx={{ py: 1, px: { xs: 1, sm: 2 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        mb: 2,
        gap: 1
      }}>
        <Typography 
          variant="h5" 
          component="h1"
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '1.4rem', sm: '1.6rem' }
          }}
        >
          Properties
          <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1 }}>
            ({filteredProperties.length} found)
          </Typography>
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          width: isMobile ? '100%' : 'auto',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              width: isMobile ? '100%' : 300,
              '& .MuiOutlinedInput-root': {
                height: 36
              }
            }}
          />
          
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            sx={{ height: 36 }}
          >
            <ToggleButton value="grid" aria-label="grid view">
              <GridView fontSize="small" />
            </ToggleButton>
            <ToggleButton value="map" aria-label="map view" disabled>
              <Map fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
          
          <Button
            variant="outlined"
            size="small"
            startIcon={<Tune />}
            sx={{ height: 36 }}
          >
            Filters
          </Button>
        </Box>
      </Box>

      {filteredProperties.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          py: 4,
          textAlign: 'center'
        }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No matching properties found
          </Typography>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setPage(1);
            }}
          >
            Clear Search
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={isMobile ? 1.5 : 2}>
            {paginatedProperties.map(property => (
              <Grid item key={property._id} xs={12} sm={viewMode === 'grid' ? 6 : 12} md={viewMode === 'grid' ? 4 : 12} lg={viewMode === 'grid' ? 3 : 12}>
                <PropertyCard 
                  property={property} 
                  compact={isMobile || viewMode === 'list'} 
                />
              </Grid>
            ))}
          </Grid>

          {filteredProperties.length > itemsPerPage && (
            <Stack spacing={1} sx={{ mt: 2, alignItems: 'center' }}>
              <Pagination
                count={Math.ceil(filteredProperties.length / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
                siblingCount={isMobile ? 0 : 1}
                sx={{ '& .MuiPaginationItem-root': { fontSize: isMobile ? '0.75rem' : '0.875rem' } }}
              />
              <Typography variant="caption" color="text.secondary">
                Showing {paginatedProperties.length} of {filteredProperties.length} properties
              </Typography>
            </Stack>
          )}
        </>
      )}
    </Container>
  );
};

export default PropertyList;