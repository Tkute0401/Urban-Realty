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

async function createSubscriptionPlans() {
  const plans = [
    {
      name: 'Free Plan',
      type: 'free',
      price: 0,
      billingCycle: 'monthly',
      description: 'Basic access to browse properties and contact agents',
      features: {
        propertyListings: 0,
        advancedSearch: false,
        prioritySupport: false,
        analytics: false,
        customBranding: false,
        apiAccess: false
      },
      isActive: true
    },
    {
      name: 'Basic Plan',
      type: 'basic',
      price: 9.99,
      billingCycle: 'monthly',
      description: 'Perfect for individual professionals starting out',
      features: {
        propertyListings: 5,
        advancedSearch: true,
        prioritySupport: false,
        analytics: false,
        customBranding: false,
        apiAccess: false
      },
      isActive: true
    },
    {
      name: 'Premium Plan',
      type: 'premium',
      price: 29.99,
      billingCycle: 'monthly',
      description: 'Ideal for growing businesses and teams',
      features: {
        propertyListings: 25,
        advancedSearch: true,
        prioritySupport: true,
        analytics: true,
        customBranding: false,
        apiAccess: false
      },
      isActive: true
    },
    {
      name: 'Enterprise Plan',
      type: 'enterprise',
      price: 99.99,
      billingCycle: 'monthly',
      description: 'Full-featured plan for large organizations',
      features: {
        propertyListings: 100,
        advancedSearch: true,
        prioritySupport: true,
        analytics: true,
        customBranding: true,
        apiAccess: true
      },
      isActive: true
    }
  ];

  console.log('📋 Creating subscription plans...');
  
  for (const plan of plans) {
    try {
      // Check if plan already exists
      const existingPlan = await Subscription.findOne({ type: plan.type });
      
      if (existingPlan) {
        console.log(`➡️  Plan ${plan.name} already exists, updating...`);
        await Subscription.findByIdAndUpdate(existingPlan._id, plan, { new: true });
      } else {
        console.log(`➡️  Creating plan: ${plan.name}`);
        await Subscription.create(plan);
      }
    } catch (error) {
      console.error(`❌ Error creating plan ${plan.name}:`, error.message);
    }
  }
  
  console.log('✅ Subscription plans created/updated successfully');
}

async function ensureUsersHaveSubscriptionStatus() {
  console.log('👥 Ensuring all users have subscription status...');
  
  try {
    // Find users without subscription status
    const usersWithoutStatus = await User.find({ 
      $or: [
        { subscriptionStatus: { $exists: false } },
        { subscriptionStatus: null }
      ]
    });
    
    console.log(`Found ${usersWithoutStatus.length} users without subscription status`);
    
    for (const user of usersWithoutStatus) {
      user.subscriptionStatus = 'free';
      await user.save();
      console.log(`➡️  Updated user ${user.email} to free plan`);
    }
    
    // Create free subscriptions for users who don't have any
    const usersWithoutSubscriptions = await User.find({
      currentSubscription: { $exists: false }
    });
    
    console.log(`Found ${usersWithoutSubscriptions.length} users without current subscription`);
    
    const freePlan = await Subscription.findOne({ type: 'free' });
    if (!freePlan) {
      console.error('❌ Free plan not found');
      return;
    }
    
    for (const user of usersWithoutSubscriptions) {
      // Check if user already has a free subscription
      const existingSubscription = await UserSubscription.findOne({
        user: user._id,
        subscription: freePlan._id
      });
      
      if (!existingSubscription) {
        const freeSubscription = await UserSubscription.create({
          user: user._id,
          subscription: freePlan._id,
          billingCycle: 'monthly',
          startDate: new Date(),
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
          amount: 0,
          currency: 'USD',
          status: 'active',
          paymentStatus: 'paid',
          paymentMethod: 'free'
        });
        
        user.currentSubscription = freeSubscription._id;
        user.subscriptionStatus = 'free';
        await user.save();
        
        console.log(`➡️  Created free subscription for user ${user.email}`);
      }
    }
    
    console.log('✅ User subscription status updated successfully');
  } catch (error) {
    console.error('❌ Error updating user subscription status:', error);
  }
}

async function run() {
  await connectMongo();
  
  try {
    await createSubscriptionPlans();
    await ensureUsersHaveSubscriptionStatus();
    
    console.log('🎉 Setup completed successfully!');
  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

run();