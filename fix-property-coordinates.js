const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urban-realty', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Property = require('./server/models/Property');
const geocoder = require('./server/utils/hybridGeocoder');

async function fixPropertyCoordinates() {
  try {
    console.log('🔍 Checking properties with incorrect coordinates...');
    
    // Find properties with coordinates that are clearly wrong (outside India)
    // India coordinates roughly: lat: 6.5 to 37.1, lng: 68.1 to 97.4
    const wrongProperties = await Property.find({
      'location.coordinates.0': { $lt: 60 }, // longitude < 60 (should be > 68 for India)
      'location.coordinates.1': { $gt: 40 }  // latitude > 40 (should be < 37 for India)
    });

    console.log(`Found ${wrongProperties.length} properties with incorrect coordinates`);

    for (const property of wrongProperties) {
      console.log(`\n🔧 Fixing property: ${property.title}`);
      console.log(`Current coordinates: [${property.location.coordinates[0]}, ${property.location.coordinates[1]}]`);
      
      // Try to geocode using the address
      if (property.address) {
        try {
          const addressString = [
            property.address.street,
            property.address.city,
            property.address.state,
            property.address.country || 'India'
          ].filter(Boolean).join(', ');

          console.log(`🗺️ Geocoding address: ${addressString}`);
          
          const loc = await geocoder.geocode(addressString);
          
          if (loc && loc.length > 0) {
            const newCoordinates = [loc[0].longitude, loc[0].latitude];
            console.log(`✅ New coordinates: [${newCoordinates[0]}, ${newCoordinates[1]}]`);
            
            // Update the property
            property.location.coordinates = newCoordinates;
            property.location.formattedAddress = loc[0].formattedAddress;
            await property.save();
            
            console.log(`✅ Updated property: ${property.title}`);
          } else {
            console.log(`❌ Could not geocode: ${property.title}`);
            // Set to Delhi as fallback
            property.location.coordinates = [77.2090, 28.6139];
            property.location.formattedAddress = 'Delhi, India';
            await property.save();
            console.log(`📍 Set to Delhi fallback: ${property.title}`);
          }
        } catch (error) {
          console.error(`❌ Error geocoding ${property.title}:`, error.message);
          // Set to Delhi as fallback
          property.location.coordinates = [77.2090, 28.6139];
          property.location.formattedAddress = 'Delhi, India';
          await property.save();
          console.log(`📍 Set to Delhi fallback: ${property.title}`);
        }
      } else {
        console.log(`❌ No address found for: ${property.title}`);
        // Set to Delhi as fallback
        property.location.coordinates = [77.2090, 28.6139];
        property.location.formattedAddress = 'Delhi, India';
        await property.save();
        console.log(`📍 Set to Delhi fallback: ${property.title}`);
      }
    }

    console.log('\n✅ All properties fixed!');
    
    // Show final count
    const allProperties = await Property.find({});
    console.log(`\n📊 Total properties: ${allProperties.length}`);
    
    const indiaProperties = await Property.find({
      'location.coordinates.0': { $gte: 68, $lte: 97 }, // longitude in India range
      'location.coordinates.1': { $gte: 6.5, $lte: 37.1 } // latitude in India range
    });
    console.log(`🇮🇳 Properties in India: ${indiaProperties.length}`);

  } catch (error) {
    console.error('❌ Error fixing coordinates:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixPropertyCoordinates();
