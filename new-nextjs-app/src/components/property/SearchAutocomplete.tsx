'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TextField, List, ListItem, ListItemText, Paper, Box, CircularProgress, Typography, Divider, Chip } from '@mui/material';
import { Search, LocationOn, Home, TrendingUp, History, Star } from '@mui/icons-material';

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
  placeholder?: string;
  sx?: any;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  value,
  onChange,
  onSuggestionClick,
  placeholder = 'Search by location, property type, or amenities...',
  sx
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [categorizedSuggestions, setCategorizedSuggestions] = useState<{
    cities?: string[];
    states?: string[];
    types?: string[];
    amenities?: string[];
    recent?: string[];
    popular?: string[];
  }>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get recent searches from localStorage
  const getRecentSearches = useCallback(() => {
    try {
      const recent = localStorage.getItem('recent_searches');
      return recent ? JSON.parse(recent).slice(0, 5) : [];
    } catch {
      return [];
    }
  }, []);

  // Save search to recent searches
  const saveToRecentSearches = useCallback((query: string) => {
    try {
      const recent = getRecentSearches();
      const updated = [query, ...recent.filter((s: string) => s !== query)].slice(0, 10);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  }, [getRecentSearches]);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setLoading(true);
      // Try Next.js API route first, fallback to backend API
      let response;
      try {
        response = await fetch(`/api/properties/search-suggestions?q=${encodeURIComponent(query)}&limit=10`);
      } catch (e) {
        // Fallback to backend API
        response = await fetch(`/api/v1/properties/search-suggestions?q=${encodeURIComponent(query)}&limit=10`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle both old format (array) and new format (categorized)
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
        setCategorizedSuggestions({});
      } else if (data.cities || data.states || data.types || data.amenities) {
        setCategorizedSuggestions({
          cities: data.cities || [],
          states: data.states || [],
          types: data.types || [],
          amenities: data.amenities || []
        });
        setSuggestions([]);
      } else {
        setSuggestions(data.suggestions || []);
        setCategorizedSuggestions({});
      }
      
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(value);
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
  }, [value, fetchSuggestions]);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    saveToRecentSearches(suggestion);
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  const handleFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    if (value.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    blurTimeoutRef.current = setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        sx={{
          ...sx,
          '& .MuiOutlinedInput-root': {
            background: sx?.['& .MuiOutlinedInput-root']?.background || 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            borderRadius: sx?.['& .MuiOutlinedInput-root']?.borderRadius || '12px',
            '& fieldset': {
              borderColor: 'var(--color-border)'
            },
            '&:hover fieldset': {
              borderColor: 'var(--color-primary)'
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--color-primary)'
            },
            ...sx?.['& .MuiOutlinedInput-root']
          }
        }}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'var(--color-primary)' }} />,
          endAdornment: loading ? (
            <CircularProgress size={20} sx={{ color: 'var(--color-primary)' }} />
          ) : null
        }}
      />
      
      {showSuggestions && (suggestions.length > 0 || Object.keys(categorizedSuggestions).length > 0 || loading || (!value && getRecentSearches().length > 0)) && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 9999,
            mt: 0.5,
            maxHeight: '400px',
            overflow: 'auto',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
          }}
          onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking inside
        >
          {loading && suggestions.length === 0 && Object.keys(categorizedSuggestions).length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
              <CircularProgress size={24} sx={{ color: 'var(--color-primary)' }} />
            </Box>
          ) : (
            <Box sx={{ p: 1 }}>
              {/* Recent Searches */}
              {!value && getRecentSearches().length > 0 && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
                    <History sx={{ fontSize: 18, mr: 1, color: 'var(--color-text-muted)' }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      Recent Searches
                    </Typography>
                  </Box>
                  {getRecentSearches().map((recent: string, index: number) => (
                    <ListItem
                      key={`recent-${index}`}
                      component="div"
                      onClick={() => handleSuggestionClick(recent)}
                      sx={{
                        py: 1,
                        px: 2,
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'var(--color-primary-light)' }
                      }}
                    >
                      <History sx={{ fontSize: 18, mr: 1.5, color: 'var(--color-text-muted)' }} />
                      <ListItemText
                        primary={recent}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: 'var(--color-text-primary)',
                            fontSize: '0.9rem'
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                  <Divider sx={{ my: 1 }} />
                </>
              )}

              {/* Categorized Suggestions */}
              {Object.keys(categorizedSuggestions).length > 0 ? (
                <>
                  {categorizedSuggestions.cities && categorizedSuggestions.cities.length > 0 && (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
                        <LocationOn sx={{ fontSize: 18, mr: 1, color: '#4CAF50' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>
                          Cities
                        </Typography>
                      </Box>
                      {categorizedSuggestions.cities.map((city, index) => (
                        <ListItem
                          key={`city-${index}`}
                          component="div"
                          onClick={() => handleSuggestionClick(city)}
                          sx={{
                            py: 1,
                            px: 2,
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: 'var(--color-primary-light)' }
                          }}
                        >
                          <LocationOn sx={{ fontSize: 18, mr: 1.5, color: '#4CAF50' }} />
                          <ListItemText
                            primary={city}
                            sx={{
                              '& .MuiListItemText-primary': {
                                color: 'var(--color-text-primary)',
                                fontSize: '0.9rem'
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </>
                  )}

                  {categorizedSuggestions.states && categorizedSuggestions.states.length > 0 && (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, mt: 1 }}>
                        <LocationOn sx={{ fontSize: 18, mr: 1, color: '#2196F3' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>
                          States
                        </Typography>
                      </Box>
                      {categorizedSuggestions.states.map((state, index) => (
                        <ListItem
                          key={`state-${index}`}
                          component="div"
                          onClick={() => handleSuggestionClick(state)}
                          sx={{
                            py: 1,
                            px: 2,
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: 'var(--color-primary-light)' }
                          }}
                        >
                          <LocationOn sx={{ fontSize: 18, mr: 1.5, color: '#2196F3' }} />
                          <ListItemText
                            primary={state}
                            sx={{
                              '& .MuiListItemText-primary': {
                                color: 'var(--color-text-primary)',
                                fontSize: '0.9rem'
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </>
                  )}

                  {categorizedSuggestions.types && categorizedSuggestions.types.length > 0 && (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, mt: 1 }}>
                        <Home sx={{ fontSize: 18, mr: 1, color: '#FF9800' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>
                          Property Types
                        </Typography>
                      </Box>
                      {categorizedSuggestions.types.map((type, index) => (
                        <ListItem
                          key={`type-${index}`}
                          component="div"
                          onClick={() => handleSuggestionClick(type)}
                          sx={{
                            py: 1,
                            px: 2,
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: 'var(--color-primary-light)' }
                          }}
                        >
                          <Home sx={{ fontSize: 18, mr: 1.5, color: '#FF9800' }} />
                          <ListItemText
                            primary={type}
                            sx={{
                              '& .MuiListItemText-primary': {
                                color: 'var(--color-text-primary)',
                                fontSize: '0.9rem'
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </>
                  )}

                  {categorizedSuggestions.amenities && categorizedSuggestions.amenities.length > 0 && (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, mt: 1 }}>
                        <Star sx={{ fontSize: 18, mr: 1, color: '#9C27B0' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>
                          Amenities
                        </Typography>
                      </Box>
                      {categorizedSuggestions.amenities.map((amenity, index) => (
                        <ListItem
                          key={`amenity-${index}`}
                          component="div"
                          onClick={() => handleSuggestionClick(amenity)}
                          sx={{
                            py: 1,
                            px: 2,
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: 'var(--color-primary-light)' }
                          }}
                        >
                          <Star sx={{ fontSize: 18, mr: 1.5, color: '#9C27B0' }} />
                          <ListItemText
                            primary={amenity}
                            sx={{
                              '& .MuiListItemText-primary': {
                                color: 'var(--color-text-primary)',
                                fontSize: '0.9rem'
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </>
                  )}
                </>
              ) : suggestions.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {suggestions.map((suggestion, index) => (
                    <ListItem
                      key={`${suggestion}-${index}`}
                      component="div"
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'var(--color-primary-light)'
                        },
                        borderBottom: index < suggestions.length - 1 ? '1px solid var(--color-border)' : 'none'
                      }}
                    >
                      <Search sx={{ fontSize: 20, mr: 1, color: 'var(--color-text-muted)' }} />
                      <ListItemText
                        primary={suggestion}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: 'var(--color-text-primary)',
                            fontSize: '0.95rem'
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : null}
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default SearchAutocomplete;

