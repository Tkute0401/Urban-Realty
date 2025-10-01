// utils/geocoder.js
const NodeGeocoder = require('node-geocoder');

// MapTiles configuration
const options = {
  provider: 'openstreetmap', // Using OpenStreetMap as MapTiles alternative
  httpAdapter: 'https',
  formatter: null, // 'gpx', 'string', ...
  timeout: 30000,
  maxRetries: 5,
  language: 'en',
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;