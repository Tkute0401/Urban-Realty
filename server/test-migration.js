const mongoose = require('mongoose');
const User = require('./models/User');
const Subscription = require('./models/Subscription');
const UserSubscription = require('./models/UserSubscription');
const { migrateExistingUsers } = require('./utils/migrateExistingUsers');

const testMigration = async () => {
  try {
    console.log('🧪 Testing subscription migration system...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://tanmay:1234@urbanrealty.rbqbb.mongodb.net/?retryWrites=true&w=majority&appName=UrbanRealty');
    console.log('✅ MongoDB Connected\n');
    
    // Check if subscriptions exist
    const subscriptions = await Subscription.find({});
    console.log(`📊 Found ${subscriptions.length} subscription plans:`);
    subscriptions.forEach(sub => {
      console.log(`   - ${sub.type}: $${sub.price}/${sub.billingCycle}`);
    });
    console.log('');
    
    // Check current users
    const users = await User.find({}).select('email subscriptionStatus');
    console.log(`👥 Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`   - ${user.email}: ${user.subscriptionStatus || 'NO STATUS'}`);
    });
    console.log('');
    
    // Run migration
    console.log('🔄 Running migration...');
    await migrateExistingUsers();
    console.log('');
    
    // Check users after migration
    const updatedUsers = await User.find({}).select('email subscriptionStatus');
    console.log(`👥 Users after migration:`);
    updatedUsers.forEach(user => {
      console.log(`   - ${user.email}: ${user.subscriptionStatus}`);
    });
    console.log('');
    
    // Check UserSubscription records
    const userSubs = await UserSubscription.find({}).populate('subscription');
    console.log(`💳 UserSubscription records:`);
    userSubs.forEach(userSub => {
      console.log(`   - User: ${userSub.user}, Plan: ${userSub.subscription?.type}, Status: ${userSub.status}`);
    });
    console.log('');
    
    // Test subscription methods
    const testUser = await User.findOne({});
    if (testUser) {
      console.log(`🧪 Testing subscription methods for ${testUser.email}:`);
      console.log(`   - Has premium: ${testUser.hasSubscription('premium')}`);
      console.log(`   - Can access analytics: ${testUser.canAccessFeature('analytics')}`);
      console.log(`   - Can access advanced search: ${testUser.canAccessFeature('advancedSearch')}`);
      console.log(`   - Subscription info:`, testUser.getSubscriptionInfo());
    }
    
    console.log('\n✅ Migration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
    process.exit(0);
  }
};

// Run test
testMigration();