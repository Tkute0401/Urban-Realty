// useGeolocation Hook - For Phase 4 Maps & Location Services

import { useState, useEffect, useCallback, useRef } from 'react';
import geolocationService from '../lib/services/geolocationService';

export const useGeolocation = (options = {}) => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState('unknown');
  const unwatchRef = useRef(null);

  // Get current position
  const getCurrentPosition = useCallback(async (customOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const currentPosition = await geolocationService.getCurrentPosition({
        ...options,
        ...customOptions,
      });
      setPosition(currentPosition);
      return currentPosition;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  // Watch position
  const watchPosition = useCallback((callback) => {
    const unwatch = geolocationService.watchPosition(
      (newPosition) => {
        setPosition(newPosition);
        if (callback) {
          callback(newPosition);
        }
      },
      options
    );

    unwatchRef.current = unwatch;
    return unwatch;
  }, [options]);

  // Stop watching
  const stopWatching = useCallback(() => {
    if (unwatchRef.current) {
      unwatchRef.current();
      unwatchRef.current = null;
    }
  }, []);

  // Check permission
  const checkPermission = useCallback(async () => {
    try {
      const permissionState = await geolocationService.requestPermission();
      setPermission(permissionState);
      return permissionState;
    } catch (err) {
      console.error('Error checking permission:', err);
      setPermission('unknown');
      return 'unknown';
    }
  }, []);

  // Calculate distance to a point
  const calculateDistance = useCallback((lat, lng) => {
    if (!position) return null;
    return geolocationService.calculateDistance(
      position.latitude,
      position.longitude,
      lat,
      lng
    );
  }, [position]);

  // Check if a point is within radius
  const isWithinRadius = useCallback((lat, lng, radiusMeters) => {
    if (!position) return false;
    return geolocationService.isWithinRadius(
      position.latitude,
      position.longitude,
      lat,
      lng,
      radiusMeters
    );
  }, [position]);

  // Format current position
  const formatPosition = useCallback((precision = 4) => {
    if (!position) return null;
    return geolocationService.formatCoordinates(
      position.latitude,
      position.longitude,
      precision
    );
  }, [position]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    position,
    error,
    loading,
    permission,
    getCurrentPosition,
    watchPosition,
    stopWatching,
    checkPermission,
    calculateDistance,
    isWithinRadius,
    formatPosition,
  };
};

// Hook for watching position continuously
export const useWatchPosition = (options = {}) => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [watching, setWatching] = useState(false);
  const unwatchRef = useRef(null);

  const startWatching = useCallback(() => {
    if (watching) return;

    setWatching(true);
    setError(null);

    const unwatch = geolocationService.watchPosition(
      (newPosition) => {
        setPosition(newPosition);
      },
      options
    );

    unwatchRef.current = unwatch;
  }, [options, watching]);

  const stopWatching = useCallback(() => {
    if (unwatchRef.current) {
      unwatchRef.current();
      unwatchRef.current = null;
    }
    setWatching(false);
  }, []);

  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  return {
    position,
    error,
    watching,
    startWatching,
    stopWatching,
  };
};

// Hook for location-based features
export const useLocationFeatures = () => {
  const { position, getCurrentPosition, calculateDistance, isWithinRadius } = useGeolocation();

  // Find nearby properties
  const findNearbyProperties = useCallback((properties, radiusMeters = 5000) => {
    if (!position) return [];

    return properties.filter(property => {
      if (!property.location?.coordinates) return false;
      
      const { lat, lng } = property.location.coordinates;
      return isWithinRadius(lat, lng, radiusMeters);
    });
  }, [position, isWithinRadius]);

  // Sort properties by distance
  const sortPropertiesByDistance = useCallback((properties) => {
    if (!position) return properties;

    return [...properties].sort((a, b) => {
      if (!a.location?.coordinates || !b.location?.coordinates) return 0;
      
      const distanceA = calculateDistance(
        a.location.coordinates.lat,
        a.location.coordinates.lng
      );
      const distanceB = calculateDistance(
        b.location.coordinates.lat,
        b.location.coordinates.lng
      );
      
      return distanceA - distanceB;
    });
  }, [position, calculateDistance]);

  // Get distance to property
  const getDistanceToProperty = useCallback((property) => {
    if (!position || !property.location?.coordinates) return null;
    
    const { lat, lng } = property.location.coordinates;
    return calculateDistance(lat, lng);
  }, [position, calculateDistance]);

  return {
    position,
    getCurrentPosition,
    findNearbyProperties,
    sortPropertiesByDistance,
    getDistanceToProperty,
  };
};

export default useGeolocation;