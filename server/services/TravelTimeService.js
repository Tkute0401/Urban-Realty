const axios = require('axios');

class TravelTimeService {
  constructor() {
    this.cache = new Map(); // Simple in-memory cache
    this.cacheTTL = 15 * 60 * 1000; // 15 minutes
    this.mapplsApiKey = process.env.MAPPLS_API_KEY || process.env.NEXT_PUBLIC_MAPPLS_API_KEY;
  }

  /**
   * Calculate travel time between two points
   * @param {number} originLat - Origin latitude
   * @param {number} originLng - Origin longitude
   * @param {number} destLat - Destination latitude
   * @param {number} destLng - Destination longitude
   * @param {string} mode - 'driving', 'transit', 'walking'
   * @returns {Promise<Object>} Travel time and distance
   */
  async calculateTravelTime(originLat, originLng, destLat, destLng, mode = 'driving') {
    try {
      // Create cache key
      const cacheKey = `${originLat},${originLng}_${destLat},${destLng}_${mode}`;
      
      // Check cache
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.data;
      }

      // Use MAPPLS Distance Matrix API or Google Distance Matrix API
      let result;
      
      if (this.mapplsApiKey) {
        result = await this.calculateWithMappls(originLat, originLng, destLat, destLng, mode);
      } else {
        // Fallback to Google Distance Matrix API if available
        result = await this.calculateWithGoogle(originLat, originLng, destLat, destLng, mode);
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      // Clean old cache entries (keep cache size manageable)
      if (this.cache.size > 1000) {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
          if (now - value.timestamp > this.cacheTTL) {
            this.cache.delete(key);
          }
        }
      }

      return result;
    } catch (error) {
      console.error('Error calculating travel time:', error);
      // Return fallback estimate based on straight-line distance
      return this.getFallbackEstimate(originLat, originLng, destLat, destLng, mode);
    }
  }

  /**
   * Calculate using MAPPLS API
   */
  async calculateWithMappls(originLat, originLng, destLat, destLng, mode) {
    try {
      // MAPPLS Distance Matrix API endpoint
      const url = `https://apis.mappls.com/advancedmaps/api/${this.mapplsApiKey}/distance_matrix/driving/${originLng},${originLat};${destLng},${destLat}`;
      
      const response = await axios.get(url, {
        timeout: 5000
      });

      if (response.data && response.data.distances && response.data.durations) {
        const distance = response.data.distances[0][1]; // in meters
        const duration = response.data.durations[0][1]; // in seconds

        return {
          distance: distance / 1000, // Convert to km
          duration: duration / 60, // Convert to minutes
          mode,
          source: 'mappls'
        };
      }

      throw new Error('Invalid MAPPLS response');
    } catch (error) {
      console.error('MAPPLS API error:', error);
      throw error;
    }
  }

  /**
   * Calculate using Google Distance Matrix API (fallback)
   */
  async calculateWithGoogle(originLat, originLng, destLat, destLng, mode) {
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!googleApiKey) {
      throw new Error('No mapping API key available');
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;
      const params = {
        origins: `${originLat},${originLng}`,
        destinations: `${destLat},${destLng}`,
        mode: mode === 'transit' ? 'transit' : mode === 'walking' ? 'walking' : 'driving',
        key: googleApiKey,
        units: 'metric'
      };

      const response = await axios.get(url, { params, timeout: 5000 });

      if (response.data.status === 'OK' && response.data.rows[0]?.elements[0]?.status === 'OK') {
        const element = response.data.rows[0].elements[0];
        return {
          distance: element.distance.value / 1000, // Convert to km
          duration: element.duration.value / 60, // Convert to minutes
          mode,
          source: 'google'
        };
      }

      throw new Error('Invalid Google API response');
    } catch (error) {
      console.error('Google API error:', error);
      throw error;
    }
  }

  /**
   * Fallback estimate based on straight-line distance
   */
  getFallbackEstimate(originLat, originLng, destLat, destLng, mode) {
    // Calculate straight-line distance using Haversine formula
    const R = 6371; // Earth radius in km
    const dLat = this.toRad(destLat - originLat);
    const dLon = this.toRad(destLng - originLng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(originLat)) * Math.cos(this.toRad(destLat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Estimate duration based on mode
    let avgSpeed; // km/h
    switch (mode) {
      case 'walking':
        avgSpeed = 5;
        break;
      case 'transit':
        avgSpeed = 30;
        break;
      case 'driving':
      default:
        avgSpeed = 40; // Conservative estimate for city driving
        break;
    }

    const duration = (distance / avgSpeed) * 60; // Convert to minutes

    return {
      distance,
      duration,
      mode,
      source: 'estimate',
      note: 'Estimated based on straight-line distance'
    };
  }

  /**
   * Convert degrees to radians
   */
  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Batch calculate travel times for multiple destinations
   */
  async calculateBatchTravelTimes(originLat, originLng, destinations, mode = 'driving') {
    const results = await Promise.all(
      destinations.map(async (dest) => {
        try {
          const travelTime = await this.calculateTravelTime(
            originLat,
            originLng,
            dest.latitude,
            dest.longitude,
            mode
          );
          return {
            propertyId: dest.propertyId || dest._id,
            ...travelTime
          };
        } catch (error) {
          console.error(`Error calculating travel time for property ${dest.propertyId}:`, error);
          return {
            propertyId: dest.propertyId || dest._id,
            error: error.message
          };
        }
      })
    );

    return results;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

module.exports = new TravelTimeService();



