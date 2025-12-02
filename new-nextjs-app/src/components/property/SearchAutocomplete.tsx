'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TextField, List, ListItem, ListItemText, Paper, Box, CircularProgress, Typography, Divider, Chip, Skeleton } from '@mui/material';
import { Search, LocationOn, Home, TrendingUp, History, Star, Place } from '@mui/icons-material';

interface SuggestionItem {
  name: string;
  count?: number;
  city?: string;
  isPopular?: boolean;
}

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
    cities?: SuggestionItem[];
    states?: SuggestionItem[];
    types?: SuggestionItem[];
    amenities?: SuggestionItem[];
    neighborhoods?: SuggestionItem[];
    recent?: string[];
    popular?: string[];
    trending?: string[];
  }>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsListRef = useRef<HTMLDivElement>(null);

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
    // Always open the dropdown while we are actively searching
    setShowSuggestions(true);

    if (!query || query.length < 2) {
      // For short queries, clear remote suggestions but keep dropdown
      // so recent searches (when value is empty) can still show.
      setSuggestions([]);
      setCategorizedSuggestions({});
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      let response: Response | undefined;

      // 1) Try the Next.js API route first
      try {
        response = await fetch(
          `/api/properties/search-suggestions?q=${encodeURIComponent(query)}&limit=10`
        );

        // If the Next.js route exists but returns a non-OK status (e.g. 404 in production),
        // immediately fall back to the backend API.
        if (!response.ok) {
          console.warn(
            'Search suggestions Next.js route returned',
            response.status,
            '- falling back to /api/v1/properties/search-suggestions'
          );
          response = await fetch(
            `/api/v1/properties/search-suggestions?q=${encodeURIComponent(query)}&limit=10`
          );
        }
      } catch (e) {
        // 2) If calling the Next.js route itself fails (network/runtime),
        // fall back to the backend API.
        console.warn(
          'Error calling /api/properties/search-suggestions, falling back to /api/v1/properties/search-suggestions',
          e
        );
        response = await fetch(
          `/api/v1/properties/search-suggestions?q=${encodeURIComponent(query)}&limit=10`
        );
      }

      if (!response || !response.ok) {
        throw new Error(`HTTP error! status: ${response ? response.status : 'no response'}`);
      }

      const data = await response.json();

      // Handle both old format (array) and new format (categorized with counts)
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
        setCategorizedSuggestions({});
      } else if (data.cities || data.states || data.types || data.amenities) {
        // New format with counts and additional data
        setCategorizedSuggestions({
          cities: data.cities || [],
          states: data.states || [],
          types: data.types || [],
          amenities: data.amenities || [],
          neighborhoods: data.neighborhoods || [],
          popular: data.popular || [],
          trending: data.trending || []
        });
        setSuggestions([]);
      } else {
        setSuggestions(data.suggestions || []);
        setCategorizedSuggestions({});
      }

      // Keep dropdown open to show whatever suggestions we have
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      // Keep the dropdown open so the user at least sees an empty state
      // instead of it silently disappearing on errors.
      setShowSuggestions(true);
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
    // Always show dropdown on focus; its contents (recent searches,
    // loading spinner, or suggestions) are controlled separately.
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    blurTimeoutRef.current = setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  // Highlight matching text in suggestion
  const highlightText = (text: string, query: string) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  // Get all suggestions as a flat list for keyboard navigation
  const getAllSuggestions = useCallback(() => {
    const all: Array<{ text: string; type: string; count?: number }> = [];
    
    if (categorizedSuggestions.cities) {
      categorizedSuggestions.cities.forEach(city => {
        all.push({ text: city.name, type: 'city', count: city.count });
      });
    }
    if (categorizedSuggestions.states) {
      categorizedSuggestions.states.forEach(state => {
        all.push({ text: state.name, type: 'state', count: state.count });
      });
    }
    if (categorizedSuggestions.types) {
      categorizedSuggestions.types.forEach(type => {
        all.push({ text: type.name, type: 'type', count: type.count });
      });
    }
    if (categorizedSuggestions.amenities) {
      categorizedSuggestions.amenities.forEach(amenity => {
        all.push({ text: amenity.name, type: 'amenity', count: amenity.count });
      });
    }
    if (categorizedSuggestions.neighborhoods) {
      categorizedSuggestions.neighborhoods.forEach(neighborhood => {
        all.push({ text: neighborhood.name, type: 'neighborhood', count: neighborhood.count });
      });
    }
    if (categorizedSuggestions.popular) {
      categorizedSuggestions.popular.forEach(pop => {
        all.push({ text: pop, type: 'popular' });
      });
    }
    
    return all;
  }, [categorizedSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allSuggestions = getAllSuggestions();
    const recentSearches = !value ? getRecentSearches() : [];
    const totalItems = allSuggestions.length + recentSearches.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      if (selectedIndex < recentSearches.length) {
        handleSuggestionClick(recentSearches[selectedIndex]);
      } else {
        const suggestion = allSuggestions[selectedIndex - recentSearches.length];
        if (suggestion) {
          handleSuggestionClick(suggestion.text);
        }
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }}>
      <TextField
        inputRef={inputRef}
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setSelectedIndex(-1);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
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
            <Box sx={{ p: 2 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="text" width="100%" height={40} sx={{ mb: 1 }} />
              ))}
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
                      selected={selectedIndex === index}
                      sx={{
                        py: 1,
                        px: 2,
                        cursor: 'pointer',
                        backgroundColor: selectedIndex === index ? 'var(--color-primary-light)' : 'transparent',
                        '&:hover': { backgroundColor: 'var(--color-primary-light)' }
                      }}
                    >
                      <History sx={{ fontSize: 18, mr: 1.5, color: 'var(--color-text-muted)' }} />
                      <ListItemText
                        primary={highlightText(recent, value)}
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
                      {categorizedSuggestions.cities.map((city, index) => {
                        const itemIndex = getRecentSearches().length + index;
                        return (
                          <ListItem
                            key={`city-${index}`}
                            component="div"
                            onClick={() => handleSuggestionClick(city.name || city)}
                            selected={selectedIndex === itemIndex}
                            sx={{
                              py: 1,
                              px: 2,
                              cursor: 'pointer',
                              backgroundColor: selectedIndex === itemIndex ? 'var(--color-primary-light)' : 'transparent',
                              '&:hover': { backgroundColor: 'var(--color-primary-light)' }
                            }}
                          >
                            <LocationOn sx={{ fontSize: 18, mr: 1.5, color: '#4CAF50' }} />
                            <ListItemText
                              primary={highlightText(typeof city === 'string' ? city : city.name, value)}
                              secondary={typeof city === 'object' && city.count ? `${city.count} properties` : undefined}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  color: 'var(--color-text-primary)',
                                  fontSize: '0.9rem'
                                },
                                '& .MuiListItemText-secondary': {
                                  color: 'var(--color-text-muted)',
                                  fontSize: '0.75rem'
                                }
                              }}
                            />
                            {typeof city === 'object' && city.isPopular && (
                              <Chip 
                                icon={<TrendingUp sx={{ fontSize: 14 }} />}
                                label="Popular" 
                                size="small" 
                                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                          </ListItem>
                        );
                      })}
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
                      {categorizedSuggestions.states.map((state, index) => {
                        const itemIndex = getRecentSearches().length + 
                                         (categorizedSuggestions.cities?.length || 0) + index;
                        return (
                          <ListItem
                            key={`state-${index}`}
                            component="div"
                            onClick={() => handleSuggestionClick(typeof state === 'string' ? state : state.name)}
                            selected={selectedIndex === itemIndex}
                            sx={{
                              py: 1,
                              px: 2,
                              cursor: 'pointer',
                              backgroundColor: selectedIndex === itemIndex ? 'var(--color-primary-light)' : 'transparent',
                              '&:hover': { backgroundColor: 'var(--color-primary-light)' }
                            }}
                          >
                            <LocationOn sx={{ fontSize: 18, mr: 1.5, color: '#2196F3' }} />
                            <ListItemText
                              primary={highlightText(typeof state === 'string' ? state : state.name, value)}
                              secondary={typeof state === 'object' && state.count ? `${state.count} properties` : undefined}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  color: 'var(--color-text-primary)',
                                  fontSize: '0.9rem'
                                },
                                '& .MuiListItemText-secondary': {
                                  color: 'var(--color-text-muted)',
                                  fontSize: '0.75rem'
                                }
                              }}
                            />
                          </ListItem>
                        );
                      })}
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
                      {categorizedSuggestions.types.map((type, index) => {
                        const itemIndex = getRecentSearches().length + 
                                         (categorizedSuggestions.cities?.length || 0) +
                                         (categorizedSuggestions.states?.length || 0) + index;
                        return (
                          <ListItem
                            key={`type-${index}`}
                            component="div"
                            onClick={() => handleSuggestionClick(typeof type === 'string' ? type : type.name)}
                            selected={selectedIndex === itemIndex}
                            sx={{
                              py: 1,
                              px: 2,
                              cursor: 'pointer',
                              backgroundColor: selectedIndex === itemIndex ? 'var(--color-primary-light)' : 'transparent',
                              '&:hover': { backgroundColor: 'var(--color-primary-light)' }
                            }}
                          >
                            <Home sx={{ fontSize: 18, mr: 1.5, color: '#FF9800' }} />
                            <ListItemText
                              primary={highlightText(typeof type === 'string' ? type : type.name, value)}
                              secondary={typeof type === 'object' && type.count ? `${type.count} properties` : undefined}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  color: 'var(--color-text-primary)',
                                  fontSize: '0.9rem'
                                },
                                '& .MuiListItemText-secondary': {
                                  color: 'var(--color-text-muted)',
                                  fontSize: '0.75rem'
                                }
                              }}
                            />
                          </ListItem>
                        );
                      })}
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
                      {categorizedSuggestions.amenities.map((amenity, index) => {
                        const itemIndex = getRecentSearches().length + 
                                         (categorizedSuggestions.cities?.length || 0) +
                                         (categorizedSuggestions.states?.length || 0) +
                                         (categorizedSuggestions.types?.length || 0) + index;
                        return (
                          <ListItem
                            key={`amenity-${index}`}
                            component="div"
                            onClick={() => handleSuggestionClick(typeof amenity === 'string' ? amenity : amenity.name)}
                            selected={selectedIndex === itemIndex}
                            sx={{
                              py: 1,
                              px: 2,
                              cursor: 'pointer',
                              backgroundColor: selectedIndex === itemIndex ? 'var(--color-primary-light)' : 'transparent',
                              '&:hover': { backgroundColor: 'var(--color-primary-light)' }
                            }}
                          >
                            <Star sx={{ fontSize: 18, mr: 1.5, color: '#9C27B0' }} />
                            <ListItemText
                              primary={highlightText(typeof amenity === 'string' ? amenity : amenity.name, value)}
                              secondary={typeof amenity === 'object' && amenity.count ? `${amenity.count} properties` : undefined}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  color: 'var(--color-text-primary)',
                                  fontSize: '0.9rem'
                                },
                                '& .MuiListItemText-secondary': {
                                  color: 'var(--color-text-muted)',
                                  fontSize: '0.75rem'
                                }
                              }}
                            />
                          </ListItem>
                        );
                      })}
                    </>
                  )}

                  {/* Neighborhoods */}
                  {categorizedSuggestions.neighborhoods && categorizedSuggestions.neighborhoods.length > 0 && (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, mt: 1 }}>
                        <Place sx={{ fontSize: 18, mr: 1, color: '#00BCD4' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>
                          Neighborhoods
                        </Typography>
                      </Box>
                      {categorizedSuggestions.neighborhoods.map((neighborhood, index) => {
                        const itemIndex = getRecentSearches().length + 
                                         (categorizedSuggestions.cities?.length || 0) +
                                         (categorizedSuggestions.states?.length || 0) +
                                         (categorizedSuggestions.types?.length || 0) +
                                         (categorizedSuggestions.amenities?.length || 0) + index;
                        return (
                          <ListItem
                            key={`neighborhood-${index}`}
                            component="div"
                            onClick={() => handleSuggestionClick(neighborhood.name)}
                            selected={selectedIndex === itemIndex}
                            sx={{
                              py: 1,
                              px: 2,
                              cursor: 'pointer',
                              backgroundColor: selectedIndex === itemIndex ? 'var(--color-primary-light)' : 'transparent',
                              '&:hover': { backgroundColor: 'var(--color-primary-light)' }
                            }}
                          >
                            <Place sx={{ fontSize: 18, mr: 1.5, color: '#00BCD4' }} />
                            <ListItemText
                              primary={highlightText(neighborhood.name, value)}
                              secondary={neighborhood.city ? `${neighborhood.city} • ${neighborhood.count || 0} properties` : `${neighborhood.count || 0} properties`}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  color: 'var(--color-text-primary)',
                                  fontSize: '0.9rem'
                                },
                                '& .MuiListItemText-secondary': {
                                  color: 'var(--color-text-muted)',
                                  fontSize: '0.75rem'
                                }
                              }}
                            />
                          </ListItem>
                        );
                      })}
                    </>
                  )}

                  {/* Popular Searches */}
                  {categorizedSuggestions.popular && categorizedSuggestions.popular.length > 0 && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
                        <TrendingUp sx={{ fontSize: 18, mr: 1, color: '#FF5722' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>
                          Popular Searches
                        </Typography>
                      </Box>
                      {categorizedSuggestions.popular.map((popular, index) => {
                        const itemIndex = getRecentSearches().length + 
                                         (categorizedSuggestions.cities?.length || 0) +
                                         (categorizedSuggestions.states?.length || 0) +
                                         (categorizedSuggestions.types?.length || 0) +
                                         (categorizedSuggestions.amenities?.length || 0) +
                                         (categorizedSuggestions.neighborhoods?.length || 0) + index;
                        return (
                          <ListItem
                            key={`popular-${index}`}
                            component="div"
                            onClick={() => handleSuggestionClick(popular)}
                            selected={selectedIndex === itemIndex}
                            sx={{
                              py: 1,
                              px: 2,
                              cursor: 'pointer',
                              backgroundColor: selectedIndex === itemIndex ? 'var(--color-primary-light)' : 'transparent',
                              '&:hover': { backgroundColor: 'var(--color-primary-light)' }
                            }}
                          >
                            <TrendingUp sx={{ fontSize: 18, mr: 1.5, color: '#FF5722' }} />
                            <ListItemText
                              primary={highlightText(popular, value)}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  color: 'var(--color-text-primary)',
                                  fontSize: '0.9rem'
                                }
                              }}
                            />
                            <Chip 
                              label="Popular" 
                              size="small" 
                              sx={{ ml: 1, height: 20, fontSize: '0.7rem', bgcolor: '#FF5722', color: 'white' }}
                            />
                          </ListItem>
                        );
                      })}
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

