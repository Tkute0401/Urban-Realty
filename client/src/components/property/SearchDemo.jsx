import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Divider,
  Chip,
  Button
} from '@mui/material';
import { 
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import EnhancedSearch from './EnhancedSearch';
import MobileEnhancedSearch from './MobileEnhancedSearch';
import searchAnalytics from './SearchAnalytics';

const SearchDemo = () => {
  const [desktopSearch, setDesktopSearch] = useState('');
  const [mobileSearch, setMobileSearch] = useState('');
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const handleDesktopSearch = (value) => {
    setDesktopSearch(value);
    setSearchHistory(prev => [value, ...prev.slice(0, 9)]);
  };

  const handleMobileSearch = (value) => {
    setMobileSearch(value);
    setSearchHistory(prev => [value, ...prev.slice(0, 9)]);
  };

  const demoFeatures = [
    {
      icon: <SearchIcon color="primary" />,
      title: 'Smart Autocomplete',
      description: 'Real-time suggestions for cities, states, property types, and amenities'
    },
    {
      icon: <LocationIcon color="primary" />,
      title: 'Location Intelligence',
      description: 'Smart location suggestions based on your property database'
    },
    {
      icon: <HomeIcon color="primary" />,
      title: 'Property Type Suggestions',
      description: 'Quick access to House, Apartment, Villa, and more'
    },
    {
      icon: <StarIcon color="primary" />,
      title: 'Amenity Search',
      description: 'Find properties by features like Parking, Gym, Swimming Pool'
    },
    {
      icon: <HistoryIcon color="primary" />,
      title: 'Recent Searches',
      description: 'Remember your last 10 searches for quick access'
    },
    {
      icon: <TrendingIcon color="primary" />,
      title: 'Popular Searches',
      description: 'Discover trending locations and property types'
    }
  ];

  const demoStats = searchAnalytics.getSearchStats();

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ color: '#78CADC', mb: 4 }}>
        Enhanced Search Demo
      </Typography>

      <Typography variant="h6" gutterBottom align="center" sx={{ color: 'text.secondary', mb: 6 }}>
        Experience the next generation of property search with intelligent suggestions, 
        real-time autocomplete, and personalized recommendations.
      </Typography>

      {/* Desktop Search Demo */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, backgroundColor: '#0B1011', color: 'white' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#78CADC', mb: 3 }}>
          Desktop Search Experience
        </Typography>
        <EnhancedSearch
          value={desktopSearch}
          onChange={setDesktopSearch}
          onSubmit={handleDesktopSearch}
          placeholder="Try searching for: Mumbai, House, Parking, or any location..."
          variant="outlined"
          size="large"
          fullWidth={true}
          showSuggestions={true}
        />
        {desktopSearch && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(120, 202, 220, 0.1)', borderRadius: 1 }}>
            <Typography variant="body2" color="#78CADC">
              You searched for: <strong>{desktopSearch}</strong>
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Mobile Search Demo */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, backgroundColor: '#0B1011', color: 'white' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#78CADC', mb: 3 }}>
          Mobile Search Experience
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: 300, position: 'relative' }}>
            <MobileEnhancedSearch
              value={mobileSearch}
              onChange={setMobileSearch}
              onSubmit={handleMobileSearch}
              expanded={mobileExpanded}
              onToggle={setMobileExpanded}
              placeholder="Tap to search..."
            />
          </Box>
        </Box>
        {mobileSearch && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(120, 202, 220, 0.1)', borderRadius: 1 }}>
            <Typography variant="body2" color="#78CADC">
              You searched for: <strong>{mobileSearch}</strong>
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Features Grid */}
      <Typography variant="h5" gutterBottom sx={{ color: '#78CADC', mb: 3 }}>
        Key Features
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {demoFeatures.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ 
              backgroundColor: '#0B1011', 
              color: 'white',
              border: '1px solid #1E2D2F',
              '&:hover': {
                borderColor: '#78CADC',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ color: '#78CADC' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search Analytics */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, backgroundColor: '#0B1011', color: 'white' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#78CADC', mb: 3 }}>
          Search Analytics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ color: '#78CADC' }}>
                {demoStats.totalSearches}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Searches
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ color: '#78CADC' }}>
                {demoStats.uniqueSearches}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unique Terms
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ color: '#78CADC' }}>
                {demoStats.mostPopular || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Most Popular
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <Paper elevation={3} sx={{ p: 4, mb: 4, backgroundColor: '#0B1011', color: 'white' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#78CADC', mb: 3 }}>
            Recent Demo Searches
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {searchHistory.map((search, index) => (
              <Chip
                key={index}
                label={search}
                variant="outlined"
                sx={{ 
                  color: 'white', 
                  borderColor: '#78CADC',
                  '&:hover': { 
                    borderColor: '#78CADC', 
                    backgroundColor: 'rgba(120, 202, 220, 0.1)' 
                  }
                }}
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* API Information */}
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#0B1011', color: 'white' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#78CADC', mb: 3 }}>
          API Integration
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          The enhanced search uses a dedicated API endpoint that provides real-time suggestions:
        </Typography>
        <Box sx={{ 
          p: 2, 
          backgroundColor: 'rgba(120, 202, 220, 0.1)', 
          borderRadius: 1,
          fontFamily: 'monospace',
          fontSize: '0.9rem'
        }}>
          GET /properties/search-suggestions?query={'{searchTerm}'}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          This endpoint returns categorized suggestions including cities, states, property types, and amenities,
          enabling intelligent search experiences across the platform.
        </Typography>
      </Paper>

      {/* Demo Actions */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => {
            searchAnalytics.clearAnalytics();
            setSearchHistory([]);
            setDesktopSearch('');
            setMobileSearch('');
          }}
          sx={{ 
            color: '#78CADC', 
            borderColor: '#78CADC',
            '&:hover': { 
              borderColor: '#78CADC', 
              backgroundColor: 'rgba(120, 202, 220, 0.1)' 
            }
          }}
        >
          Reset Demo Data
        </Button>
      </Box>
    </Box>
  );
};

export default SearchDemo;