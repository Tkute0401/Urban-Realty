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

async function cleanupPendingSubscriptions() {
  console.log('🧹 Cleaning up pending subscriptions...\n');

  // Find all pending subscriptions
  const pendingSubscriptions = await UserSubscription.find({ status: 'pending' });
  console.log(`Found ${pendingSubscriptions.length} pending subscriptions`);

  for (const pending of pendingSubscriptions) {
    try {
      // Check if this is a Stripe-related pending subscription
      if (pending.stripeCheckoutSessionId) {
        // For Stripe pending subscriptions, we'll mark them as cancelled if they're old
        const daysOld = (Date.now() - pending.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        if (daysOld > 7) {
          pending.status = 'cancelled';
          pending.paymentStatus = 'failed';
          await pending.save();
          console.log(`   - Cancelled old pending Stripe subscription for user ${pending.user}`);
        }
      } else {
        // For non-Stripe pending subscriptions, convert to active if they're free
        const subscription = await Subscription.findById(pending.subscription);
        if (subscription && subscription.type === 'free') {
          pending.status = 'active';
          pending.paymentStatus = 'paid';
          await pending.save();
          console.log(`   - Activated free pending subscription for user ${pending.user}`);
        } else {
          // For paid subscriptions without Stripe, mark as cancelled
          pending.status = 'cancelled';
          pending.paymentStatus = 'failed';
          await pending.save();
          console.log(`   - Cancelled pending paid subscription for user ${pending.user}`);
        }
      }
    } catch (error) {
      console.error(`   - Error processing pending subscription ${pending._id}:`, error.message);
    }
  }

  // Ensure all users have current subscriptions
  const usersWithoutCurrentSubscription = await User.find({
    currentSubscription: { $exists: false }
  });

  console.log(`\nFound ${usersWithoutCurrentSubscription.length} users without current subscription`);

  const freePlan = await Subscription.findOne({ type: 'free' });
  if (freePlan) {
    for (const user of usersWithoutCurrentSubscription) {
      try {
        // Check if user already has a free subscription
        const existingSubscription = await UserSubscription.findOne({
          user: user._id,
          subscription: freePlan._id,
          status: 'active'
        });

        if (!existingSubscription) {
          const freeSubscription = await UserSubscription.create({
            user: user._id,
            subscription: freePlan._id,
            billingCycle: 'monthly',
            startDate: new Date(),
            endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
            amount: 0,
            currency: 'USD',
            status: 'active',
            paymentStatus: 'paid',
            paymentMethod: 'free'
          });

          user.currentSubscription = freeSubscription._id;
          user.subscriptionStatus = 'free';
          
          // Fix invalid role if needed
          const validRoles = ['buyer', 'agent', 'admin', 'painter', 'interior_designer', 'lawyer'];
          if (!validRoles.includes(user.role)) {
            user.role = 'buyer';
            console.log(`   - Fixed invalid role for user ${user.email} (set to 'buyer')`);
          }
          
          await user.save();

          console.log(`   - Created free subscription for user ${user.email}`);
        } else {
          user.currentSubscription = existingSubscription._id;
          user.subscriptionStatus = 'free';
          
          // Fix invalid role if needed
          const validRoles = ['buyer', 'agent', 'admin', 'painter', 'interior_designer', 'lawyer'];
          if (!validRoles.includes(user.role)) {
            user.role = 'buyer';
            console.log(`   - Fixed invalid role for user ${user.email} (set to 'buyer')`);
          }
          
          await user.save();
          console.log(`   - Linked existing free subscription for user ${user.email}`);
        }
      } catch (error) {
        console.error(`   - Error creating subscription for user ${user.email}:`, error.message);
      }
    }
  }

  console.log('\n✅ Cleanup completed!');
}

async function run() {
  await connectMongo();
  
  try {
    await cleanupPendingSubscriptions();
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

run();