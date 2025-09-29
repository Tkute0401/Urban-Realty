import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, 
  IconButton, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Typography, 
  Chip, 
  Divider,
  CircularProgress,
  Collapse,
  Fade
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Clear as ClearIcon, 
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Star as StarIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { debounce } from 'lodash';
import searchAnalytics from './SearchAnalytics';

const MobileEnhancedSearch = ({ 
  value, 
  onChange, 
  onSubmit, 
  expanded,
  onToggle,
  placeholder = "Search location, property type, or amenities...",
  className = ""
}) => {
  console.log('🔧 MobileEnhancedSearch rendering...', { expanded, value });
  
  React.useEffect(() => {
    console.log('🔧 MobileEnhancedSearch mounted on client side!', { expanded });
  }, []);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // Focus input when expanded
  useEffect(() => {
    if (expanded && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [expanded]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2) {
        setSuggestions([]);
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
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    [setSuggestions, setLoading]
  );

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    debouncedSearch(newValue);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.text);
    
    // Track search analytics
    searchAnalytics.trackSearch(suggestion.text);
    
    // Add to recent searches
    const newRecentSearches = [
      suggestion.text,
      ...recentSearches.filter(item => item !== suggestion.text)
    ].slice(0, 5);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    
    // Submit the search and close
    if (onSubmit) {
      onSubmit(suggestion.text);
    }
    onToggle(false);
  };

  // Handle recent search click
  const handleRecentSearchClick = (searchTerm) => {
    onChange(searchTerm);
    if (onSubmit) {
      onSubmit(searchTerm);
    }
    onToggle(false);
  };

  // Handle popular search click
  const handlePopularSearchClick = (searchTerm) => {
    onChange(searchTerm);
    if (onSubmit) {
      onSubmit(searchTerm);
    }
    onToggle(false);
  };

  // Handle clear input
  const handleClear = () => {
    onChange('');
    setSuggestions([]);
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
      onToggle(false);
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
    <Box className={className}>
      {/* Search Button (when collapsed) */}
      {!expanded && (
        <button 
          className="mobile-search-button" 
          onClick={() => onToggle(true)}
          aria-label="Search"
        >
          <SearchIcon />
        </button>
      )}

      {/* Expanded Search Form */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <form onSubmit={handleSubmit} className="mobile-search-form">
          <IconButton 
            className="mobile-search-back" 
            onClick={() => onToggle(false)}
            aria-label="Back"
            sx={{ color: '#78CADC' }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <input 
            ref={inputRef}
            type="text" 
            placeholder={placeholder}
            value={value} 
            onChange={handleInputChange}
            className="mobile-search-input"
          />
          
          {value && (
            <IconButton 
              className="mobile-search-clear" 
              onClick={handleClear}
              aria-label="Clear search"
              sx={{ color: '#78CADC', position: 'absolute', right: 10 }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </form>

        {/* Suggestions Dropdown */}
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1300,
            mt: 1,
            maxHeight: 300,
            overflow: 'auto',
            backgroundColor: '#0B1011',
            color: 'white',
            border: '1px solid',
            borderColor: '#78CADC',
            borderRadius: 1
          }}
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <>
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography variant="subtitle2" color="#78CADC" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                    sx={{ py: 0.5, color: 'white', cursor: 'pointer', border: 'none', background: 'transparent', width: '100%' }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <HistoryIcon fontSize="small" sx={{ color: '#78CADC' }} />
                    </ListItemIcon>
                    <ListItemText primary={search} />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ borderColor: '#78CADC' }} />
            </>
          )}

          {/* Popular Searches */}
          {popularSearches.length > 0 && (
            <>
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography variant="subtitle2" color="#78CADC" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                    sx={{ 
                      color: 'white', 
                      borderColor: '#78CADC',
                      '&:hover': { borderColor: '#78CADC', backgroundColor: 'rgba(120, 202, 220, 0.1)' }
                    }}
                  />
                ))}
              </Box>
              <Divider sx={{ borderColor: '#78CADC' }} />
            </>
          )}

          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <>
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography variant="subtitle2" color="#78CADC">
                  Suggestions
                </Typography>
              </Box>
              {Object.entries(groupedSuggestions).map(([category, categorySuggestions]) => (
                <Box key={category}>
                  <Box sx={{ px: 2, py: 1, backgroundColor: 'rgba(120, 202, 220, 0.1)' }}>
                    <Typography variant="caption" color="#78CADC" fontWeight="medium">
                      {category}
                    </Typography>
                  </Box>
                  <List dense>
                    {(categorySuggestions as any[]).map((suggestion: any, index: number) => (
                      <ListItem
                        key={`${category}-${index}`}
                        component="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        sx={{ py: 0.5, color: 'white', cursor: 'pointer', border: 'none', background: 'transparent', width: '100%' }}
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

          {/* Loading State */}
          {loading && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <CircularProgress size={24} sx={{ color: '#78CADC' }} />
            </Box>
          )}

          {/* No Results */}
          {!loading && suggestions.length === 0 && recentSearches.length === 0 && popularSearches.length === 0 && value.length >= 2 && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="#78CADC">
                No suggestions found for &ldquo;{value}&rdquo;
              </Typography>
            </Box>
          )}
        </Paper>
      </Collapse>
    </Box>
  );
};

export default MobileEnhancedSearch;