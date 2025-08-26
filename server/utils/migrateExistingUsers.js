const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const UserSubscription = require('../models/UserSubscription');

const migrateExistingUsers = async () => {
  try {
    console.log('🔄 Starting migration of existing users...');
    
    // Find all users without subscriptionStatus field or with null/undefined values
    const usersToMigrate = await User.find({
      $or: [
        { subscriptionStatus: { $exists: false } },
        { subscriptionStatus: null },
        { subscriptionStatus: undefined }
      ]
    });
    
    console.log(`📊 Found ${usersToMigrate.length} users to migrate`);
    
    if (usersToMigrate.length === 0) {
      console.log('✅ No users need migration');
      return;
    }
    
    // Get the free subscription plan
    const freeSubscription = await Subscription.findOne({ type: 'free' });
    if (!freeSubscription) {
      console.error('❌ Free subscription plan not found. Please run seedSubscriptions first.');
      return;
    }
    
    let migratedCount = 0;
    
    for (const user of usersToMigrate) {
      try {
        // Update user with free subscription status
        await User.findByIdAndUpdate(user._id, {
          subscriptionStatus: 'free',
          $unset: { subscriptionExpiry: 1 } // Remove any existing expiry
        });
        
        // Create a UserSubscription record for tracking
        await UserSubscription.findOneAndUpdate(
          { user: user._id },
          {
            user: user._id,
            subscription: freeSubscription._id,
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10), // 10 years from now (effectively unlimited)
            billingCycle: 'monthly',
            amount: 0,
            currency: 'USD',
            paymentStatus: 'paid',
            autoRenew: false
          },
          { upsert: true, new: true }
        );
        
        migratedCount++;
        console.log(`✅ Migrated user: ${user.email} (${user._id})`);
      } catch (error) {
        console.error(`❌ Failed to migrate user ${user.email}:`, error.message);
      }
    }
    
    console.log(`🎉 Migration completed! Successfully migrated ${migratedCount}/${usersToMigrate.length} users`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Export for use in other files
module.exports = { migrateExistingUsers };

// Run if this file is executed directly
if (require.main === module) {
  const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://tanmay:1234@urbanrealty.rbqbb.mongodb.net/?retryWrites=true&w=majority&appName=UrbanRealty');
      console.log('MongoDB Connected');
      
      await migrateExistingUsers();
      
      console.log('Migration completed');
      process.exit(0);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  };
  
  connectDB();
}