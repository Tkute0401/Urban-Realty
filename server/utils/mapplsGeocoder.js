// utils/mapplsGeocoder.js
const axios = require('axios');

class MapplsGeocoder {
  constructor() {
    this.apiKey = process.env.MAPPLS_API_KEY || process.env.NEXT_PUBLIC_MAPPLS_API_KEY;
    this.baseURL = 'https://apis.mappls.com/advancedmaps/v1';
    
    if (!this.apiKey) {
      console.warn('⚠️ MAPPLS_API_KEY not found in environment variables. Geocoding will fallback to OpenStreetMap.');
    }
  }

  /**
   * Geocode an address string to get coordinates and formatted address
   * @param {string} address - The address string to geocode
   * @returns {Promise<Array>} Array of geocoded results
   */
  async geocode(address) {
    if (!this.apiKey) {
      throw new Error('Mappls API key not configured');
    }

    try {
      console.log('🗺️ Mappls Geocoding:', address);
      
      const response = await axios.get(`${this.baseURL}/${this.apiKey}/places/geocode`, {
        params: {
          address: address,
          itemCount: 1 // Only return the first result
        },
        timeout: 10000
      });

      if (response.data && response.data.suggestedLocations && response.data.suggestedLocations.length > 0) {
        const location = response.data.suggestedLocations[0];
        
        // Transform Mappls response to match node-geocoder format
        const result = {
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
          formattedAddress: location.placeName || address,
          streetName: location.streetName || '',
          city: location.city || '',
          stateCode: location.state || '',
          zipcode: location.pincode || '',
          countryCode: location.country || 'IN',
          placeName: location.placeName,
          houseNumber: location.houseNumber || '',
          houseName: location.houseName || '',
          poi: location.poi || '',
          subSubLocality: location.subSubLocality || '',
          subLocality: location.subLocality || '',
          locality: location.locality || '',
          village: location.village || '',
          district: location.district || '',
          subDistrict: location.subDistrict || '',
          state: location.state || '',
          country: location.country || 'India'
        };

        console.log('✅ Mappls Geocoding successful:', {
          address: address,
          coordinates: [result.longitude, result.latitude],
          formattedAddress: result.formattedAddress
        });

        return [result];
      } else {
        console.warn('⚠️ No results found for address:', address);
        return [];
      }
    } catch (error) {
      console.error('❌ Mappls Geocoding error:', error.message);
      
      if (error.response) {
        console.error('❌ Mappls API Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      
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
    if (!this.apiKey) {
      throw new Error('Mappls API key not configured');
    }

    try {
      console.log('🗺️ Mappls Reverse Geocoding:', { latitude, longitude });
      
      const response = await axios.get(`${this.baseURL}/${this.apiKey}/places/reverse`, {
        params: {
          lat: latitude,
          lng: longitude,
          itemCount: 1
        },
        timeout: 10000
      });

      if (response.data && response.data.suggestedLocations && response.data.suggestedLocations.length > 0) {
        const location = response.data.suggestedLocations[0];
        
        const result = {
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
          formattedAddress: location.placeName || `${latitude}, ${longitude}`,
          streetName: location.streetName || '',
          city: location.city || '',
          stateCode: location.state || '',
          zipcode: location.pincode || '',
          countryCode: location.country || 'IN',
          placeName: location.placeName,
          houseNumber: location.houseNumber || '',
          houseName: location.houseName || '',
          poi: location.poi || '',
          subSubLocality: location.subSubLocality || '',
          subLocality: location.subLocality || '',
          locality: location.locality || '',
          village: location.village || '',
          district: location.district || '',
          subDistrict: location.subDistrict || '',
          state: location.state || '',
          country: location.country || 'India'
        };

        console.log('✅ Mappls Reverse Geocoding successful:', {
          coordinates: [longitude, latitude],
          formattedAddress: result.formattedAddress
        });

        return [result];
      } else {
        console.warn('⚠️ No results found for coordinates:', { latitude, longitude });
        return [];
      }
    } catch (error) {
      console.error('❌ Mappls Reverse Geocoding error:', error.message);
      throw error;
    }
  }
}

// Create singleton instance
const mapplsGeocoder = new MapplsGeocoder();

module.exports = mapplsGeocoder;
