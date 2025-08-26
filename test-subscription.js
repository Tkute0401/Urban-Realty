const mongoose = require('mongoose');
const { seedSubscriptions } = require('./server/utils/seedSubscriptions');

// Test the subscription seeding
async function testSubscriptionSystem() {
  try {
    console.log('🧪 Testing Subscription System...\n');
    
    // Connect to MongoDB (you'll need to set your connection string)
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/urban-realty';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Test subscription seeding
    console.log('\n📦 Seeding subscription plans...');
    const subscriptions = await seedSubscriptions();
    console.log(`✅ Successfully seeded ${subscriptions.length} subscription plans`);
    
    // Display the plans
    console.log('\n📋 Available Subscription Plans:');
    subscriptions.forEach((plan, index) => {
      console.log(`\n${index + 1}. ${plan.name} (${plan.type.toUpperCase()})`);
      console.log(`   Price: $${plan.price}/${plan.billingCycle}`);
      console.log(`   Features:`);
      console.log(`     - Property Listings: ${plan.features.propertyListings}`);
      console.log(`     - Advanced Search: ${plan.features.advancedSearch ? '✅' : '❌'}`);
      console.log(`     - Priority Support: ${plan.features.prioritySupport ? '✅' : '❌'}`);
      console.log(`     - Analytics: ${plan.features.analytics ? '✅' : '❌'}`);
      console.log(`     - Custom Branding: ${plan.features.customBranding ? '✅' : '❌'}`);
      console.log(`     - API Access: ${plan.features.apiAccess ? '✅' : '❌'}`);
      console.log(`   Max Users: ${plan.maxUsers}`);
      console.log(`   Description: ${plan.description}`);
    });
    
    console.log('\n🎉 Subscription system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing subscription system:', error.message);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testSubscriptionSystem();
}

module.exports = { testSubscriptionSystem };