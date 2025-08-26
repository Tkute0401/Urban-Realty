const Subscription = require('../models/Subscription');
const mongoose = require('mongoose');

const defaultSubscriptions = [
  {
    name: 'Free Plan',
    type: 'free',
    price: 0,
    billingCycle: 'monthly',
    features: {
      propertyListings: 0,
      advancedSearch: false,
      prioritySupport: false,
      analytics: false,
      customBranding: false,
      apiAccess: false
    },
    maxUsers: 1,
    description: 'Basic access to browse properties and contact agents',
    isActive: true
  },
  {
    name: 'Basic Plan',
    type: 'basic',
    price: 9.99,
    billingCycle: 'monthly',
    features: {
      propertyListings: 5,
      advancedSearch: true,
      prioritySupport: false,
      analytics: false,
      customBranding: false,
      apiAccess: false
    },
    maxUsers: 1,
    description: 'Perfect for individual professionals starting out',
    isActive: true
  },
  {
    name: 'Premium Plan',
    type: 'premium',
    price: 29.99,
    billingCycle: 'monthly',
    features: {
      propertyListings: 25,
      advancedSearch: true,
      prioritySupport: true,
      analytics: true,
      customBranding: false,
      apiAccess: false
    },
    maxUsers: 3,
    description: 'Ideal for growing businesses and teams',
    isActive: true
  },
  {
    name: 'Enterprise Plan',
    type: 'enterprise',
    price: 99.99,
    billingCycle: 'monthly',
    features: {
      propertyListings: 100,
      advancedSearch: true,
      prioritySupport: true,
      analytics: true,
      customBranding: true,
      apiAccess: true
    },
    maxUsers: 10,
    description: 'Full-featured plan for large organizations',
    isActive: true
  }
];

const seedSubscriptions = async () => {
  try {
    // Clear existing subscriptions
    await Subscription.deleteMany({});
    
    // Insert default subscriptions
    const subscriptions = await Subscription.insertMany(defaultSubscriptions);
    
    console.log('✅ Subscriptions seeded successfully:', subscriptions.length);
    return subscriptions;
  } catch (error) {
    console.error('❌ Error seeding subscriptions:', error);
    throw error;
  }
};

// Export for use in other files
module.exports = { seedSubscriptions, defaultSubscriptions };

// Run if this file is executed directly
if (require.main === module) {
  // Connect to MongoDB (you'll need to set up your connection string)
  const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urban-realty');
      console.log('MongoDB Connected');
      
      await seedSubscriptions();
      
      console.log('Seeding completed');
      process.exit(0);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  };
  
  connectDB();
}