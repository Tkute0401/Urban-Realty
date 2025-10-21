/**
 * Map Configuration
 * 
 * This file centralizes map API configuration.
 * The API key is safe to expose client-side as it's a public key
 * with domain restrictions on the Mappls dashboard.
 */

export const MAPPLS_CONFIG = {
  // API key - use the valid key from your console
  apiKey: process.env.NEXT_PUBLIC_MAPPLS_API_KEY || 
          process.env.NEXT_PUBLIC_MAPMYINDIA_API_KEY || 
          process.env.MAPPLS_API_KEY ||
          '82f5c384638d8cfc7d13e310780bae89', // Your valid API key from console
  
  // Default map settings
  defaultCenter: {
    lat: 28.6139,
    lng: 77.2090
  },
  
  defaultZoom: 12,
  
  // Latest Mappls Web Maps SDK URL (based on their GitHub repo)
  getScriptUrl: function() {
    if (!this.apiKey) {
      throw new Error('Mappls API key not configured');
    }
    // Using the latest web maps SDK from their GitHub repository
    return `https://apis.mappls.com/advancedmaps/api/${this.apiKey}/map_sdk?layer=vector&v=3.0`;
  },
  
  // Alternative script URL for fallback
  getAlternativeScriptUrl: function() {
    if (!this.apiKey) {
      throw new Error('Mappls API key not configured');
    }
    // Fallback to raster maps if vector fails
    return `https://apis.mappls.com/advancedmaps/api/${this.apiKey}/map_sdk?layer=raster&v=3.0`;
  }
};

// Validate API key is available
export const isMapplsAvailable = () => {
  return Boolean(MAPPLS_CONFIG.apiKey);
};

