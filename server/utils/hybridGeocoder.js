// utils/hybridGeocoder.js
const NodeGeocoder = require('node-geocoder');
const mapplsGeocoder = require('./mapplsGeocoder');

// OpenStreetMap configuration as fallback
const osmOptions = {
  provider: 'openstreetmap',
  httpAdapter: 'https',
  formatter: null,
  timeout: 30000,
  maxRetries: 3,
  language: 'en',
};

const osmGeocoder = NodeGeocoder(osmOptions);

class HybridGeocoder {
  constructor() {
    this.useMappls = !!process.env.MAPPLS_API_KEY || !!process.env.NEXT_PUBLIC_MAPPLS_API_KEY;
    console.log('🗺️ Hybrid Geocoder initialized:', {
      useMappls: this.useMappls,
      fallbackToOSM: !this.useMappls
    });
  }

  /**
   * Geocode an address string to get coordinates and formatted address
   * @param {string} address - The address string to geocode
   * @returns {Promise<Array>} Array of geocoded results
   */
  async geocode(address) {
    // Try Mappls first if API key is available
    if (this.useMappls) {
      try {
        console.log('🗺️ Attempting Mappls geocoding for:', address);
        const result = await mapplsGeocoder.geocode(address);
        if (result && result.length > 0) {
          console.log('✅ Mappls geocoding successful');
          return result;
        }
      } catch (error) {
        console.warn('⚠️ Mappls geocoding failed, falling back to OpenStreetMap:', error.message);
      }
    }

    // Fallback to OpenStreetMap
    try {
      console.log('🗺️ Using OpenStreetMap geocoding for:', address);
      const result = await osmGeocoder.geocode(address);
      console.log('✅ OpenStreetMap geocoding successful');
      return result;
    } catch (error) {
      console.error('❌ Both Mappls and OpenStreetMap geocoding failed:', error.message);
      throw error;
    }
  }

  /**
   * Reverse geocode coordinates to get address
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @returns {Promise<Array>} Array of reverse geocoded results
   */
  async reverse(latitude, longitude) {
    // Try Mappls first if API key is available
    if (this.useMappls) {
      try {
        console.log('🗺️ Attempting Mappls reverse geocoding for:', { latitude, longitude });
        const result = await mapplsGeocoder.reverse(latitude, longitude);
        if (result && result.length > 0) {
          console.log('✅ Mappls reverse geocoding successful');
          return result;
        }
      } catch (error) {
        console.warn('⚠️ Mappls reverse geocoding failed, falling back to OpenStreetMap:', error.message);
      }
    }

    // Fallback to OpenStreetMap
    try {
      console.log('🗺️ Using OpenStreetMap reverse geocoding for:', { latitude, longitude });
      const result = await osmGeocoder.reverse({ lat: latitude, lon: longitude });
      console.log('✅ OpenStreetMap reverse geocoding successful');
      return result;
    } catch (error) {
      console.error('❌ Both Mappls and OpenStreetMap reverse geocoding failed:', error.message);
      throw error;
    }
  }
}

// Create singleton instance
const hybridGeocoder = new HybridGeocoder();

module.exports = hybridGeocoder;
