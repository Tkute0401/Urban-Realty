import React, { useEffect, useRef, useState } from 'react';
import { useDevelopers } from '../../context/DevelopersContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Box, Grid, Typography, CircularProgress, Button, 
  Container, Pagination, Stack, useMediaQuery, useTheme,
  Drawer, IconButton, Collapse
} from '@mui/material';
import DeveloperCard from './DeveloperCard';
import { 
  Add, Refresh, FilterAlt, KeyboardArrowDown, KeyboardArrowUp,
  ArrowBack, Close as CloseIcon, Search as SearchIcon, 
  Clear as ClearIcon, Tune as TuneIcon
} from '@mui/icons-material';
import './DeveloperList.css';

const DeveloperList = () => {
  const { developers, loading, error, getDevelopers } = useDevelopers();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLoad = useRef(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
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
      city: params.city || '',
      state: params.state || '',
      country: params.country || '',
      minYear: params.minYear || '',
      maxYear: params.maxYear || '',
      minProjects: params.minProjects || '',
      maxProjects: params.maxProjects || '',
      specialization: params.specialization || ''
    };
  });
  const navigate = useNavigate();

  // Fetch developers when filters change
  useEffect(() => {
    const fetchData = async () => {
      let apiParams = {};

      apiParams = {
        search: filters.search,
        'headquarters.city': filters.city,
        'headquarters.state': filters.state,
        'headquarters.country': filters.country,
        foundedYear: filters.minYear ? { $gte: filters.minYear } : undefined,
        foundedYear: filters.maxYear ? { ...apiParams?.foundedYear, $lte: filters.maxYear } : apiParams.foundedYear,
        completedProjects: filters.minProjects ? { $gte: filters.minProjects } : undefined,
        completedProjects: filters.maxProjects ? { ...apiParams?.completedProjects, $lte: filters.maxProjects } : apiParams.completedProjects,
        'specializations.name': filters.specialization
      };

      // Remove undefined values
      Object.keys(apiParams).forEach(key => apiParams[key] === undefined && delete apiParams[key]);

      await getDevelopers(apiParams);
      
      const newSearchParams = new URLSearchParams();
      Object.entries(apiParams).forEach(([key, value]) => {
        if (value) {
          if (typeof value === 'object') {
            Object.entries(value).forEach(([op, val]) => {
              if (op === '$gte') newSearchParams.set(key.startsWith('$') ? `min${key.slice(1)}` : `min${key}`, val);
              if (op === '$lte') newSearchParams.set(key.startsWith('$') ? `max${key.slice(1)}` : `max${key}`, val);
            });
          } else {
            newSearchParams.set(key, value);
          }
        }
      });
      setSearchParams(newSearchParams);

      setTimeout(() => setIsLoaded(true), 100);
      initialLoad.current = false;
    };

    fetchData();
  }, [filters, getDevelopers, setSearchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    setPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      city: '',
      state: '',
      country: '',
      minYear: '',
      maxYear: '',
      minProjects: '',
      maxProjects: '',
      specialization: ''
    });
    setPage(1);
    
    if (isMobile) {
      setShowFiltersDrawer(false);
    }
  };

  const removeFilter = (filterKey) => {
    const updatedFilters = {
      ...filters,
      [filterKey]: ''
    };
    
    setFilters(updatedFilters);
    setPage(1);
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

  const filteredDevelopers = developers?.filter(developer => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        (developer.name && developer.name.toLowerCase().includes(searchLower)) ||
        (developer.description && developer.description.toLowerCase().includes(searchLower)) ||
        (developer.headquarters?.city && developer.headquarters.city.toLowerCase().includes(searchLower)) ||
        (developer.headquarters?.state && developer.headquarters.state.toLowerCase().includes(searchLower)) ||
        (developer.headquarters?.country && developer.headquarters.country.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }
    
    if (filters.city && developer.headquarters?.city?.toLowerCase() !== filters.city.toLowerCase()) {
      return false;
    }
    if (filters.state && developer.headquarters?.state?.toLowerCase() !== filters.state.toLowerCase()) {
      return false;
    }
    if (filters.country && developer.headquarters?.country?.toLowerCase() !== filters.country.toLowerCase()) {
      return false;
    }
    
    if (filters.minYear && (!developer.foundedYear || developer.foundedYear < parseInt(filters.minYear))) return false;
    if (filters.maxYear && (!developer.foundedYear || developer.foundedYear > parseInt(filters.maxYear))) return false;
    
    if (filters.minProjects && (!developer.completedProjects || developer.completedProjects < parseInt(filters.minProjects))) return false;
    if (filters.maxProjects && (!developer.completedProjects || developer.completedProjects > parseInt(filters.maxProjects))) return false;
    
    if (filters.specialization) {
      if (!developer.specializations || developer.specializations.length === 0) return false;
      const hasSpecialization = developer.specializations.some(spec => 
        spec.name.toLowerCase().includes(filters.specialization.toLowerCase())
      );
      if (!hasSpecialization) return false;
    }
    
    return true;
  }) || [];

  const paginatedDevelopers = filteredDevelopers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => 
    value && value !== ''
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
          Error loading developers
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'white' }}>{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => getDevelopers({})}
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
          <div className="mobile-filter-section-title">Location</div>
          <div className="mobile-filter-input-group">
            <input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              className="mobile-filter-input"
            />
            <input
              type="text"
              placeholder="State"
              value={filters.state}
              onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
              className="mobile-filter-input"
            />
            <input
              type="text"
              placeholder="Country"
              value={filters.country}
              onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
              className="mobile-filter-input"
            />
          </div>
        </div>
        
        <div className="mobile-filter-section">
          <div className="mobile-filter-section-title">Founded Year</div>
          <div className="mobile-filter-input-group">
            <input
              type="number"
              placeholder="Min Year"
              value={filters.minYear}
              onChange={(e) => setFilters(prev => ({ ...prev, minYear: e.target.value }))}
              className="mobile-filter-input"
              min="1800"
            />
            <input
              type="number"
              placeholder="Max Year"
              value={filters.maxYear}
              onChange={(e) => setFilters(prev => ({ ...prev, maxYear: e.target.value }))}
              className="mobile-filter-input"
              min="1800"
            />
          </div>
        </div>
        
        <div className="mobile-filter-section">
          <div className="mobile-filter-section-title">Completed Projects</div>
          <div className="mobile-filter-input-group">
            <input
              type="number"
              placeholder="Min Projects"
              value={filters.minProjects}
              onChange={(e) => setFilters(prev => ({ ...prev, minProjects: e.target.value }))}
              className="mobile-filter-input"
              min="0"
            />
            <input
              type="number"
              placeholder="Max Projects"
              value={filters.maxProjects}
              onChange={(e) => setFilters(prev => ({ ...prev, maxProjects: e.target.value }))}
              className="mobile-filter-input"
              min="0"
            />
          </div>
        </div>
        
        <div className="mobile-filter-section">
          <div className="mobile-filter-section-title">Specialization</div>
          <input
            type="text"
            placeholder="e.g. Residential, Commercial"
            value={filters.specialization}
            onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
            className="mobile-filter-input"
          />
        </div>
      </div>
      
      <div className="mobile-drawer-footer">
        <button className="mobile-clear-filters" onClick={clearAllFilters}>
          Clear All
        </button>
        <button className="mobile-apply-filters" onClick={() => setShowFiltersDrawer(false)}>
          Show {filteredDevelopers.length} {filteredDevelopers.length === 1 ? 'Result' : 'Results'}
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
                  placeholder="Search developers" 
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
        </div>
      )}
      
      {/* Desktop Navbar with search */}
      {!isMobile && (
        <div className="Navbar">
          <form onSubmit={handleSearchSubmit} className="search-container slide-in-left">
            <input 
              type="searchbar" 
              placeholder="SEARCH DEVELOPERS BY NAME OR LOCATION" 
              value={filters.search} 
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            <button type="submit" className="search-button">
              <SearchIcon />
            </button>
          </form>
          <div className="NavbarBtn slide-in-right">
            <button 
              id="FilterBtn" 
              className="btn-animate"
              onClick={() => setShowFiltersDrawer(true)}
            >
              <FilterAlt /> FILTERS
              {activeFilterCount > 0 && (
                <span className="filter-badge">{activeFilterCount}</span>
              )}
            </button>
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

      {/* Desktop Filter Drawer */}
      {!isMobile && showFiltersDrawer && (
        <Drawer
          anchor="right"
          open={showFiltersDrawer}
          onClose={() => setShowFiltersDrawer(false)}
          className="desktop-filter-drawer"
          sx={{
            '& .MuiPaper-root': {
              width: '350px',
              backgroundColor: '#0B1011',
              color: 'white',
              padding: '20px'
            }
          }}
        >
          <div className="desktop-drawer-header">
            <div className="desktop-drawer-title">Developer Filters</div>
            <IconButton className="close-drawer-btn" onClick={() => setShowFiltersDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          
          <div className="desktop-drawer-content">
            <div className="desktop-filter-section">
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Location</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <input
                    type="text"
                    placeholder="City"
                    value={filters.city}
                    onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                    className="desktop-filter-input"
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="text"
                    placeholder="State"
                    value={filters.state}
                    onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                    className="desktop-filter-input"
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="text"
                    placeholder="Country"
                    value={filters.country}
                    onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                    className="desktop-filter-input"
                  />
                </Grid>
              </Grid>
            </div>
            
            <div className="desktop-filter-section">
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Founded Year</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <input
                    type="number"
                    placeholder="Min Year"
                    value={filters.minYear}
                    onChange={(e) => setFilters(prev => ({ ...prev, minYear: e.target.value }))}
                    className="desktop-filter-input"
                    min="1800"
                  />
                </Grid>
                <Grid item xs={6}>
                  <input
                    type="number"
                    placeholder="Max Year"
                    value={filters.maxYear}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxYear: e.target.value }))}
                    className="desktop-filter-input"
                    min="1800"
                  />
                </Grid>
              </Grid>
            </div>
            
            <div className="desktop-filter-section">
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Completed Projects</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <input
                    type="number"
                    placeholder="Min Projects"
                    value={filters.minProjects}
                    onChange={(e) => setFilters(prev => ({ ...prev, minProjects: e.target.value }))}
                    className="desktop-filter-input"
                    min="0"
                  />
                </Grid>
                <Grid item xs={6}>
                  <input
                    type="number"
                    placeholder="Max Projects"
                    value={filters.maxProjects}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxProjects: e.target.value }))}
                    className="desktop-filter-input"
                    min="0"
                  />
                </Grid>
              </Grid>
            </div>
            
            <div className="desktop-filter-section">
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Specialization</Typography>
              <input
                type="text"
                placeholder="e.g. Residential, Commercial"
                value={filters.specialization}
                onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
                className="desktop-filter-input"
              />
            </div>
          </div>
          
          <div className="desktop-drawer-footer">
            <Button 
              variant="outlined" 
              onClick={clearAllFilters}
              sx={{ 
                color: '#78CADC', 
                borderColor: '#78CADC',
                '&:hover': { borderColor: '#5cb3c5' }
              }}
            >
              Clear All
            </Button>
            <Button 
              variant="contained" 
              onClick={() => setShowFiltersDrawer(false)}
              sx={{ 
                backgroundColor: '#78CADC',
                '&:hover': { backgroundColor: '#5cb3c5' }
              }}
            >
              Apply Filters
            </Button>
          </div>
        </Drawer>
      )}

      {/* Breadcrumb */}
      <div className={`breadcrumb fade-in-delay-1 ${isMobile ? 'mobile-breadcrumb' : ''}`}>
        <a href="/">HOME</a>
        <span className="separator">&gt;</span>
        <a href="#">DEVELOPERS</a>
      </div>

      {/* Page Title */}
      <div className="page-title fade-in-delay-2">
        <h1>
          Top <span className='highlight-words'>Real Estate Developers</span> in India
        </h1>
        <div className="listings-count">
          {filteredDevelopers.length} DEVELOPER{filteredDevelopers.length !== 1 ? 'S' : ''}
        </div>
      </div>

      {/* Active Filter Tags with responsive design */}
      {activeFilterCount > 0 && (
        <div className={`filter-tags fade-in-delay-3 ${isMobile ? 'mobile-filter-tags' : ''}`}>
          {isMobile && activeFilterCount > 3 && !expandedFilters ? (
            <>
              {Object.entries(filters)
                .filter(([key, value]) => value && value !== '')
                .slice(0, 2)
                .map(([key, value]) => (
                  <div key={key} className="filter-tag">
                    <span className="filter-label">
                      {key === 'minYear' ? 'Min Year: ' : 
                       key === 'maxYear' ? 'Max Year: ' : 
                       key === 'minProjects' ? 'Min Projects: ' : 
                       key === 'maxProjects' ? 'Max Projects: ' : 
                       `${key.charAt(0).toUpperCase() + key.slice(1)}: `}
                      {value}
                    </span>
                    <button onClick={() => removeFilter(key)} aria-label="Remove filter">
                      <CloseIcon fontSize="small" />
                    </button>
                  </div>
                ))}
                
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
                  if (!value || value === '') return null;
                  return (
                    <div key={key} className="filter-tag">
                      <span className="filter-label">
                        {key === 'minYear' ? 'Min Year: ' : 
                         key === 'maxYear' ? 'Max Year: ' : 
                         key === 'minProjects' ? 'Min Projects: ' : 
                         key === 'maxProjects' ? 'Max Projects: ' : 
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
            
            {!isMobile && (
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

      {/* Empty state with responsive design */}
      {!developers || developers.length === 0 ? (
        <Container maxWidth="md" className="empty-state fade-in-delay-4">
          <Typography variant="h6" gutterBottom>
            No developers found matching your criteria
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Try adjusting your filters or search terms
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => getDevelopers({})}
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
        </Container>
      ) : (
        <>
          <div className="developer-listings fade-in-delay-4">
            <div className="developer-grid">
              {paginatedDevelopers.map(developer => (
                <DeveloperCard 
                  key={developer._id} 
                  onClick={navigate(`/developers/${developer._id}`)}
                  developer={developer} 
                  isMobile={isMobile}
                />
              ))}
            </div>
          </div>

          {/* Pagination with responsive design */}
          {filteredDevelopers.length > itemsPerPage && (
            <Stack spacing={1} className="pagination-container fade-in-delay-4">
              <Pagination
                count={Math.ceil(filteredDevelopers.length / itemsPerPage)}
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
                {paginatedDevelopers.length} of {filteredDevelopers.length} developers
              </Typography>
            </Stack>
          )}
        </>
      )}
    </div>
  );
};

export default DeveloperList;