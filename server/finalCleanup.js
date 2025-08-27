const mongoose = require('mongoose');
const Subscription = require('./models/Subscription');
const User = require('./models/User');
const UserSubscription = require('./models/UserSubscription');
require('dotenv').config({ path: `${__dirname}/.env` });

async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urban-realty');
    console.log('🗄️  MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}

async function finalCleanup() {
  console.log('🧹 FINAL CLEANUP - Resolving remaining pending subscriptions...\n');

  // Find all pending subscriptions
  const pendingSubscriptions = await UserSubscription.find({ status: 'pending' });
  console.log(`Found ${pendingSubscriptions.length} pending subscriptions to resolve`);

  for (const pending of pendingSubscriptions) {
    try {
      const subscription = await Subscription.findById(pending.subscription);
      const user = await User.findById(pending.user);
      
      if (!subscription || !user) {
        console.log(`   - Skipping invalid subscription ${pending._id} (missing subscription or user)`);
        continue;
      }

      // For free subscriptions, activate them
      if (subscription.type === 'free' || subscription.price === 0) {
        pending.status = 'active';
        pending.paymentStatus = 'paid';
        await pending.save();
        console.log(`   - Activated free subscription for ${user.email}`);
      } else {
        // For paid subscriptions, mark as cancelled (they need proper Stripe flow)
        pending.status = 'cancelled';
        pending.paymentStatus = 'failed';
        await pending.save();
        console.log(`   - Cancelled pending paid subscription for ${user.email} (${subscription.name})`);
      }
    } catch (error) {
      console.error(`   - Error processing pending subscription ${pending._id}:`, error.message);
    }
  }

  // Verify cleanup
  const remainingPending = await UserSubscription.countDocuments({ status: 'pending' });
  console.log(`\n✅ Cleanup completed! Remaining pending subscriptions: ${remainingPending}`);

  if (remainingPending === 0) {
    console.log('🎉 All pending subscriptions resolved!');
  } else {
    console.log('⚠️  Some pending subscriptions remain - may need manual review');
  }
}

async function run() {
  await connectMongo();
  
  try {
    await finalCleanup();
  } catch (error) {
    console.error('❌ Final cleanup failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

run();