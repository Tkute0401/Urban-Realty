'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TextField, List, ListItem, ListItemText, Paper, Box } from '@mui/material';
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

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/properties/search-suggestions?q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
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

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.length >= 2 && setShowSuggestions(true)}
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
            ...sx?.['& .MuiOutlinedInput-root']
          }
        }}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'var(--color-primary)' }} />
        }}
      />
      
      {showSuggestions && suggestions.length > 0 && (
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
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
          }}
        >
          <List sx={{ p: 0 }}>
            {suggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                component="div"
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{
                  py: 1.5,
                  px: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-light)'
                  }
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
        </Paper>
      )}
    </Box>
  );
};

export default SearchAutocomplete;

