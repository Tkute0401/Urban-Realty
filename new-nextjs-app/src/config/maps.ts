/**
 * Map Configuration
 * 
 * This file centralizes map API configuration.
 * The API key is safe to expose client-side as it's a public key
 * with domain restrictions on the Mappls dashboard.
 */

export const MAPPLS_CONFIG = {
  // API key with fallback
  apiKey: process.env.NEXT_PUBLIC_MAPPLS_API_KEY || 
          process.env.NEXT_PUBLIC_MAPMYINDIA_API_KEY || 
          '82f5c384638d8cfc7d13e310780bae89',
  
  // Default map settings
  defaultCenter: {
    lat: 28.6139,
    lng: 77.2090
  },
  
  defaultZoom: 12,
  
  // Script URL
  getScriptUrl: function() {
    return `https://apis.mappls.com/advancedmaps/api/${this.apiKey}/map_sdk?layer=vector&v=3.0`;
  },
  
  // Alternative script URL (if the above doesn't work)
  getAlternativeScriptUrl: function() {
    return `https://apis.mappls.com/advancedmaps/api/${this.apiKey}/map_sdk?layer=vector&v=2.0`;
  }
};

// Validate API key is available
export const isMapplsAvailable = () => {
  return Boolean(MAPPLS_CONFIG.apiKey);
};

