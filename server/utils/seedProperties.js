const mongoose = require('mongoose');
const Property = require('../models/Property');
const Developer = require('../models/Developer');

const seedProperties = async () => {
  try {
    // Clear existing properties
    await Property.deleteMany({});
    console.log('Cleared existing properties');

    // Get developers and users to use as references
    const developers = await Developer.find({});
    const users = await require('../models/User').find({});
    console.log(`Found ${developers.length} developers and ${users.length} users`);

    // Create a default agent if none exists
    let defaultAgent = users.find(u => u.role === 'agent');
    if (!defaultAgent && users.length > 0) {
      defaultAgent = users[0];
    }

    // Create sample properties
    const properties = [
      {
        _id: new mongoose.Types.ObjectId('68566b6b9b0fdb60e5cbcea4'),
        title: "Modern Apartment in Bandra",
        description: "A stunning modern apartment in the heart of Bandra with sea views and premium amenities. This 3BHK apartment offers spacious living areas, modern kitchen, and access to world-class facilities.",
        type: "Apartment",
        status: "For Sale",
        price: 5000000,
        bedrooms: 3,
        bathrooms: 2,
        area: 1200,
        address: {
          street: "123 Sea View Road",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400050",
          locality: "Bandra",
          country: "India"
        },
        location: {
          type: "Point",
          coordinates: [72.8261, 19.0596] // [lng, lat] for Bandra, Mumbai
        },
        images: [{
          url: "/placeholder-property.jpg",
          publicId: "placeholder-property-1"
        }],
        amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Elevator"],
        highlights: ["Sea View", "Prime Location", "Modern Amenities", "Near Metro"],
        developer: developers.length > 0 ? developers[0]._id : null,
        agent: defaultAgent ? defaultAgent._id : new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId('680cb6370b06b388af8e6ce4'),
        title: "Luxury Villa in Gurgaon",
        description: "An exquisite luxury villa in Gurgaon with golf course views. This 4BHK villa features premium finishes, private garden, and access to exclusive club facilities.",
        type: "Villa",
        status: "For Sale",
        price: 15000000,
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        address: {
          street: "456 Golf Course Road",
          city: "Gurgaon",
          state: "Haryana",
          zipCode: "122002",
          locality: "Golf Course Road",
          country: "India"
        },
        location: {
          type: "Point",
          coordinates: [77.1025, 28.4595] // [lng, lat] for Gurgaon
        },
        images: [{
          url: "/placeholder-property.jpg",
          publicId: "placeholder-property-2"
        }],
        amenities: ["Garden", "Parking", "Security", "Swimming Pool", "Gym"],
        highlights: ["Golf Course View", "Spacious", "Luxury Finishes", "Private Garden"],
        developer: developers.length > 1 ? developers[1]._id : null,
        agent: defaultAgent ? defaultAgent._id : new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId('68566b6b9b0fdb60e5cbcea5'),
        title: "Cozy 2BHK in Koramangala",
        description: "A well-maintained 2BHK apartment in Koramangala, perfect for young professionals. Close to IT parks and with good connectivity.",
        type: "Apartment",
        status: "For Rent",
        price: 25000,
        bedrooms: 2,
        bathrooms: 2,
        area: 900,
        address: {
          street: "789 Main Street",
          city: "Bangalore",
          state: "Karnataka",
          zipCode: "560034",
          locality: "Koramangala",
          country: "India"
        },
        location: {
          type: "Point",
          coordinates: [77.6245, 12.9352] // [lng, lat] for Koramangala, Bangalore
        },
        images: [{
          url: "/placeholder-property.jpg",
          publicId: "placeholder-property-3"
        }],
        amenities: ["Parking", "Security", "Elevator"],
        highlights: ["Near IT Parks", "Good Connectivity", "Well Maintained"],
        developer: null,
        agent: defaultAgent ? defaultAgent._id : new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert properties
    const createdProperties = await Property.insertMany(properties);
    console.log(`Created ${createdProperties.length} properties`);
    
    // Log the IDs for testing
    createdProperties.forEach(prop => {
      console.log(`${prop.title}: ${prop._id}`);
    });

    return createdProperties;
  } catch (error) {
    console.error('Error seeding properties:', error);
    throw error;
  }
};

module.exports = seedProperties;

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    return seedProperties();
  })
  .then(() => {
    console.log('Property seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}
