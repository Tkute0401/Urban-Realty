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

async function testSubscriptionSystem() {
  console.log('🧪 Testing subscription system...\n');

  // Test 1: Check if subscription plans exist
  console.log('1. Checking subscription plans...');
  const plans = await Subscription.find({ isActive: true }).sort({ price: 1 });
  console.log(`   Found ${plans.length} active plans:`);
  plans.forEach(plan => {
    console.log(`   - ${plan.name} (${plan.type}): $${plan.price}/${plan.billingCycle}`);
  });

  // Test 2: Check user subscription status
  console.log('\n2. Checking user subscription status...');
  const users = await User.find().limit(5);
  console.log(`   Found ${users.length} users to check:`);
  
  for (const user of users) {
    const userSub = await UserSubscription.findOne({ user: user._id }).populate('subscription');
    console.log(`   - ${user.email}: ${user.subscriptionStatus || 'no status'} (${userSub ? userSub.subscription?.name : 'no subscription'})`);
  }

  // Test 3: Check billing history
  console.log('\n3. Checking billing history...');
  const billingHistory = await UserSubscription.find().populate('subscription').populate('user', 'email');
  console.log(`   Found ${billingHistory.length} subscription records:`);
  
  billingHistory.slice(0, 5).forEach(record => {
    console.log(`   - ${record.user?.email}: ${record.subscription?.name} - $${record.amount} (${record.status})`);
  });

  // Test 4: Check for any issues
  console.log('\n4. Checking for potential issues...');
  
  const usersWithoutStatus = await User.find({ 
    $or: [
      { subscriptionStatus: { $exists: false } },
      { subscriptionStatus: null }
    ]
  });
  
  const usersWithoutSubscription = await User.find({
    currentSubscription: { $exists: false }
  });
  
  const pendingSubscriptions = await UserSubscription.find({ status: 'pending' });
  
  console.log(`   - Users without subscription status: ${usersWithoutStatus.length}`);
  console.log(`   - Users without current subscription: ${usersWithoutSubscription.length}`);
  console.log(`   - Pending subscriptions: ${pendingSubscriptions.length}`);

  if (usersWithoutStatus.length > 0 || usersWithoutSubscription.length > 0) {
    console.log('   ⚠️  Issues found! Running fix...');
    await runFix();
  } else {
    console.log('   ✅ No issues found!');
  }

  console.log('\n🎉 Subscription system test completed!');
}

async function runFix() {
  console.log('\n🔧 Running automatic fixes...');
  
  // Fix users without subscription status
  const usersWithoutStatus = await User.find({ 
    $or: [
      { subscriptionStatus: { $exists: false } },
      { subscriptionStatus: null }
    ]
  });
  
  for (const user of usersWithoutStatus) {
    user.subscriptionStatus = 'free';
    await user.save();
    console.log(`   - Fixed subscription status for ${user.email}`);
  }
  
  // Fix users without current subscription
  const usersWithoutSubscription = await User.find({
    currentSubscription: { $exists: false }
  });
  
  const freePlan = await Subscription.findOne({ type: 'free' });
  if (freePlan) {
    for (const user of usersWithoutSubscription) {
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
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
          amount: 0,
          currency: 'USD',
          status: 'active',
          paymentStatus: 'paid',
          paymentMethod: 'free'
        });
        
        user.currentSubscription = freeSubscription._id;
        user.subscriptionStatus = 'free';
        await user.save();
        
        console.log(`   - Created free subscription for ${user.email}`);
      }
    }
  }
  
  console.log('   ✅ Fixes completed!');
}

async function run() {
  await connectMongo();
  
  try {
    await testSubscriptionSystem();
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

run();