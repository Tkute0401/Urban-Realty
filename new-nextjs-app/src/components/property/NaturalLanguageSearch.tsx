'use client';

import React, { useState, useEffect } from 'react';
import { Box, TextField, Paper, Typography, Chip, Stack, Alert } from '@mui/material';
import { Search, CheckCircle } from '@mui/icons-material';

interface NaturalLanguageSearchProps {
  onSearch: (filters: ParsedFilters) => void;
  placeholder?: string;
}

interface ParsedFilters {
  search?: string;
  bedrooms?: number;
  propertyType?: string;
  priceMin?: number;
  priceMax?: number;
  city?: string;
  state?: string;
}

/**
 * Natural Language Search Component
 * Parses queries like "2BHK apartment under 50L in Mumbai" and extracts filters
 */
const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({
  onSearch,
  placeholder = 'Try: "2BHK apartment under 50L in Mumbai"'
}) => {
  const [query, setQuery] = useState('');
  const [parsedFilters, setParsedFilters] = useState<ParsedFilters | null>(null);
  const [showParsedInfo, setShowParsedInfo] = useState(false);

  // Parse natural language query
  const parseQuery = (searchQuery: string): ParsedFilters => {
    if (!searchQuery || searchQuery.length < 2) {
      return {};
    }

    const queryLower = searchQuery.toLowerCase().trim();
    const filters: ParsedFilters = {};

    // Extract bedrooms (2BHK, 2 BHK, 2 bedroom, 2BR, etc.)
    const bedroomPatterns = [
      /(\d+)\s*bhk/i,
      /(\d+)\s*bedroom/i,
      /(\d+)\s*bed/i,
      /(\d+)\s*br\b/i
    ];

    for (const pattern of bedroomPatterns) {
      const match = queryLower.match(pattern);
      if (match) {
        filters.bedrooms = parseInt(match[1]);
        break;
      }
    }

    // Extract property type
    const propertyTypes: { [key: string]: string } = {
      'apartment': 'Apartment',
      'flat': 'Apartment',
      'house': 'House',
      'villa': 'Villa',
      'condo': 'Condo',
      'townhouse': 'Townhouse',
      'studio': 'Studio',
      'penthouse': 'Penthouse',
      'builder floor': 'Builder Floor',
      'farm house': 'Farm House',
      'service apartment': 'Service Apartment',
      'pg': 'PG',
      'commercial': 'Commercial',
      'land': 'Land'
    };

    for (const [keyword, type] of Object.entries(propertyTypes)) {
      if (queryLower.includes(keyword)) {
        filters.propertyType = type;
        break;
      }
    }

    // Extract price (50L, 50 lakhs, under 50L, etc.)
    const pricePatterns = [
      /(?:under|below|max|upto|less than|maximum)\s*(\d+(?:\.\d+)?)\s*(?:l|lak|lakh|lakhs)/i,
      /(\d+(?:\.\d+)?)\s*(?:l|lak|lakh|lakhs)\s*(?:under|below|max|upto|less than|maximum)/i,
      /(?:above|over|min|minimum|more than|at least)\s*(\d+(?:\.\d+)?)\s*(?:l|lak|lakh|lakhs)/i,
      /(\d+(?:\.\d+)?)\s*(?:l|lak|lakh|lakhs)/i
    ];

    for (const pattern of pricePatterns) {
      const match = queryLower.match(pattern);
      if (match) {
        const amount = parseFloat(match[1]) * 100000; // Convert lakhs to actual amount
        
        if (pattern.source.includes('under') || pattern.source.includes('below') || 
            pattern.source.includes('max') || pattern.source.includes('upto') ||
            pattern.source.includes('less than') || pattern.source.includes('maximum')) {
          filters.priceMax = amount;
        } else if (pattern.source.includes('above') || pattern.source.includes('over') ||
                   pattern.source.includes('min') || pattern.source.includes('minimum') ||
                   pattern.source.includes('more than') || pattern.source.includes('at least')) {
          filters.priceMin = amount;
        } else {
          filters.priceMax = amount;
        }
        break;
      }
    }

    // Extract price range (50L to 100L, between 50L and 100L, etc.)
    const rangePattern = /(\d+(?:\.\d+)?)\s*(?:l|lak|lakh|lakhs)\s*(?:to|and|-|between)\s*(\d+(?:\.\d+)?)\s*(?:l|lak|lakh|lakhs)/i;
    const rangeMatch = queryLower.match(rangePattern);
    if (rangeMatch) {
      filters.priceMin = parseFloat(rangeMatch[1]) * 100000;
      filters.priceMax = parseFloat(rangeMatch[2]) * 100000;
    }

    // Extract location (city names)
    const cities = [
      'mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'pune', 'kolkata',
      'gurgaon', 'noida', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur',
      'indore', 'thane', 'bhopal', 'visakhapatnam', 'patna', 'vadodara',
      'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut',
      'bandra', 'andheri', 'powai', 'kurla', 'borivali', 'kandivali'
    ];

    for (const city of cities) {
      if (queryLower.includes(city)) {
        filters.city = city.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        break;
      }
    }

    // Store original search query
    filters.search = searchQuery;

    return filters;
  };

  useEffect(() => {
    if (query.length >= 2) {
      const parsed = parseQuery(query);
      setParsedFilters(parsed);
      setShowParsedInfo(Object.keys(parsed).length > 1); // Show if more than just search query
    } else {
      setParsedFilters(null);
      setShowParsedInfo(false);
    }
  }, [query]);

  const handleSearch = () => {
    if (parsedFilters && Object.keys(parsedFilters).length > 0) {
      onSearch(parsedFilters);
    } else if (query.trim()) {
      onSearch({ search: query.trim() });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `${(price / 100000).toFixed(1)} L`;
    }
    return `${price.toLocaleString()}`;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'var(--color-primary)' }} />,
          endAdornment: query.length >= 2 && (
            <Box
              component="button"
              onClick={handleSearch}
              sx={{
                border: 'none',
                background: 'var(--color-primary)',
                color: 'white',
                borderRadius: '8px',
                px: 2,
                py: 1,
                cursor: 'pointer',
                fontWeight: 600,
                '&:hover': {
                  background: 'var(--color-primary-dark)'
                }
              }}
            >
              Search
            </Box>
          )
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            background: 'var(--color-surface)',
            borderRadius: '12px'
          }
        }}
      />

      {showParsedInfo && parsedFilters && (
        <Paper
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CheckCircle sx={{ fontSize: 18, mr: 1, color: '#4CAF50' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Parsed Search Criteria
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            {parsedFilters.bedrooms && (
              <Chip
                label={`${parsedFilters.bedrooms} Bedroom${parsedFilters.bedrooms > 1 ? 's' : ''}`}
                size="small"
                color="primary"
              />
            )}
            {parsedFilters.propertyType && (
              <Chip
                label={parsedFilters.propertyType}
                size="small"
                color="primary"
              />
            )}
            {parsedFilters.priceMin && (
              <Chip
                label={`Min: ${formatPrice(parsedFilters.priceMin)}`}
                size="small"
                color="primary"
              />
            )}
            {parsedFilters.priceMax && (
              <Chip
                label={`Max: ${formatPrice(parsedFilters.priceMax)}`}
                size="small"
                color="primary"
              />
            )}
            {parsedFilters.city && (
              <Chip
                label={parsedFilters.city}
                size="small"
                color="primary"
              />
            )}
          </Stack>
          <Alert severity="info" sx={{ mt: 2, fontSize: '0.875rem' }}>
            Click "Search" to apply these filters, or edit your query to change them.
          </Alert>
        </Paper>
      )}
    </Box>
  );
};

export default NaturalLanguageSearch;

