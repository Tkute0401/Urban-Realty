'use client';

import React, { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  InputLabel,
  Chip,
  IconButton,
  Drawer,
  Stack,
  Paper
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Close,
  ArrowBack,
  LocationOn,
  Add,
  Refresh,
  MyLocation,
  ViewList,
  Map as MapIcon,
  Layers,
  CompareArrows,
  Bookmark,
  BookmarkBorder
} from '@mui/icons-material';
import { useProperties } from '@/contexts/PropertiesContext';
import PropertyList from '@/components/property/PropertyList';
import PropertiesMap from '@/components/property/PropertiesMap';
import PropertyHeatMap from '@/components/property/PropertyHeatMap';
import RecommendedProperties from '@/components/property/RecommendedProperties';
import SearchAutocomplete from '@/components/property/SearchAutocomplete';
import { useComparison } from '@/contexts/ComparisonContext';
import { useLocation } from '@/hooks/useLocation';
import { useTheme } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import '@/style-constants/z-index.css';

const PropertiesPageContent: React.FC = () => {
  const router = useRouter();
  // Removed useSearchParams() to prevent hydration mismatches - using window.location.search instead
  const { properties, similarProperties, loading, error, pagination, getProperties, getSimilarProperties } = useProperties();
  const { location: userLocation, loading: locationLoading, error: locationError, requestLocation } = useLocation();
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mobileCheckInitialized = useRef(false);
  
  const [isInitialized, setIsInitialized] = useState(false);
  const isInitializedRef = useRef<boolean>(false);
  const urlParamsRef = useRef<string>('');
  const isUpdatingUrlRef = useRef<boolean>(false);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [expandedSearch, setExpandedSearch] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [activeBtn, setActiveBtn] = useState('ALL');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isClearingFilters, setIsClearingFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'heatmap'>('list');
  const { user } = useAuth();
  const { comparisonProperties, addToComparison, removeFromComparison } = useComparison();
  
  // All state hooks must be declared before any other logic to ensure consistent hook order
  const [showHomeTypeFilter, setShowHomeTypeFilter] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showBedBathFilter, setShowBedBathFilter] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    propertyType: 'ALL',
    type: '',
    city: '',
    state: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [] as string[],
    minArea: '',
    maxArea: '',
    // New advanced filters
    constructionStatus: [] as string[],
    furnished: undefined as boolean | undefined,
    facing: '',
    floorRangeMin: '',
    floorRangeMax: '',
    parkingSpaces: '',
    verified: undefined as boolean | undefined,
    hasVirtualTour: undefined as boolean | undefined,
    nearSchools: false,
    nearHospitals: false,
    nearMalls: false,
    nearMetro: false,
    nearParks: false,
    maxCommuteTime: '',
    commuteMode: 'driving' as 'driving' | 'transit' | 'walking',
    affordable: false
  });

  // Initialize refs after state declarations to avoid hook order issues
  // Use function initializers to ensure refs are always initialized with current values
  const filtersRef = useRef<typeof filters>(filters);
  const paginationRef = useRef<typeof pagination>(pagination);
  const userLocationRef = useRef<typeof userLocation>(userLocation);
  const getPropertiesRef = useRef<typeof getProperties>(getProperties);

  // All hooks must be declared before any functions or other logic
  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property);
    const slug = property.slug || property.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || property._id;
    router.push(`/properties/${slug}`);
  };

  const amenityOptions = [
    'Parking', 'Swimming Pool', 'Gym', 'Security', 'Garden', 'Balcony',
    'WiFi', 'Air Conditioning', 'Furnished', 'Pet Friendly', 'Elevator',
    'Laundry', 'Storage', 'Conference Room', 'Kitchen'
  ];

  // Update refs synchronously - no separate effects to avoid hook order issues
  // Stable loadProperties function that uses refs to avoid dependency issues
  // Accepts optional filterState and resetPage to support advanced search
  const loadProperties = useCallback((filterState?: any, resetPage: boolean = false) => {
    // Update refs synchronously before using them
    filtersRef.current = filters;
    paginationRef.current = pagination;
    userLocationRef.current = userLocation;
    getPropertiesRef.current = getProperties;
    
    const currentFilters = filterState || filtersRef.current;
    const currentPagination = paginationRef.current;
    const currentUserLocation = userLocationRef.current;
    const currentGetProperties = getPropertiesRef.current;
    
    const params: any = {
      page: resetPage ? 1 : currentPagination.page,
      limit: 12
    };

    if (currentFilters.search) params.search = currentFilters.search;
    if (currentFilters.type) params.type = currentFilters.type;
    if (currentFilters.city) params.city = currentFilters.city;
    if (currentFilters.state) params.state = currentFilters.state;
    
    // Check for price min/max with proper string validation
    if (currentFilters.priceMin && currentFilters.priceMin.trim() !== '') {
      const minPrice = Number(currentFilters.priceMin);
      if (!isNaN(minPrice) && minPrice > 0) {
        params.minPrice = minPrice;
      }
    }
    if (currentFilters.priceMax && currentFilters.priceMax.trim() !== '') {
      const maxPrice = Number(currentFilters.priceMax);
      if (!isNaN(maxPrice) && maxPrice > 0) {
        params.maxPrice = maxPrice;
      }
    }
    
    if (currentFilters.bedrooms) params.bedrooms = Number(currentFilters.bedrooms);
    if (currentFilters.bathrooms) params.bathrooms = Number(currentFilters.bathrooms);
    if (currentFilters.amenities && Array.isArray(currentFilters.amenities) && currentFilters.amenities.length > 0) {
      params.amenities = currentFilters.amenities.join(',');
    }
    if (currentFilters.minArea) params.minArea = Number(currentFilters.minArea);
    if (currentFilters.maxArea) params.maxArea = Number(currentFilters.maxArea);
    if (currentFilters.propertyType !== 'ALL') {
      params.status = currentFilters.propertyType === 'BUY' ? 'For Sale' : 'For Rent';
    }

    // Advanced filters
    if (currentFilters.constructionStatus && Array.isArray(currentFilters.constructionStatus) && currentFilters.constructionStatus.length > 0) {
      params.constructionStatus = currentFilters.constructionStatus.join(',');
    }
    if (currentFilters.furnished !== undefined) {
      params.furnished = currentFilters.furnished;
    }
    if (currentFilters.facing) params.facing = currentFilters.facing;
    if (currentFilters.floorRangeMin) params.floorRangeMin = Number(currentFilters.floorRangeMin);
    if (currentFilters.floorRangeMax) params.floorRangeMax = Number(currentFilters.floorRangeMax);
    if (currentFilters.parkingSpaces) params.parkingSpaces = Number(currentFilters.parkingSpaces);
    if (currentFilters.verified !== undefined) {
      params.verified = currentFilters.verified;
    }
    if (currentFilters.hasVirtualTour !== undefined) {
      params.hasVirtualTour = currentFilters.hasVirtualTour;
    }
    if (currentFilters.nearSchools) params.nearSchools = currentFilters.nearSchools;
    if (currentFilters.nearHospitals) params.nearHospitals = currentFilters.nearHospitals;
    if (currentFilters.nearMalls) params.nearMalls = currentFilters.nearMalls;
    if (currentFilters.nearMetro) params.nearMetro = currentFilters.nearMetro;
    if (currentFilters.nearParks) params.nearParks = currentFilters.nearParks;
    if (currentFilters.maxCommuteTime) params.maxCommuteTime = Number(currentFilters.maxCommuteTime);
    if (currentFilters.commuteMode) params.commuteMode = currentFilters.commuteMode;
    if (currentFilters.affordable) params.affordable = currentFilters.affordable;

    // Add user location for distance-based sorting
    if (currentUserLocation) {
      params.userLat = currentUserLocation.latitude;
      params.userLng = currentUserLocation.longitude;
    }

    console.log('🔍 Loading properties with params:', params);
    currentGetProperties(params);
  }, [filters, pagination, userLocation, getProperties]); // Include deps but update refs synchronously

  useEffect(() => {
    setMounted(true);
  }, []);

  // Separate effect for mobile detection to ensure consistent hook order
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (mobileCheckInitialized.current) return;
    
    mobileCheckInitialized.current = true;
    const smBreakpoint = 600; // Standard Material-UI sm breakpoint
    const checkMobile = () => {
      setIsMobile(window.innerWidth < smBreakpoint);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Helper to read and update filters from URL - use ref to avoid dependency issues
  const updateFiltersFromUrl = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Skip if we're currently updating the URL programmatically
    if (isUpdatingUrlRef.current) {
      return;
    }

    try {
      const currentSearchString = window.location.search;
      
      // Only process if search string actually changed
      if (urlParamsRef.current === currentSearchString && isInitializedRef.current) {
        return;
      }

      urlParamsRef.current = currentSearchString;

      // Always use window.location.search as source of truth to avoid hydration issues
      const params = new URLSearchParams(currentSearchString);
      const search = params.get('search') || '';
      const type = params.get('type') || '';
      const city = params.get('city') || '';
      const propertyType = params.get('propertyType') || 'ALL';

      // Update filters only if values changed
      setFilters(prev => {
        const hasChanges = 
          prev.search !== search ||
          prev.type !== type ||
          prev.city !== city ||
          prev.propertyType !== propertyType;
        
        if (hasChanges) {
          return { ...prev, search, type, city, propertyType };
        }
        return prev;
      });

      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
        setIsInitialized(true);
      }
    } catch (err) {
      console.error('Error reading search params:', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - use refs for values that change

  // Safely read search params after mount to prevent hydration mismatch
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mounted || isClearingFilters) return;
    updateFiltersFromUrl();
  }, [mounted, isClearingFilters, updateFiltersFromUrl]);

  // Listen to URL changes via popstate events and polling for router navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mounted) return;

    let pollInterval: NodeJS.Timeout | null = null;
    let lastUrl = window.location.href;

    const checkUrlChange = () => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        updateFiltersFromUrl();
      }
    };

    const handleUrlChange = () => {
      setTimeout(() => {
        checkUrlChange();
      }, 0);
    };

    // Listen to browser navigation (back/forward)
    window.addEventListener('popstate', handleUrlChange);
    
    // Poll for URL changes (handles Next.js router.replace/push)
    pollInterval = setInterval(checkUrlChange, 200);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [mounted, updateFiltersFromUrl]);

  // Load properties when mounted or when filters/pagination/userLocation change
  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) {
      return;
    }
    loadProperties();
  }, [mounted, loadProperties]);

  // Fetch similar properties when there are any filters applied
  useEffect(() => {
    if (!loading) {
      // Check if any filter is active
      const hasActiveFilters = filters.search || filters.city || filters.type || 
                               filters.bedrooms || filters.bathrooms || 
                               filters.priceMin || filters.priceMax ||
                               filters.amenities.length > 0;
      
      if (hasActiveFilters) {
        console.log('Fetching similar properties...');
        const similarParams: any = {};
        if (filters.search) similarParams.search = filters.search;
        if (filters.city) similarParams.city = filters.city;
        if (filters.type) similarParams.type = filters.type;
        getSimilarProperties(similarParams);
      }
    }
  }, [loading, filters.search, filters.city, filters.type, filters.bedrooms, filters.bathrooms, filters.priceMin, filters.priceMax, filters.amenities.length, getSimilarProperties]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setShowHomeTypeFilter(false);
        setShowPriceFilter(false);
        setShowBedBathFilter(false);
        setShowMoreFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    loadProperties();
    if (isMobile && expandedSearch) {
      setExpandedSearch(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    console.log('🔍 Filter change:', { key, value, newFilters });
    
    // Update URL params for filters that can come from URL
    if (key === 'search' || key === 'city' || key === 'type' || key === 'propertyType') {
      isUpdatingUrlRef.current = true;
      setTimeout(() => {
        const params = new URLSearchParams();
        if (newFilters.search) params.set('search', newFilters.search);
        if (newFilters.city) params.set('city', newFilters.city);
        if (newFilters.type) params.set('type', newFilters.type);
        if (newFilters.propertyType && newFilters.propertyType !== 'ALL') {
          params.set('propertyType', newFilters.propertyType);
        }
        const queryString = params.toString();
        router.replace(queryString ? `/properties?${queryString}` : '/properties');
        
        // Reset flag after a delay to allow URL to update
        setTimeout(() => {
          isUpdatingUrlRef.current = false;
          urlParamsRef.current = window.location.search;
        }, 100);
      }, 0);
    }
    
    // Auto-trigger search for specific filters with updated state
    if (key === 'bedrooms' || key === 'bathrooms' || key === 'amenities' || key === 'propertyType' || key === 'priceMin' || key === 'priceMax') {
      console.log('🔍 Auto-triggering search for:', key);
      // Use the newFilters directly to avoid state synchronization issues
      loadProperties(newFilters);
    }
  };

  // Removed loadPropertiesWithFilters - use loadProperties instead to avoid hook order issues

  const handlePropertyTypeChange = (newType: string) => {
    const newFilters = { ...filters, propertyType: newType };
    setFilters(newFilters);
    setActiveBtn(newType === 'RENT' ? 'RENT' : 'BUY');
    
    if (isMobile && showFiltersDrawer) {
      setShowFiltersDrawer(false);
    }
    
    // Update URL params - use setTimeout to avoid hydration race conditions
    isUpdatingUrlRef.current = true;
    setTimeout(() => {
      const params = new URLSearchParams();
      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.city) params.set('city', newFilters.city);
      if (newFilters.type) params.set('type', newFilters.type);
      if (newType !== 'ALL') {
        params.set('propertyType', newType);
      }
      const queryString = params.toString();
      // Use replace to avoid adding to history and prevent hydration issues
      router.replace(queryString ? `/properties?${queryString}` : '/properties');
      
      // Reset flag after a delay to allow URL to update
      setTimeout(() => {
        isUpdatingUrlRef.current = false;
        urlParamsRef.current = window.location.search;
      }, 100);
    }, 0);
    
    // Trigger search immediately with new filter
    loadProperties(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
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
      maxArea: '',
      constructionStatus: [],
      furnished: undefined,
      facing: '',
      floorRangeMin: '',
      floorRangeMax: '',
      parkingSpaces: '',
      verified: undefined,
      hasVirtualTour: undefined,
      nearSchools: false,
      nearHospitals: false,
      nearMalls: false,
      nearMetro: false,
      nearParks: false,
      maxCommuteTime: '',
      commuteMode: 'driving' as 'driving' | 'transit' | 'walking',
      affordable: false
    };
    
    // Set flag to prevent URL params useEffect from overriding
    setIsClearingFilters(true);
    
    setFilters(clearedFilters);
    
    if (isMobile) {
      setShowFiltersDrawer(false);
    }
    
    // Clear URL params by navigating to properties page without query params
    router.replace('/properties');
    
    // Trigger search with cleared filters and reset to page 1
    loadProperties(clearedFilters, true);
    
    // Reset flag after a short delay to allow URL update to complete
    setTimeout(() => {
      setIsClearingFilters(false);
    }, 100);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    const params: any = { page, limit: 12 };
    if (filters.search) params.search = filters.search;
    if (filters.type) params.type = filters.type;
    if (filters.city) params.city = filters.city;
    if (filters.state) params.state = filters.state;
    
    // Check for price min/max with proper string validation
    if (filters.priceMin && filters.priceMin.trim() !== '') {
      const minPrice = Number(filters.priceMin);
      if (!isNaN(minPrice) && minPrice > 0) {
        params.minPrice = minPrice;
      }
    }
    if (filters.priceMax && filters.priceMax.trim() !== '') {
      const maxPrice = Number(filters.priceMax);
      if (!isNaN(maxPrice) && maxPrice > 0) {
        params.maxPrice = maxPrice;
      }
    }
    
    if (filters.bedrooms) params.bedrooms = Number(filters.bedrooms);
    if (filters.bathrooms) params.bathrooms = Number(filters.bathrooms);
    if (filters.amenities && Array.isArray(filters.amenities) && filters.amenities.length > 0) {
      params.amenities = filters.amenities.join(',');
    }
    if (filters.minArea) params.minArea = Number(filters.minArea);
    if (filters.maxArea) params.maxArea = Number(filters.maxArea);
    if (filters.propertyType !== 'ALL') {
      params.status = filters.propertyType === 'BUY' ? 'For Sale' : 'For Rent';
    }
    
    // Add user location for distance-based sorting
    if (userLocation) {
      params.userLat = userLocation.latitude;
      params.userLng = userLocation.longitude;
    }
    
    getProperties(params);
  };

  const formatPrice = (price: number) => {
    if (!price) return '₹0';
    const num = typeof price === 'string' ? parseInt(price) : price;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num).replace('₹', '₹');
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => 
    key !== 'propertyType' && key !== 'search' && value && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  console.log('🔍 Properties page rendering:', {
    isMobile,
    propertiesCount: properties.length,
    userLocation,
    mounted
  });

  // Always render the same structure to ensure consistent hook order
  // Use conditional rendering instead of early return to prevent React error #310
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-family-sans, "Poppins", sans-serif)',
      overflow: 'hidden'
    }}>
      {!mounted ? (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'var(--color-bg)'
        }}>
          <CircularProgress sx={{ color: 'var(--color-primary)' }} />
        </Box>
      ) : (
        <>
      <Box sx={{
        maxWidth: '100vw',
        mx: 'auto',
        overflow: 'hidden'
      }}>
      {/* Mobile Search and Filter Bar */}
      {isMobile && (
        <Box sx={{
          position: 'sticky',
          top: 0,
          zIndex: 'var(--z-sticky-filters)',
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          p: 2
        }}>
          {/* Enhanced Mobile Search */}
          <Box sx={{ mb: 2 }}>
            <SearchAutocomplete
              value={filters.search}
              onChange={(value) => handleFilterChange('search', value)}
              placeholder="Search location, property type, or amenities..."
            />
          </Box>
          
          {/* Filter Button and Buy/Rent Toggle */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => setShowFiltersDrawer(true)}
              startIcon={<FilterList />}
              sx={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: 'var(--color-primary-hover)',
                  backgroundColor: 'var(--color-primary-light)'
                }
              }}
            >
              Filter
              {activeFilterCount > 0 && (
                <Chip
                  label={activeFilterCount}
                  size="small"
                  sx={{
                    ml: 1,
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-primary-contrast)',
                    fontSize: '12px',
                    height: '20px'
                  }}
                />
              )}
            </Button>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={filters.propertyType === 'ALL' ? 'contained' : 'outlined'}
                onClick={() => handlePropertyTypeChange('ALL')}
                sx={{
                  backgroundColor: filters.propertyType === 'ALL' ? 'var(--color-primary)' : 'transparent',
                  color: filters.propertyType === 'ALL' ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: '60px'
                }}
              >
                All
              </Button>
              <Button
                variant={filters.propertyType === 'BUY' ? 'contained' : 'outlined'}
                onClick={() => handlePropertyTypeChange('BUY')}
            sx={{ 
                  backgroundColor: filters.propertyType === 'BUY' ? 'var(--color-primary)' : 'transparent',
                  color: filters.propertyType === 'BUY' ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: '60px'
                }}
              >
                Buy
              </Button>
              <Button
                variant={filters.propertyType === 'RENT' ? 'contained' : 'outlined'}
                onClick={() => handlePropertyTypeChange('RENT')}
            sx={{ 
                  backgroundColor: filters.propertyType === 'RENT' ? 'var(--color-primary)' : 'transparent',
                  color: filters.propertyType === 'RENT' ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: '60px'
                }}
              >
                Rent
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      
      {/* Desktop Navbar with search */}
      {!isMobile && (
        <Box sx={{
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          py: 3
        }}>
          <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 4 }}>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <SearchAutocomplete
                  value={filters.search}
                  onChange={(value) => handleFilterChange('search', value)}
                  placeholder="Search by location, property type, or amenities..."
                />
              </Box>
              
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-contrast)',
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)'
                  }
                }}
              >
                Search
              </Button>
              
            </Box>

            {/* Buy/Rent Toggle */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={filters.propertyType === 'ALL' ? 'contained' : 'outlined'}
                onClick={() => handlePropertyTypeChange('ALL')}
                sx={{
                  backgroundColor: filters.propertyType === 'ALL' ? 'var(--color-primary)' : 'transparent',
                  color: filters.propertyType === 'ALL' ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1
                }}
              >
                ALL
              </Button>
              <Button
                variant={filters.propertyType === 'BUY' ? 'contained' : 'outlined'}
                onClick={() => handlePropertyTypeChange('BUY')}
                sx={{
                  backgroundColor: filters.propertyType === 'BUY' ? 'var(--color-primary)' : 'transparent',
                  color: filters.propertyType === 'BUY' ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1
                }}
              >
                BUY
              </Button>
              <Button
                variant={filters.propertyType === 'RENT' ? 'contained' : 'outlined'}
                onClick={() => handlePropertyTypeChange('RENT')}
                sx={{
                  backgroundColor: filters.propertyType === 'RENT' ? 'var(--color-primary)' : 'transparent',
                  color: filters.propertyType === 'RENT' ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1
                }}
              >
                RENT
              </Button>
            </Box>
          </Box>
              </Box>
            )}

      {/* Mobile Filter Drawer */}
      {isMobile && (
        <Drawer
          anchor="bottom"
          open={showFiltersDrawer}
          onClose={() => setShowFiltersDrawer(false)}
          sx={{
            '& .MuiPaper-root': {
              maxHeight: '90vh',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              zIndex: 'var(--z-drawer)',
            }
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid var(--color-border)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                Filters
              </Typography>
              <IconButton onClick={() => setShowFiltersDrawer(false)} sx={{ color: 'var(--color-primary)' }}>
                <Close />
              </IconButton>
            </Box>
          </Box>

          {/* Filter Content */}
          <Box sx={{ p: 2, maxHeight: '70vh', overflowY: 'auto' }}>
            {/* Property Type */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: 'var(--color-text-primary)', mb: 2, fontWeight: 600 }}>
                Property Type
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['Houses', 'Condos/Co-ops', 'Townhomes', 'Multi-family', 'Manufactured', 'Lots/Land', 'Apartments'].map(type => {
                  const isActive = filters.type === type;
                  return (
                    <Chip
                      key={type}
                      label={type}
                      clickable
                      variant={isActive ? 'filled' : 'outlined'}
                      onClick={() => handleFilterChange('type', isActive ? '' : type)}
                    sx={{ 
                        backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                        color: isActive ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                        borderColor: 'var(--color-primary)',
                      '&:hover': {
                          backgroundColor: isActive ? 'var(--color-primary-hover)' : 'var(--color-primary-light)'
                        }
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Buy/Rent Toggle */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: 'var(--color-text-primary)', mb: 2, fontWeight: 600 }}>
                Buy or Rent
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="All"
                  clickable
                  variant={filters.propertyType === 'ALL' ? 'filled' : 'outlined'}
                  onClick={() => handleFilterChange('propertyType', 'ALL')}
                  sx={{ 
                    backgroundColor: filters.propertyType === 'ALL' ? 'var(--color-primary)' : 'transparent',
                    color: filters.propertyType === 'ALL' ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                    borderColor: 'var(--color-primary)',
                    '&:hover': {
                      backgroundColor: filters.propertyType === 'ALL' ? 'var(--color-primary-hover)' : 'var(--color-primary-light)'
                    }
                  }}
                />
                <Chip
                  label="Buy"
                  clickable
                  variant={filters.propertyType === 'BUY' ? 'filled' : 'outlined'}
                  onClick={() => handleFilterChange('propertyType', 'BUY')}
                  sx={{ 
                    backgroundColor: filters.propertyType === 'BUY' ? 'var(--color-primary)' : 'transparent',
                    color: filters.propertyType === 'BUY' ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                    borderColor: 'var(--color-primary)',
                    '&:hover': {
                      backgroundColor: filters.propertyType === 'BUY' ? 'var(--color-primary-hover)' : 'var(--color-primary-light)'
                    }
                  }}
                />
                <Chip
                  label="Rent"
                  clickable
                  variant={filters.propertyType === 'RENT' ? 'filled' : 'outlined'}
                  onClick={() => handleFilterChange('propertyType', 'RENT')}
                  sx={{ 
                    backgroundColor: filters.propertyType === 'RENT' ? 'var(--color-primary)' : 'transparent',
                    color: filters.propertyType === 'RENT' ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                    borderColor: 'var(--color-primary)',
                    '&:hover': {
                      backgroundColor: filters.propertyType === 'RENT' ? 'var(--color-primary-hover)' : 'var(--color-primary-light)'
                    }
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: 'var(--color-text-primary)', mb: 2, fontWeight: 600 }}>
                Price Range
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Min Price"
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'var(--color-surface)',
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
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Max Price"
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'var(--color-surface)',
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
            </Box>

            {/* Beds & Baths */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: 'var(--color-text-primary)', mb: 2, fontWeight: 600 }}>
                Beds & Baths
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'var(--color-text-muted)' }}>Bedrooms</InputLabel>
                    <Select
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                      MenuProps={{
                        sx: {
                          zIndex: 9999
                        },
                        disablePortal: true
                      }}
                      sx={{
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-primary)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'var(--color-border)'
                        }
                      }}
                    >
                      <MenuItem value="">Any</MenuItem>
                      <MenuItem value="1">1+</MenuItem>
                      <MenuItem value="2">2+</MenuItem>
                      <MenuItem value="3">3+</MenuItem>
                      <MenuItem value="4">4+</MenuItem>
                      <MenuItem value="5">5+</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'var(--color-text-muted)' }}>Bathrooms</InputLabel>
                    <Select
                      value={filters.bathrooms}
                      onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                      MenuProps={{
                        sx: {
                          zIndex: 9999
                        },
                        disablePortal: true
                      }}
                      sx={{
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-primary)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'var(--color-border)'
                        }
                      }}
                    >
                      <MenuItem value="">Any</MenuItem>
                      <MenuItem value="1">1+</MenuItem>
                      <MenuItem value="1.5">1.5+</MenuItem>
                      <MenuItem value="2">2+</MenuItem>
                      <MenuItem value="3">3+</MenuItem>
                      <MenuItem value="4">4+</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Amenities */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: 'var(--color-text-primary)', mb: 2, fontWeight: 600 }}>
                Amenities
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {amenityOptions.map(amenity => {
                  const isActive = filters.amenities.includes(amenity);
                  return (
                    <Chip
                      key={amenity}
                      label={amenity}
                      clickable
                      variant={isActive ? 'filled' : 'outlined'}
                      onClick={() => {
                        const newAmenities = isActive
                          ? filters.amenities.filter(a => a !== amenity)
                          : [...filters.amenities, amenity];
                        console.log('🔍 Amenity clicked:', { amenity, isActive, newAmenities });
                        handleFilterChange('amenities', newAmenities);
                      }}
                      sx={{
                        backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                        color: isActive ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                        borderColor: 'var(--color-primary)',
                        '&:hover': {
                          backgroundColor: isActive ? 'var(--color-primary-hover)' : 'var(--color-primary-light)'
                        }
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Advanced Filters Section */}
            <Box sx={{ mb: 3, borderTop: '1px solid var(--color-border)', pt: 3 }}>
              <Typography variant="subtitle1" sx={{ color: 'var(--color-text-primary)', mb: 2, fontWeight: 600 }}>
                Advanced Filters
              </Typography>

              {/* Construction Status */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mb: 1 }}>
                  Construction Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['Under Construction', 'Ready to Move', 'New Launch', 'Almost Ready'].map(status => {
                    const isActive = filters.constructionStatus.includes(status);
                    return (
                      <Chip
                        key={status}
                        label={status}
                        clickable
                        size="small"
                        variant={isActive ? 'filled' : 'outlined'}
                        onClick={() => {
                          const newStatus = isActive
                            ? filters.constructionStatus.filter(s => s !== status)
                            : [...filters.constructionStatus, status];
                          handleFilterChange('constructionStatus', newStatus);
                        }}
                        sx={{
                          backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                          color: isActive ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                          borderColor: 'var(--color-primary)'
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>

              {/* Furnished */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mb: 1 }}>
                  Furnishing
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label="Furnished"
                    clickable
                    size="small"
                    variant={filters.furnished === true ? 'filled' : 'outlined'}
                    onClick={() => handleFilterChange('furnished', filters.furnished === true ? undefined : true)}
                    sx={{
                      backgroundColor: filters.furnished === true ? 'var(--color-primary)' : 'transparent',
                      color: filters.furnished === true ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                      borderColor: 'var(--color-primary)'
                    }}
                  />
                  <Chip
                    label="Unfurnished"
                    clickable
                    size="small"
                    variant={filters.furnished === false ? 'filled' : 'outlined'}
                    onClick={() => handleFilterChange('furnished', filters.furnished === false ? undefined : false)}
                    sx={{
                      backgroundColor: filters.furnished === false ? 'var(--color-primary)' : 'transparent',
                      color: filters.furnished === false ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                      borderColor: 'var(--color-primary)'
                    }}
                  />
                </Box>
              </Box>

              {/* Proximity Filters */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mb: 1 }}>
                  Nearby Amenities
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {[
                    { key: 'nearSchools', label: 'Schools' },
                    { key: 'nearHospitals', label: 'Hospitals' },
                    { key: 'nearMalls', label: 'Malls' },
                    { key: 'nearMetro', label: 'Metro' },
                    { key: 'nearParks', label: 'Parks' }
                  ].map(item => (
                    <Chip
                      key={item.key}
                      label={item.label}
                      clickable
                      size="small"
                      variant={filters[item.key as keyof typeof filters] ? 'filled' : 'outlined'}
                      onClick={() => handleFilterChange(item.key, !filters[item.key as keyof typeof filters])}
                      sx={{
                        backgroundColor: filters[item.key as keyof typeof filters] ? 'var(--color-primary)' : 'transparent',
                        color: filters[item.key as keyof typeof filters] ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                        borderColor: 'var(--color-primary)'
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Verified & Virtual Tour */}
              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="Verified Only"
                  clickable
                  size="small"
                  variant={filters.verified === true ? 'filled' : 'outlined'}
                  onClick={() => handleFilterChange('verified', filters.verified === true ? undefined : true)}
                  sx={{
                    backgroundColor: filters.verified === true ? 'var(--color-primary)' : 'transparent',
                    color: filters.verified === true ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                    borderColor: 'var(--color-primary)'
                  }}
                />
                <Chip
                  label="Has Virtual Tour"
                  clickable
                  size="small"
                  variant={filters.hasVirtualTour === true ? 'filled' : 'outlined'}
                  onClick={() => handleFilterChange('hasVirtualTour', filters.hasVirtualTour === true ? undefined : true)}
                  sx={{
                    backgroundColor: filters.hasVirtualTour === true ? 'var(--color-primary)' : 'transparent',
                    color: filters.hasVirtualTour === true ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                    borderColor: 'var(--color-primary)'
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ p: 2, borderTop: '1px solid var(--color-border)' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={clearAllFilters}
                        sx={{ 
                  flex: 1,
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Clear All
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  loadProperties();
                  setShowFiltersDrawer(false);
                }}
                sx={{
                  flex: 2,
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-contrast)',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)'
                  }
                }}
              >
                View {properties.length} Properties
              </Button>
            </Box>
          </Box>
        </Drawer>
      )}

      {/* Desktop Filter Bar */}
      {!isMobile && (
        <Box sx={{
          maxWidth: '1400px',
          mx: 'auto',
          px: 4,
          py: 2
        }}>
          {/* Filter Bar */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3,
            flexWrap: 'wrap'
          }}>

            {/* Filter Dropdowns */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {/* Home Type Filter */}
              <Box sx={{ position: 'relative' }} data-dropdown>
                <Button
                  variant="outlined"
                  onClick={() => setShowHomeTypeFilter(!showHomeTypeFilter)}
                  sx={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                    borderRadius: '4px',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    minWidth: '120px',
                    justifyContent: 'space-between',
                    '&:hover': {
                      borderColor: 'var(--color-primary)',
                      backgroundColor: 'rgba(120, 202, 220, 0.1)'
                    }
                  }}
                >
                  Home Type {showHomeTypeFilter ? '▲' : '▼'}
                  {filters.type && <span style={{ marginLeft: '8px', color: 'var(--color-primary)' }}>•</span>}
                </Button>
                
                {showHomeTypeFilter && (
                  <Paper sx={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(145deg, var(--color-surface) 0%, var(--color-surface-elevated) 100%)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.2)',
                    zIndex: 'var(--z-dropdown)',
                    p: 3,
                    minWidth: '280px'
                  }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)', fontWeight: 600 }}>
                      🏠 Select Home Type
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {['Houses', 'Condos/Co-ops', 'Townhomes', 'Multi-family', 'Manufactured', 'Lots/Land', 'Apartments'].map(type => {
                        const isActive = filters.type === type;
                        return (
                          <Box
                            key={type}
                            onClick={() => {
                              handleFilterChange('type', isActive ? '' : type);
                              setShowHomeTypeFilter(false);
                            }}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              p: 2,
                              borderRadius: '12px',
                              cursor: 'pointer',
                              backgroundColor: isActive ? 'rgba(120, 202, 220, 0.15)' : 'transparent',
                              border: `1px solid ${isActive ? 'var(--color-primary)' : 'transparent'}`,
                              '&:hover': {
                                backgroundColor: 'rgba(120, 202, 220, 0.08)',
                                borderColor: 'var(--color-primary)'
                              }
                            }}
                          >
                            <Box sx={{
                              width: 20,
                              height: 20,
                              border: '2px solid var(--color-primary)',
                              borderRadius: '6px',
                              backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isActive ? 'var(--color-primary-contrast)' : 'transparent',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              {isActive && '✓'}
                            </Box>
                            <Typography sx={{ 
                              color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                              fontWeight: isActive ? 600 : 500
                            }}>
                              {type}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Paper>
                )}
              </Box>

              {/* Price Filter */}
              <Box sx={{ position: 'relative' }} data-dropdown>
                <Button
                  variant="outlined"
                  onClick={() => setShowPriceFilter(!showPriceFilter)}
                  sx={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                    borderRadius: '4px',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    minWidth: '120px',
                    justifyContent: 'space-between',
                    '&:hover': {
                      borderColor: 'var(--color-primary)',
                      backgroundColor: 'rgba(120, 202, 220, 0.1)'
                    }
                  }}
                >
                  Price {showPriceFilter ? '▲' : '▼'}
                  {(filters.priceMin || filters.priceMax) && <span style={{ marginLeft: '8px', color: 'var(--color-primary)' }}>•</span>}
                </Button>
                
                {showPriceFilter && (
                  <Paper sx={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(145deg, var(--color-surface) 0%, var(--color-surface-elevated) 100%)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.2)',
                    zIndex: 'var(--z-dropdown)',
                    p: 3,
                    minWidth: '320px'
                  }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)', fontWeight: 600 }}>
                      💰 Price Range
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Min Price"
                          type="number"
                          value={filters.priceMin}
                          onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                          size="small"
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
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Max Price"
                          type="number"
                          value={filters.priceMax}
                          onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                          size="small"
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
                    <Button
                      variant="contained"
                      onClick={() => setShowPriceFilter(false)}
                      sx={{
                        mt: 2,
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-primary-contrast)',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        width: '100%'
                      }}
                    >
                      Apply
                    </Button>
                  </Paper>
                )}
              </Box>

              {/* Beds & Baths Filter */}
              <Box sx={{ position: 'relative' }} data-dropdown>
                <Button
                  variant="outlined"
                  onClick={() => setShowBedBathFilter(!showBedBathFilter)}
                  sx={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                    borderRadius: '4px',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    minWidth: '120px',
                    justifyContent: 'space-between',
                    '&:hover': {
                      borderColor: 'var(--color-primary)',
                      backgroundColor: 'rgba(120, 202, 220, 0.1)'
                    }
                  }}
                >
                  Beds & Baths {showBedBathFilter ? '▲' : '▼'}
                  {(filters.bedrooms || filters.bathrooms) && <span style={{ marginLeft: '8px', color: 'var(--color-primary)' }}>•</span>}
                </Button>
                
                {showBedBathFilter && (
                  <Paper sx={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    width: '280px',
                    background: 'linear-gradient(145deg, var(--color-surface) 0%, var(--color-surface-elevated) 100%)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.2)',
                    zIndex: 9999,
                    p: 2
                  }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)', fontWeight: 600 }}>
                      🛏️ Beds & Baths
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel sx={{ color: 'var(--color-text-muted)' }}>Bedrooms</InputLabel>
                          <Select
                            value={filters.bedrooms}
                            onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                            MenuProps={{
                              sx: {
                                zIndex: 9999
                              },
                              disablePortal: true
                            }}
                            sx={{
                              background: 'var(--color-bg)',
                              color: 'var(--color-text-primary)',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--color-border)'
                              }
                            }}
                          >
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="1">1+</MenuItem>
                            <MenuItem value="2">2+</MenuItem>
                            <MenuItem value="3">3+</MenuItem>
                            <MenuItem value="4">4+</MenuItem>
                            <MenuItem value="5">5+</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel sx={{ color: 'var(--color-text-muted)' }}>Bathrooms</InputLabel>
                          <Select
                            value={filters.bathrooms}
                            onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                            MenuProps={{
                              sx: {
                                zIndex: 9999
                              },
                              disablePortal: true
                            }}
                            sx={{
                              background: 'var(--color-bg)',
                              color: 'var(--color-text-primary)',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--color-border)'
                              }
                            }}
                          >
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="1">1+</MenuItem>
                            <MenuItem value="1.5">1.5+</MenuItem>
                            <MenuItem value="2">2+</MenuItem>
                            <MenuItem value="3">3+</MenuItem>
                            <MenuItem value="4">4+</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Button
                      variant="contained"
                      onClick={() => setShowBedBathFilter(false)}
                      sx={{
                        mt: 2,
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-primary-contrast)',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        width: '100%'
                      }}
                    >
                      Apply
                    </Button>
                  </Paper>
                )}
              </Box>

              {/* More Filters */}
              <Box sx={{ position: 'relative' }} data-dropdown>
                <Button
                  variant="outlined"
                  onClick={() => setShowMoreFilters(!showMoreFilters)}
                  sx={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                    borderRadius: '4px',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    minWidth: '120px',
                    justifyContent: 'space-between',
                    '&:hover': {
                      borderColor: 'var(--color-primary)',
                      backgroundColor: 'rgba(120, 202, 220, 0.1)'
                    }
                  }}
                >
                  More {showMoreFilters ? '▲' : '▼'}
                  {filters.amenities.length > 0 && <span style={{ marginLeft: '8px', color: 'var(--color-primary)' }}>•</span>}
                </Button>
                
                {showMoreFilters && (
                  <Paper sx={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(145deg, var(--color-surface) 0%, var(--color-surface-elevated) 100%)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.2)',
                    zIndex: 'var(--z-dropdown)',
                    p: 3,
                    minWidth: '400px'
                  }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)', fontWeight: 600 }}>
                      ⭐ Amenities
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {amenityOptions.map(amenity => {
                        const isActive = filters.amenities.includes(amenity);
                        return (
                          <Chip
                            key={amenity}
                            label={amenity}
                            clickable
                            variant={isActive ? 'filled' : 'outlined'}
                            onClick={() => {
                              const newAmenities = isActive
                                ? filters.amenities.filter(a => a !== amenity)
                                : [...filters.amenities, amenity];
                              console.log('🔍 Desktop amenity clicked:', { amenity, isActive, newAmenities });
                              handleFilterChange('amenities', newAmenities);
                            }}
                            size="small"
                            sx={{
                              backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                              color: isActive ? 'var(--color-primary-contrast)' : 'var(--color-primary)',
                              borderColor: 'var(--color-primary)',
                              '&:hover': {
                                backgroundColor: isActive ? 'var(--color-primary-hover)' : 'var(--color-primary-light)'
                              }
                            }}
                          />
                        );
                      })}
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() => setShowMoreFilters(false)}
                      sx={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-primary-contrast)',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        width: '100%'
                      }}
                    >
                      Apply
                    </Button>
                  </Paper>
                )}
              </Box>

            </Box>
          </Box>

          {/* All Properties Heading */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h3" sx={{ 
                color: 'var(--color-primary)', 
                fontWeight: 700
              }}>
                All Properties
              </Typography>
              <IconButton
                onClick={requestLocation}
                disabled={locationLoading}
                sx={{
                  backgroundColor: userLocation ? 'var(--color-primary)' : 'var(--color-background-secondary)',
                  color: userLocation ? 'white' : 'var(--color-text-muted)',
                  '&:hover': {
                    backgroundColor: userLocation ? 'var(--color-primary-dark)' : 'var(--color-primary)',
                    color: 'white'
                  },
                  transition: 'all 0.3s ease'
                }}
                title={userLocation ? 'Location detected' : 'Detect my location'}
              >
                {locationLoading ? <CircularProgress size={20} /> : <MyLocation />}
              </IconButton>
            </Box>
            <Typography variant="h6" sx={{ 
              color: 'var(--color-text-muted)',
              fontWeight: 500
            }}>
              {properties.length} LISTINGS
              {userLocation && (
                <Chip 
                  label="Sorted by distance" 
                  size="small" 
                  sx={{ 
                    ml: 2, 
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)'
                  }} 
                />
              )}
            </Typography>
            {locationError && (
              <Alert severity="warning" sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
                {locationError}
              </Alert>
            )}
          </Box>

          {/* Properties View - List/Map/HeatMap */}
          {viewMode === 'list' && (
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 2, md: 3 }, 
              flexDirection: { xs: 'column', lg: 'row' },
              maxWidth: '100%',
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                flex: { xs: 1, lg: '0 0 60%' },
                minWidth: 0,
                overflow: 'visible'
              }}>
                <PropertyList
                  properties={properties}
                  similarProperties={similarProperties}
                  loading={loading}
                  error={error}
                  emptyMessage="No properties found matching your criteria"
                  columns={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}
                  onPropertyClick={(property) => {
                    const slug = property.slug || property.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || property._id;
                    router.push(`/properties/${slug}`);
                  }}
                />
              </Box>
              <Box sx={{ 
              flex: { xs: 1, lg: '0 0 40%' }, 
              position: { xs: 'static', lg: 'sticky' }, 
              top: { lg: 20 }, 
              height: { lg: 'auto' },
              minWidth: 0,
              overflow: 'visible'
            }}>
              <PropertiesMap 
                properties={properties}
                selectedProperty={selectedProperty}
                userLocation={userLocation}
                onMarkerClick={handlePropertyClick}
                height="600px"
                searchQuery={filters.search}
              />
            </Box>
          </Box>
          )}

          {/* Map View */}
          {viewMode === 'map' && (
            <Box sx={{ height: '80vh', width: '100%' }}>
              <PropertiesMap 
                properties={properties}
                selectedProperty={selectedProperty}
                userLocation={userLocation}
                onMarkerClick={handlePropertyClick}
                height="100%"
                searchQuery={filters.search}
                enableClustering={true}
              />
            </Box>
          )}

          {/* Heat Map View */}
          {viewMode === 'heatmap' && (
            <Box sx={{ height: '80vh', width: '100%' }}>
              <PropertyHeatMap
                properties={properties}
              />
            </Box>
          )}
        </Box>
      )}

      {/* Mobile Properties List */}
      {isMobile && (
        <>
          {viewMode === 'list' && (
            <PropertyList
              properties={properties}
              similarProperties={similarProperties}
              loading={loading}
              error={error}
              emptyMessage="No properties found matching your criteria"
              columns={{ xs: 12, sm: 6, md: 4 }}
              onPropertyClick={(property) => router.push(`/properties/${property._id}`)}
            />
          )}
          {viewMode === 'map' && (
            <Box sx={{ height: '70vh', width: '100%' }}>
              <PropertiesMap 
                properties={properties}
                selectedProperty={selectedProperty}
                userLocation={userLocation}
                onMarkerClick={handlePropertyClick}
                height="100%"
                searchQuery={filters.search}
                enableClustering={true}
              />
            </Box>
          )}
          {viewMode === 'heatmap' && (
            <Box sx={{ height: '70vh', width: '100%' }}>
              <PropertyHeatMap
                properties={properties}
              />
            </Box>
          )}
        </>
      )}

      {/* Page Title */}
      <Box sx={{ 
        maxWidth: '1400px', 
        mx: 'auto', 
        px: { xs: 2, md: 4 },
        py: 4,
        textAlign: 'center'
      }}>
                      <Typography 
          variant="h3" 
                        sx={{ 
            color: 'var(--color-text-primary)', 
                          fontWeight: 'bold', 
            mb: 2,
            fontSize: { xs: '28px', sm: '36px', md: '48px' }
                        }}
                      >
          {filters.propertyType === 'RENT' ? 'Luxury Properties for ' : filters.propertyType === 'BUY' ? 'Luxury Properties for ' : 'All '}
          <span style={{ color: 'var(--color-primary)' }}>
            {filters.propertyType === 'RENT' ? 'Rent' : filters.propertyType === 'BUY' ? 'Sale' : 'Properties'}
          </span>
                      </Typography>
                        <Typography 
          variant="h6" 
                          sx={{ 
            color: 'var(--color-text-muted)',
            fontSize: { xs: '16px', sm: '18px', md: '20px' }
          }}
        >
          {properties.length} LISTING{properties.length !== 1 ? 'S' : ''}
                        </Typography>
                      </Box>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <Box sx={{ 
          maxWidth: '1400px', 
          mx: 'auto', 
          px: { xs: 2, md: 4 },
          mb: 3
        }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {Object.entries(filters).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0) || key === 'propertyType') return null;
              
              if (Array.isArray(value)) {
                return value.map(item => (
                        <Chip 
                    key={`${key}-${item}`}
                    label={`${key}: ${item}`}
                    onDelete={() => {
                      if (key === 'amenities') {
                        const newAmenities = filters.amenities.filter(a => a !== item);
                        handleFilterChange('amenities', newAmenities);
                      }
                    }}
                          sx={{ 
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      border: '1px solid var(--color-primary)',
                      '& .MuiChip-deleteIcon': {
                        color: 'var(--color-primary)'
                      }
                    }}
                  />
                ));
              }
              
              return (
                        <Chip 
                  key={key}
                  label={`${key}: ${value}`}
                  onDelete={() => handleFilterChange(key, '')}
                          sx={{ 
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)',
                    '& .MuiChip-deleteIcon': {
                      color: 'var(--color-primary)'
                    }
                  }}
                />
              );
            })}
            
            {activeFilterCount > 0 && (
              <Button
                variant="text"
                onClick={clearAllFilters}
                sx={{
                  color: 'var(--color-primary)',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Clear all
              </Button>
            )}
          </Box>
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, md: 4 }, mb: 3 }}>
          <Alert severity="error" sx={{ backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)' }}>
            {error}
          </Alert>
        </Box>
      )}
      </Box>
        </>
      )}
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