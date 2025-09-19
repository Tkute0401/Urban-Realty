const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Subscription = require('./server/models/Subscription');

const subscriptionData = [
  {
    name: 'Free Plan',
    type: 'free',
    description: 'Perfect for getting started with basic features',
    price: 0,
    billingCycle: 'monthly',
    isActive: true,
    features: [
      'Up to 5 property listings',
      'Basic search functionality',
      'Email support',
      'Mobile app access'
    ],
    limits: {
      propertiesPerMonth: 5,
      photosPerProperty: 5,
      videoUploads: 0,
      featuredListings: 0,
      searchFilters: 3
    }
  },
  {
    name: 'Basic Plan',
    type: 'basic',
    description: 'Great for small teams and growing businesses',
    price: 29,
    billingCycle: 'monthly',
    isActive: true,
    features: [
      'Up to 50 property listings',
      'Advanced search & filters',
      'Priority email support',
      'Property analytics',
      'Lead management',
      'Mobile app access'
    ],
    limits: {
      propertiesPerMonth: 50,
      photosPerProperty: 15,
      videoUploads: 2,
      featuredListings: 3,
      searchFilters: 10
    }
  },
  {
    name: 'Premium Plan',
    type: 'premium',
    description: 'Perfect for established real estate professionals',
    price: 99,
    billingCycle: 'monthly',
    isActive: true,
    features: [
      'Up to 200 property listings',
      'All search & filter options',
      'Priority phone support',
      'Advanced analytics dashboard',
      'Lead management & CRM',
      'Virtual tour integration',
      'Custom branding',
      'Mobile app access'
    ],
    limits: {
      propertiesPerMonth: 200,
      photosPerProperty: 30,
      videoUploads: 10,
      featuredListings: 10,
      searchFilters: 25
    }
  },
  {
    name: 'Enterprise Plan',
    type: 'enterprise',
    description: 'Comprehensive solution for large agencies and developers',
    price: 299,
    billingCycle: 'monthly',
    isActive: true,
    features: [
      'Unlimited property listings',
      'All search & filter options',
      '24/7 priority support',
      'Advanced analytics & reports',
      'Full CRM integration',
      'API access',
      'Custom branding',
      'Multi-user management',
      'Virtual tour integration',
      'White-label solutions',
      'Dedicated account manager'
    ],
    limits: {
      propertiesPerMonth: -1, // Unlimited
      photosPerProperty: 50,
      videoUploads: -1, // Unlimited
      featuredListings: -1, // Unlimited
      searchFilters: -1 // Unlimited
    }
  }
];

async function seedSubscriptions() {
  try {
    console.log('🌱 Seeding subscription plans...');

    // Clear existing subscriptions
    await Subscription.deleteMany({});
    console.log('🗑️ Cleared existing subscription data');

    // Insert new subscription plans
    const subscriptions = await Subscription.insertMany(subscriptionData);
    console.log(`✅ Successfully seeded ${subscriptions.length} subscription plans:`);
    
    subscriptions.forEach(sub => {
      console.log(`  📋 ${sub.name} (ID: ${sub._id}) - ₹${sub.price}/${sub.billingCycle}`);
    });

    console.log('\n🎉 Subscription seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding subscriptions:', error.message);
    process.exit(1);
  }
}

seedSubscriptions();