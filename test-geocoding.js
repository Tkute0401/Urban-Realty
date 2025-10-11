// test-geocoding.js
const hybridGeocoder = require('./server/utils/hybridGeocoder');

async function testGeocoding() {
  console.log('🧪 Testing Hybrid Geocoding...\n');
  
  const testAddresses = [
    'MG Road, Bangalore, Karnataka, India',
    'Connaught Place, New Delhi, Delhi, India',
    'Marine Drive, Mumbai, Maharashtra, India'
  ];

  for (const address of testAddresses) {
    try {
      console.log(`📍 Testing: ${address}`);
      const result = await hybridGeocoder.geocode(address);
      
      if (result && result.length > 0) {
        const location = result[0];
        console.log(`✅ Success:`, {
          coordinates: [location.longitude, location.latitude],
          formattedAddress: location.formattedAddress,
          city: location.city,
          state: location.stateCode
        });
      } else {
        console.log('❌ No results found');
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    console.log('---');
  }

  // Test reverse geocoding
  console.log('\n🔄 Testing Reverse Geocoding...\n');
  const testCoordinates = [
    { lat: 12.9716, lng: 77.5946 }, // Bangalore
    { lat: 28.6139, lng: 77.2090 }, // Delhi
    { lat: 19.0760, lng: 72.8777 }  // Mumbai
  ];

  for (const coord of testCoordinates) {
    try {
      console.log(`📍 Testing reverse: ${coord.lat}, ${coord.lng}`);
      const result = await hybridGeocoder.reverse(coord.lat, coord.lng);
      
      if (result && result.length > 0) {
        const location = result[0];
        console.log(`✅ Success:`, {
          formattedAddress: location.formattedAddress,
          city: location.city,
          state: location.stateCode
        });
      } else {
        console.log('❌ No results found');
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    console.log('---');
  }
}

testGeocoding().catch(console.error);
