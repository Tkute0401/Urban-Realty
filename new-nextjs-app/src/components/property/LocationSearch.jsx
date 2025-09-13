import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  MyLocation as MyLocationIcon,
  Clear as ClearIcon,
  Place as PlaceIcon,
} from '@mui/icons-material';
import { mockLocationServicesAPI } from '../../lib/mock-data/location-services';
import { useGeolocation } from '../../hooks/useGeolocation';

// Mock popular cities for autocomplete
const popularCities = [
  { name: 'New York, NY', coordinates: { lat: 40.7128, lng: -74.0060 } },
  { name: 'Los Angeles, CA', coordinates: { lat: 34.0522, lng: -118.2437 } },
  { name: 'Chicago, IL', coordinates: { lat: 41.8781, lng: -87.6298 } },
  { name: 'Boston, MA', coordinates: { lat: 42.3601, lng: -71.0589 } },
  { name: 'Miami, FL', coordinates: { lat: 25.7617, lng: -80.1918 } },
  { name: 'San Francisco, CA', coordinates: { lat: 37.7749, lng: -122.4194 } },
  { name: 'Seattle, WA', coordinates: { lat: 47.6062, lng: -122.3321 } },
  { name: 'Austin, TX', coordinates: { lat: 30.2672, lng: -97.7431 } },
  { name: 'Denver, CO', coordinates: { lat: 39.7392, lng: -104.9903 } },
  { name: 'Portland, OR', coordinates: { lat: 45.5152, lng: -122.6784 } },
];

const LocationSearch = ({ onLocationSelect, onRadiusChange, initialLocation = null, initialRadius = 5000 }) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [radius, setRadius] = useState(initialRadius);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const mapRef = useRef(null);
  
  // Use geolocation hook
  const { 
    position: currentPosition, 
    getCurrentPosition, 
    loading: geoLoading, 
    error: geoError,
    permission 
  } = useGeolocation();

  useEffect(() => {
    if (selectedLocation) {
      loadLocationInfo();
    }
  }, [selectedLocation]);

  const loadLocationInfo = async () => {
    if (!selectedLocation) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await mockLocationServicesAPI.getLocationInfo(selectedLocation);
      if (response.success) {
        setLocationInfo(response.locationInfo);
      }
    } catch (err) {
      setError('Failed to load location information');
      console.error('Error loading location info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchValue(location.name);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
    if (onRadiusChange) {
      onRadiusChange(newRadius);
    }
  };

  const handleGetCurrentLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      const coordinates = {
        lat: position.latitude,
        lng: position.longitude,
      };
      
      // Find closest city or create custom location
      const closestCity = findClosestCity(coordinates);
      const location = closestCity || {
        name: `Custom Location (${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)})`,
        coordinates,
      };
      
      handleLocationSelect(location);
    } catch (err) {
      setError(err.message || 'Unable to get your current location');
      console.error('Geolocation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const findClosestCity = (coordinates) => {
    let closestCity = null;
    let minDistance = Infinity;

    popularCities.forEach(city => {
      const distance = Math.sqrt(
        Math.pow(city.coordinates.lat - coordinates.lat, 2) +
        Math.pow(city.coordinates.lng - coordinates.lng, 2)
      );
      
      if (distance < minDistance && distance < 0.1) { // Within ~11km
        minDistance = distance;
        closestCity = city;
      }
    });

    return closestCity;
  };

  const handleClearLocation = () => {
    setSelectedLocation(null);
    setSearchValue('');
    setLocationInfo(null);
    setError(null);
    if (onLocationSelect) {
      onLocationSelect(null);
    }
  };

  const radiusOptions = [
    { value: 1000, label: '1 km' },
    { value: 2000, label: '2 km' },
    { value: 5000, label: '5 km' },
    { value: 10000, label: '10 km' },
    { value: 25000, label: '25 km' },
  ];

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Search by Location
        </Typography>

        {/* Location Search */}
        <Box mb={2}>
          <Autocomplete
            value={selectedLocation}
            onChange={(event, newValue) => {
              if (newValue) {
                handleLocationSelect(newValue);
              }
            }}
            inputValue={searchValue}
            onInputChange={(event, newInputValue) => {
              setSearchValue(newInputValue);
            }}
            options={popularCities}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search location"
                placeholder="Enter city, state, or address"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PlaceIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {loading && <CircularProgress size={20} />}
                      {selectedLocation && (
                        <IconButton onClick={handleClearLocation} size="small">
                          <ClearIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <PlaceIcon sx={{ mr: 1, color: 'text.secondary' }} />
                {option.name}
              </Box>
            )}
          />
        </Box>

        {/* Current Location Button */}
        <Box mb={2}>
          <Button
            variant="outlined"
            startIcon={<MyLocationIcon />}
            onClick={handleGetCurrentLocation}
            disabled={loading || geoLoading}
            fullWidth
            sx={{
              borderColor: 'var(--color-primary-blue)',
              color: 'var(--color-primary-blue)',
              '&:hover': {
                borderColor: 'var(--color-primary-orange)',
                color: 'var(--color-primary-orange)',
              },
            }}
          >
            {loading || geoLoading ? 'Getting Location...' : 'Use Current Location'}
          </Button>
          {permission === 'denied' && (
            <Typography variant="caption" color="error" display="block" mt={1}>
              Location access denied. Please enable location permissions in your browser.
            </Typography>
          )}
        </Box>

        {/* Error Display */}
        {error && (
          <Box mb={2}>
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Box>
        )}

        {/* Selected Location Info */}
        {selectedLocation && (
          <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Location
            </Typography>
            <Card variant="outlined">
              <CardContent sx={{ p: 2 }}>
                <Typography variant="body1" gutterBottom>
                  {selectedLocation.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Coordinates: {selectedLocation.coordinates.lat.toFixed(4)}, {selectedLocation.coordinates.lng.toFixed(4)}
                </Typography>
                
                {locationInfo && (
                  <Box mt={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Typography variant="h6" color="var(--color-primary-blue)">
                            {locationInfo.walkScore}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Walk Score
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Typography variant="h6" color="var(--color-primary-orange)">
                            {locationInfo.transitScore}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Transit Score
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Typography variant="h6" color="var(--color-success)">
                            {locationInfo.bikeScore}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Bike Score
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Radius Selection */}
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Search Radius
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {radiusOptions.map(option => (
              <Chip
                key={option.value}
                label={option.label}
                onClick={() => handleRadiusChange(option.value)}
                color={radius === option.value ? 'primary' : 'default'}
                variant={radius === option.value ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </Box>

        {/* Search Button */}
        {selectedLocation && (
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={() => {
              if (onLocationSelect) {
                onLocationSelect(selectedLocation);
              }
            }}
            fullWidth
            sx={{
              backgroundColor: 'var(--color-primary-orange)',
              '&:hover': {
                backgroundColor: 'var(--color-primary-orange)',
                opacity: 0.9,
              },
            }}
          >
            Search Properties in {selectedLocation.name}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationSearch;