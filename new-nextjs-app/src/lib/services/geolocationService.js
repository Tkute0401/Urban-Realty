// Geolocation Service - For Phase 4 Maps & Location Services

class GeolocationService {
  constructor() {
    this.watchId = null;
    this.currentPosition = null;
    this.callbacks = new Set();
  }

  // Get current position
  getCurrentPosition(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    };

    const finalOptions = { ...defaultOptions, ...options };

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          resolve(this.currentPosition);
        },
        (error) => {
          const errorMessage = this.getErrorMessage(error);
          reject(new Error(errorMessage));
        },
        finalOptions
      );
    });
  }

  // Watch position changes
  watchPosition(callback, options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
    };

    const finalOptions = { ...defaultOptions, ...options };

    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser');
    }

    this.callbacks.add(callback);

    if (this.watchId === null) {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          this.currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };

          // Notify all callbacks
          this.callbacks.forEach(cb => {
            try {
              cb(this.currentPosition);
            } catch (error) {
              console.error('Error in geolocation callback:', error);
            }
          });
        },
        (error) => {
          const errorMessage = this.getErrorMessage(error);
          console.error('Geolocation watch error:', errorMessage);
        },
        finalOptions
      );
    }

    return () => this.unwatchPosition(callback);
  }

  // Stop watching position
  unwatchPosition(callback) {
    this.callbacks.delete(callback);

    if (this.callbacks.size === 0 && this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Get error message
  getErrorMessage(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied by user';
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable';
      case error.TIMEOUT:
        return 'Location request timed out';
      default:
        return 'An unknown error occurred while retrieving location';
    }
  }

  // Calculate distance between two coordinates (in meters)
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  // Check if location is within radius
  isWithinRadius(lat1, lng1, lat2, lng2, radiusMeters) {
    const distance = this.calculateDistance(lat1, lng1, lat2, lng2);
    return distance <= radiusMeters;
  }

  // Get current position if available
  getCurrentPositionSync() {
    return this.currentPosition;
  }

  // Request location permission
  async requestPermission() {
    if (!navigator.permissions) {
      // Fallback for browsers that don't support permissions API
      try {
        await this.getCurrentPosition({ timeout: 1000 });
        return 'granted';
      } catch (error) {
        return 'denied';
      }
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state;
    } catch (error) {
      console.error('Error checking geolocation permission:', error);
      return 'unknown';
    }
  }

  // Format coordinates for display
  formatCoordinates(latitude, longitude, precision = 4) {
    return {
      lat: latitude.toFixed(precision),
      lng: longitude.toFixed(precision),
      formatted: `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`
    };
  }

  // Get address from coordinates (reverse geocoding)
  async reverseGeocode(latitude, longitude) {
    // This would typically use a geocoding service like MapTiles Geocoding API
    // For now, return mock data
    return {
      address: 'Mock Address',
      city: 'Mock City',
      state: 'Mock State',
      country: 'Mock Country',
      formatted: 'Mock Address, Mock City, Mock State, Mock Country'
    };
  }

  // Get coordinates from address (geocoding)
  async geocode(address) {
    // This would typically use a geocoding service like MapTiles Geocoding API
    // For now, return mock data
    return {
      latitude: 40.7128,
      longitude: -74.0060,
      formatted: 'New York, NY, USA'
    };
  }

  // Get location info for a selected location
  async getLocationInfo(location) {
    try {
      // This would typically use a geocoding service
      // For now, return mock data
      return {
        success: true,
        locationInfo: {
          name: location || 'Selected Location',
          address: 'Mock Address',
          city: 'Mock City',
          state: 'Mock State',
          country: 'Mock Country',
          coordinates: {
            latitude: 40.7128,
            longitude: -74.0060
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getNearbyAmenities(coordinates, radius = 5000) {
    try {
      // This would typically use a places API
      // For now, return mock data
      return {
        success: true,
        amenities: [
          { name: 'Hospital', type: 'healthcare', distance: 0.5 },
          { name: 'School', type: 'education', distance: 0.8 },
          { name: 'Shopping Mall', type: 'shopping', distance: 1.2 },
          { name: 'Restaurant', type: 'food', distance: 0.3 },
          { name: 'Bank', type: 'finance', distance: 0.6 },
          { name: 'Gym', type: 'fitness', distance: 0.9 }
        ]
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Create singleton instance
const geolocationService = new GeolocationService();

export default geolocationService;