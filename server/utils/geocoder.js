// utils/geocoder.js
const NodeGeocoder = require('node-geocoder');

// Google Maps configuration
const options = {
  provider: 'google',
  apiKey: process.env.GOOGLE_MAPS_API_KEY, // Make sure to add this to your .env
  httpAdapter: 'https',
  formatter: null, // 'gpx', 'string', ...
  timeout: 30000,
  maxRetries: 5,
  language: 'en',
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;