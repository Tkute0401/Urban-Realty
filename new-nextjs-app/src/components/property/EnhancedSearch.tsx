import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Popper, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Typography, 
  Chip, 
  Divider,
  CircularProgress,
  Fade,
  ClickAwayListener
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Clear as ClearIcon, 
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Star as StarIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { debounce } from 'lodash';
import searchAnalytics from './SearchAnalytics';

const EnhancedSearch = ({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = "Search by location, property type, or amenities...",
  variant = "outlined",
  size = "medium",
  fullWidth = true,
  showSuggestions = true,
  className = ""
}) => {
  console.log('🔧 EnhancedSearch rendering...', { value, showSuggestions });
  
  React.useEffect(() => {
    console.log('🔧 EnhancedSearch mounted on client side!');
  }, []);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const inputRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing recent searches:', error);
      }
    }
  }, []);

  // Set default popular searches and load analytics
  useEffect(() => {
    // Load popular searches from analytics
    const analyticsPopular = searchAnalytics.getPopularSearches(10);
    if (analyticsPopular.length > 0) {
      setPopularSearches(analyticsPopular);
    } else {
      // Fallback to default popular searches
      setPopularSearches([
        'Mumbai',
        'Delhi',
        'Bangalore',
        'Pune',
        'Hyderabad',
        'Chennai',
        'Kolkata',
        'Noida',
        'Gurgaon',
        'Nashik'
      ]);
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/v1/properties/search-suggestions?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.success) {
          const allSuggestions = [];
          
          // Add cities with location icon
          data.data.cities.forEach(city => {
            allSuggestions.push({
              text: city,
              type: 'city',
              icon: <LocationIcon color="primary" />,
              category: 'Cities'
            });
          });
          
          // Add states with location icon
          data.data.states.forEach(state => {
            allSuggestions.push({
              text: state,
              type: 'state',
              icon: <LocationIcon color="primary" />,
              category: 'States'
            });
          });
          
          // Add property types with home icon
          data.data.propertyTypes.forEach(type => {
            allSuggestions.push({
              text: type,
              type: 'propertyType',
              icon: <HomeIcon color="primary" />,
              category: 'Property Types'
            });
          });
          
          // Add amenities with star icon
          data.data.amenities.forEach(amenity => {
            allSuggestions.push({
              text: amenity,
              type: 'amenity',
              icon: <StarIcon color="primary" />,
              category: 'Amenities'
            });
          });
          
          setSuggestions(allSuggestions);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    [setSuggestions, setShowDropdown, setLoading]
  );

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (showSuggestions) {
      debouncedSearch(newValue);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.text);
    setShowDropdown(false);
    
    // Track search analytics
    searchAnalytics.trackSearch(suggestion.text);
    
    // Add to recent searches
    const newRecentSearches = [
      suggestion.text,
      ...recentSearches.filter(item => item !== suggestion.text)
    ].slice(0, 5);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    
    // Submit the search
    if (onSubmit) {
      onSubmit(suggestion.text);
    }
  };

  // Handle recent search click
  const handleRecentSearchClick = (searchTerm) => {
    onChange(searchTerm);
    setShowDropdown(false);
    
    if (onSubmit) {
      onSubmit(searchTerm);
    }
  };

  // Handle popular search click
  const handlePopularSearchClick = (searchTerm) => {
    onChange(searchTerm);
    setShowDropdown(false);
    
    if (onSubmit) {
      onSubmit(searchTerm);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (showSuggestions && (recentSearches.length > 0 || popularSearches.length > 0)) {
      setShowDropdown(true);
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => setShowDropdown(false), 200);
  };

  // Handle clear input
  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      // Track search analytics
      searchAnalytics.trackSearch(value.trim());
      
      // Add to recent searches
      const newRecentSearches = [
        value.trim(),
        ...recentSearches.filter(item => item !== value.trim())
      ].slice(0, 5);
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      
      if (onSubmit) {
        onSubmit(value.trim());
      }
    }
  };

  // Group suggestions by category
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = [];
    }
    acc[suggestion.category].push(suggestion);
    return acc;
  }, {});

  return (
    <Box className={className} position="relative">
      <form onSubmit={handleSubmit}>
        <TextField
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          variant={variant as any}
          size={size as any}
          fullWidth={fullWidth}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading && <CircularProgress size={20} />}
                {value && (
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && showDropdown && (
        <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
          <Paper
            elevation={8}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1300,
              mt: 1,
              maxHeight: 400,
              overflow: 'auto',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1
            }}
          >
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <>
                <Box sx={{ p: 2, pb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HistoryIcon fontSize="small" />
                    Recent Searches
                  </Typography>
                </Box>
                <List dense>
                  {recentSearches.map((search, index) => (
                    <ListItem
                      key={index}
                      component="button"
                      onClick={() => handleRecentSearchClick(search)}
                      sx={{ py: 0.5, cursor: 'pointer', border: 'none', background: 'transparent', width: '100%' }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <HistoryIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText primary={search} />
                    </ListItem>
                  ))}
                </List>
                <Divider />
              </>
            )}

            {/* Popular Searches */}
            {popularSearches.length > 0 && (
              <>
                <Box sx={{ p: 2, pb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingIcon fontSize="small" />
                    Popular Searches
                  </Typography>
                </Box>
                <Box sx={{ px: 2, pb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {popularSearches.map((search, index) => (
                    <Chip
                      key={index}
                      label={search}
                      size="small"
                      clickable
                      onClick={() => handlePopularSearchClick(search)}
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Divider />
              </>
            )}

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <>
                <Box sx={{ p: 2, pb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Suggestions
                  </Typography>
                </Box>
                {Object.entries(groupedSuggestions).map(([category, categorySuggestions]) => (
                  <Box key={category}>
                    <Box sx={{ px: 2, py: 1, backgroundColor: 'action.hover' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="medium">
                        {category}
                      </Typography>
                    </Box>
                    <List dense>
                      {(categorySuggestions as any[]).map((suggestion: any, index: number) => (
                        <ListItem
                          key={`${category}-${index}`}
                          component="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          sx={{ py: 0.5, cursor: 'pointer', border: 'none', background: 'transparent', width: '100%' }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {suggestion.icon}
                          </ListItemIcon>
                          <ListItemText primary={suggestion.text} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </>
            )}

            {/* No Results */}
            {!loading && suggestions.length === 0 && recentSearches.length === 0 && popularSearches.length === 0 && value.length >= 2 && (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No suggestions found for &ldquo;{value}&rdquo;
                </Typography>
              </Box>
            )}
          </Paper>
        </ClickAwayListener>
      )}
    </Box>
  );
};

export default EnhancedSearch;