const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urban-realty', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Property = require('./server/models/Property');

async function checkPropertyCoordinates() {
  try {
    console.log('🔍 Checking all property coordinates...');
    
    const properties = await Property.find({});
    console.log(`\n📊 Total properties: ${properties.length}\n`);

    properties.forEach((property, index) => {
      console.log(`Property ${index + 1}: ${property.title}`);
      if (property.location && property.location.coordinates) {
        const [lng, lat] = property.location.coordinates;
        console.log(`  Coordinates: [${lng}, ${lat}]`);
        console.log(`  Formatted Address: ${property.location.formattedAddress || 'N/A'}`);
        
        // Check if coordinates are in India
        const isInIndia = lng >= 68 && lng <= 97 && lat >= 6.5 && lat <= 37.1;
        console.log(`  In India: ${isInIndia ? '✅' : '❌'}`);
        
        if (property.address) {
          console.log(`  Address: ${property.address.street || ''}, ${property.address.city || ''}, ${property.address.state || ''}`);
        }
      } else {
        console.log(`  No location data`);
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error checking coordinates:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkPropertyCoordinates();
