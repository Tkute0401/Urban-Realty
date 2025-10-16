/**
 * Map Configuration
 * 
 * This file centralizes map API configuration.
 * The API key is safe to expose client-side as it's a public key
 * with domain restrictions on the Mappls dashboard.
 */

export const MAPPLS_CONFIG = {
  // API key - only use environment variables, no hardcoded fallback
  apiKey: process.env.NEXT_PUBLIC_MAPPLS_API_KEY || 
          process.env.NEXT_PUBLIC_MAPMYINDIA_API_KEY || 
          null,
  
  // Default map settings
  defaultCenter: {
    lat: 28.6139,
    lng: 77.2090
  },
  
  defaultZoom: 12,
  
  // Script URL
  getScriptUrl: function() {
    if (!this.apiKey) {
      throw new Error('Mappls API key not configured');
    }
    return `https://apis.mappls.com/advancedmaps/api/${this.apiKey}/map_sdk?layer=vector&v=3.0`;
  },
  
  // Alternative script URL (if the above doesn't work)
  getAlternativeScriptUrl: function() {
    if (!this.apiKey) {
      throw new Error('Mappls API key not configured');
    }
    return `https://apis.mappls.com/advancedmaps/api/${this.apiKey}/map_sdk?layer=vector&v=2.0`;
  }
};

// Validate API key is available
export const isMapplsAvailable = () => {
  return Boolean(MAPPLS_CONFIG.apiKey);
};

