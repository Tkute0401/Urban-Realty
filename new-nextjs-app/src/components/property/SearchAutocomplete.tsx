'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TextField, List, ListItem, ListItemText, Paper, Box, CircularProgress } from '@mui/material';
import { Search } from '@mui/icons-material';

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      setSuggestions(data.suggestions || []);
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
      
      {showSuggestions && (suggestions.length > 0 || loading) && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 9999,
            mt: 0.5,
            maxHeight: '300px',
            overflow: 'auto',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
          }}
          onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking inside
        >
          {loading && suggestions.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
              <CircularProgress size={24} sx={{ color: 'var(--color-primary)' }} />
            </Box>
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
        </Paper>
      )}
    </Box>
  );
};

export default SearchAutocomplete;

